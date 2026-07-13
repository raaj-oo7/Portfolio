Every June, TC39 stamps a new edition of ECMAScript, and every year developers ask the same question: is there anything in it I'll actually use? For ES2026 the answer is an unusually loud yes. This edition is headlined by **explicit resource management** — the `using` declaration — which changes how we handle cleanup in JavaScript, plus a handful of smaller fixes that close real gaps in the language.

Here's what's in the box, why it matters, and how to adopt it without breaking anything.

## Why ES2026 Matters

JavaScript has always had a cleanup problem. Files, locks, database connections, streams, object URLs — anything you *open* must be *closed*, and the language gave you nothing but `try/finally` discipline. Forget one finally block, or return early through the wrong path, and you leak.

Other languages solved this ages ago: C# has `using`, Python has `with`, Rust has ownership. ES2026 brings JavaScript its own version — and unlike a lot of spec features, this one reshapes everyday application code, not just library internals.

The other theme of this edition is *smoothing*: fixes for old sharp edges (`Error.isError`, float summation) that don't ask you to learn anything new, just quietly make correct code easier to write.

## The Headliner: using and await using

A `using` declaration binds a resource and **guarantees its disposal when the block exits** — normally, via early return, or via a thrown exception. The resource just needs a `[Symbol.dispose]()` method (or `[Symbol.asyncDispose]()` for the async flavour).

```js
class TempDir {
  constructor(path) { this.path = makeDir(path) }
  [Symbol.dispose]() { removeDir(this.path) }   // always runs
}

function build() {
  using tmp = new TempDir('/tmp/build')
  compileInto(tmp.path)
  if (somethingWrong) return null   // tmp still cleaned up
  publish(tmp.path)
}                                    // ...and cleaned up here too
```

For async cleanup — closing connections, flushing streams — use `await using`:

```js
async function report() {
  await using db = await pool.connect()   // db[Symbol.asyncDispose] awaited on exit
  const rows = await db.query('SELECT ...')
  return summarize(rows)
}
```

Multiple `using` declarations dispose in **reverse order** (last opened, first closed), exactly like nested try/finally — and exceptions thrown during disposal don't swallow your original error; they combine into a `SuppressedError` so nothing disappears silently.

### DisposableStack for dynamic cleanup

When resources are created in loops or conditionally, `DisposableStack` collects them:

```js
function setupListeners(buttons) {
  using stack = new DisposableStack()
  for (const btn of buttons) {
    const handler = () => activate(btn)
    btn.addEventListener('click', handler)
    stack.defer(() => btn.removeEventListener('click', handler))
  }
  runInteraction()
} // every listener removed, in reverse order, guaranteed
```

`stack.defer(fn)` registers arbitrary cleanup; `stack.use(resource)` adopts anything disposable; `stack.move()` transfers ownership when a setup function succeeds and the caller should own cleanup. There's an `AsyncDisposableStack` twin for async work.

### Where this shines in frontend code

Don't dismiss this as a backend feature. Frontend has disposables everywhere:

- `URL.createObjectURL` → `revokeObjectURL`
- `AbortController` for fetch/event cancellation
- WebGL contexts, Web Audio nodes, workers
- Test setup/teardown (mock servers, fake timers)

Wrapping these once in small disposable helpers deletes entire categories of "forgot to clean up" bugs — the kind that show up as slow memory leaks nobody can reproduce.

## Error.isError()

Checking whether something is *actually* an Error sounds trivial and never was. `instanceof Error` fails across realms (iframes, workers, some VM sandboxes) because each realm has its own `Error` constructor. `Error.isError()` answers correctly regardless of origin:

```js
try {
  await thirdPartySdk.doThing()
} catch (err) {
  if (Error.isError(err)) {
    log(err.message, err.stack)
  } else {
    log('Non-error thrown:', String(err))   // yes, libraries throw strings
  }
}
```

It's the `Array.isArray()` of errors — a one-line upgrade for every catch block that inspects what it caught.

## Math.sumPrecise()

Floating-point addition accumulates error, and the order of operations changes the result:

```js
0.1 + 0.2                       // 0.30000000000000004 — the classic
[1e20, 0.1, -1e20].reduce((a, b) => a + b)  // 0 ... the 0.1 vanished!

Math.sumPrecise([1e20, 0.1, -1e20])          // 0.1 — correct
```

`Math.sumPrecise` takes an iterable and returns the sum as if computed with infinite precision, then rounded once. If you sum money, analytics values or physics data, replace your `reduce((a, b) => a + b, 0)` — it's more correct *and* clearly states intent.

## Rounding Out the Edition

A few smaller items land alongside the headliners:

- **`Atomics.pause()`** — a micro-wait hint for spin-lock code in multithreaded (SharedArrayBuffer) contexts. Niche, but the people who need it really need it.
- **Immutable ArrayBuffers** (`transferToImmutable()`) — buffers that can never be mutated again, enabling zero-copy sharing of binary data between workers without defensive copies.
- And a reminder that the *previous* edition's goodies — `RegExp.escape()`, `Promise.try()`, duplicate named capture groups — are now old enough that you should simply be using them.

> Temporal — the long-awaited replacement for `Date` — continues shipping across engines independently of this edition. Track its browser support separately; when your targets cover it, migrate date logic gradually and never look back.

## Compatibility and Migration

As of mid-2026, support looks like this:

- **`using` / `await using`**: current Chrome, Edge, Firefox and recent Node.js support it natively; Safari trails on older versions. TypeScript has supported the syntax since 5.2 and **transpiles it down** for older targets — so with a build step you can adopt today, everywhere.
- **`Error.isError`, `Math.sumPrecise`**: shipping in current evergreen browsers; both are trivially polyfillable (core-js has them) for legacy targets.

Migration advice, in order:

1. **Bump your tooling targets** — TypeScript ≥ 5.2 (ideally current), and set your bundler's output target to cover your real user base; let it decide what to down-compile.
2. **Start with new code** — write new resource-handling code with `using`; don't rewrite working try/finally blocks for sport.
3. **Wrap your recurring disposables** — one tiny `disposable()` helper per resource type (object URLs, listeners, controllers) gives the whole codebase leverage.
4. **Add lint support** — current ESLint versions parse the syntax; enable rules that flag unused disposables.

## Common Mistakes to Avoid

1. `using` with a value that isn't disposable — if it lacks `[Symbol.dispose]`, you get a TypeError at declaration time. Wrap third-party resources in a small adapter.
2. Expecting `using` at top level of a script — it's block-scoped by design; wrap in a function or block so "end of scope" is well-defined.
3. Forgetting `await using` for async disposal — plain `using` calls `[Symbol.dispose]` synchronously; an async cleanup needs the async form or it won't be awaited.
4. Assuming disposal order is declaration order — it's *reverse* order, deliberately, so dependent resources unwind correctly.
5. Using `Math.sumPrecise` on huge arrays in hot paths without measuring — correctness has a small cost; it's for sums that must be right, not every addition in a render loop.

## Tools and Resources

- **TC39 finished-proposals list** — the authoritative record of what's in each edition
- **TypeScript release notes (5.2+)** — how `using` transpiles and its type requirements (`Disposable`, `AsyncDisposable`)
- **core-js** — polyfills for `Error.isError` and `Math.sumPrecise`
- **MDN's Symbol.dispose pages** — with Baseline badges to track support
- **Node.js API docs** — core APIs (file handles, timers, streams) are progressively gaining native `Symbol.dispose` support; check what you can `using` for free

## Summary

ES2026 is the "stop leaking things" edition. `using` and `await using` give JavaScript deterministic cleanup with compiler-checkable ergonomics; `DisposableStack` handles the dynamic cases; `Error.isError` fixes cross-realm error checks; `Math.sumPrecise` fixes float summation. None of it is exotic — it's the everyday plumbing of reliable software, finally built into the language. Adopt via TypeScript today, lean on Baseline for the rest, and enjoy deleting some finally blocks.

## Frequently Asked Questions

### Can I use `using` in production right now?

Yes, with a build step: TypeScript 5.2+ and modern bundlers transpile it for older targets. Without a build step, check your audience — current evergreen browsers are fine; older Safari and stale WebViews are not yet.

### Does `using` replace try/finally completely?

For resource cleanup, mostly yes — and it's harder to get wrong. `try/finally` still has jobs `using` doesn't cover: cleanup that isn't tied to a resource object, or logic that must inspect whether an exception occurred.

### What happens if disposal itself throws?

The error doesn't vanish and doesn't silently replace your original error. Both are wrapped in a `SuppressedError`, with the original available on `.suppressed` — a genuine improvement over try/finally, which discards the first error.

### Is `Error.isError` just `instanceof Error`?

No — `instanceof` lies across realms (iframes, workers, node:vm), returning false for perfectly real errors created elsewhere. `Error.isError` checks the internal error slot and answers correctly everywhere. Use it in any library or error-reporting code.

### Should I refactor existing code to these features?

Refactor opportunistically, not wholesale. New code uses the new patterns; old code migrates when you're already touching it. The exception: if you have a known leak-prone area (event listeners, object URLs), a targeted `using` refactor there pays for itself immediately.

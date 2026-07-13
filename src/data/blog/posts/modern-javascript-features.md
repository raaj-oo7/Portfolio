JavaScript has a reputation problem: everyone remembers the language they learned years ago and assumes it's still that language. Meanwhile, the last few ECMAScript editions quietly shipped some of the most practical features in the language's history — and browser support caught up faster than most developers noticed.

This is a tour of the modern features I actually use in production code, why they beat the old patterns, and where the support caveats are.

## Why This Matters in 2026

Two things changed. First, the **Baseline** initiative made "can I use this?" a solved problem — features marked *Baseline Widely Available* work in every current browser, no transpiler required. Second, evergreen browsers and modern build tooling mean the gap between "in the spec" and "in your bundle" has collapsed from years to months.

The practical consequence: a lot of `lodash` imports, utility helpers and defensive boilerplate in your codebase are now dead weight. The language does it natively — usually faster and always with less code to maintain.

## Grouping Data: Object.groupBy and Map.groupBy

The feature I use most. Grouping an array by some key used to mean a reduce incantation everyone copy-pasted:

```js
// The old ritual
const byStatus = todos.reduce((acc, todo) => {
  (acc[todo.status] ??= []).push(todo)
  return acc
}, {})

// Now
const byStatus = Object.groupBy(todos, (todo) => todo.status)
// { pending: [...], done: [...] }

// Need non-string keys? Map.groupBy
const byUser = Map.groupBy(comments, (c) => c.author) // keys are user objects
```

Use `Object.groupBy` when your keys are strings, `Map.groupBy` when they're objects. Both are Baseline and supported everywhere current.

## Promise.withResolvers

Every codebase had this helper hand-written somewhere — a promise you can resolve from *outside* its constructor:

```js
const { promise, resolve, reject } = Promise.withResolvers()

// Classic use case: bridge an event API into a promise
button.addEventListener('click', () => resolve('clicked'), { once: true })
await promise
```

It's perfect for deferred patterns: waiting for a WebSocket to open, a modal to be answered, a stream to drain. No more `let resolveFn; new Promise(r => { resolveFn = r })` gymnastics.

## Set Finally Behaves Like a Set

Sets got the methods they were embarrassingly missing for a decade:

```js
const admins = new Set(['ana', 'raj', 'lee'])
const online = new Set(['raj', 'mia'])

admins.intersection(online)   // Set {'raj'}
admins.union(online)          // Set {'ana', 'raj', 'lee', 'mia'}
admins.difference(online)     // Set {'ana', 'lee'}
admins.isSupersetOf(online)   // false
```

Permissions checks, tag filtering, diffing two lists of IDs — all one-liners now. Delete your `arrayIntersection` util.

## Iterator Helpers: Lazy Chains Without a Library

Array methods like `.map()` and `.filter()` create a full intermediate array at every step. Iterator helpers run the same chain *lazily* — each item flows through the whole pipeline one at a time, and nothing computes until you consume it:

```js
function* events() { /* yields a potentially huge stream */ }

const firstThreeErrors = events()
  .filter((e) => e.level === 'error')
  .map((e) => e.message)
  .take(3)          // stops pulling after 3 matches!
  .toArray()
```

The `take(3)` is the magic: with arrays, you'd filter and map *everything* first. With iterators, processing stops the moment you have three results. For large datasets, pagination and streams, it's a different performance class. `drop`, `flatMap`, `some`, `every` and `reduce` are all there too.

## Array Niceties You'll Use Weekly

```js
const items = ['a', 'b', 'c', 'd']

items.at(-1)                    // 'd' — no more items[items.length - 1]

// Immutable variants — no accidental mutation of props/state
const sorted = scores.toSorted((a, b) => a - b)   // original untouched
const removed = list.toSpliced(1, 2)
const flipped = steps.toReversed()
const patched = row.with(2, 'edited')             // copy with index 2 replaced

users.findLast((u) => u.active)                   // search from the end
```

For React developers the `to*` immutable methods are quietly huge: `setItems(items.toSorted(byDate))` — no spread-then-sort dance, no mutated-prop bugs.

## Small But Mighty

- **Logical assignment** — `config.retries ??= 3` (assign only if nullish). Cleaner defaults everywhere.
- **`structuredClone(obj)`** — real deep cloning (Dates, Maps, Sets, nested objects) built in. Retire the `JSON.parse(JSON.stringify())` hack, which silently destroys Dates and `undefined`.
- **Top-level `await`** — in modules you can await at the top level: `const config = await fetch('/config').then(r => r.json())`. Great for setup code; use sparingly since it blocks module evaluation.
- **`Array.fromAsync()`** — like `Array.from` but for async iterables: `const pages = await Array.fromAsync(paginate(url))`.
- **RegExp `v` flag** — set operations and cleaner unicode handling in regexes, e.g. matching "letters except vowels" with `[\p{L}--[aeiou]]`.
- **`toWellFormed()` / `isWellFormed()`** — sanitise strings with lone surrogates before sending them over the wire (they otherwise throw in `encodeURI` and break JSON consumers).

## Real-World Example: A Dashboard Data Layer

Here's how several features compose in actual application code:

```js
async function loadDashboard(userIds) {
  // Deferred: UI can await this before data source is even chosen
  const { promise: ready, resolve } = Promise.withResolvers()

  const users = await Array.fromAsync(fetchUsersStream(userIds))

  // Group once, render many
  const byRole = Object.groupBy(users, (u) => u.role)

  // Set math for permissions
  const online = new Set(getOnlineIds())
  const admins = new Set(byRole.admin?.map((u) => u.id) ?? [])
  const onlineAdmins = admins.intersection(online)

  // Latest activity without sorting the world
  const recent = users
    .values()
    .filter((u) => u.lastSeen > Date.now() - 86_400_000)
    .take(10)
    .toArray()

  resolve({ byRole, onlineAdmins, recent })
  return ready
}
```

Every line of that used to be a helper function or a lodash import.

## Best Practices

- **Check Baseline, not blog posts.** MDN shows a Baseline badge on every feature page; *Widely Available* means ship it raw, *Newly Available* means transpile or polyfill if you support older devices.
- **Prefer immutable array methods in React code** — they align with how state updates are supposed to work and eliminate a whole bug class.
- **Reach for iterator helpers when data is big or infinite**; plain array methods are still fine (and more familiar) for small collections.
- **Adopt via lint rules.** Rules that flag `arr[arr.length - 1]` or `JSON.parse(JSON.stringify())` convert your team's muscle memory faster than any style guide document.

## Common Mistakes to Avoid

1. Expecting `Object.groupBy` to return a normal object prototype — it returns a null-prototype object, so `byStatus.hasOwnProperty` doesn't exist. Use `Object.hasOwn()` instead.
2. Using iterator helpers on an array and expecting an array back — chains on `.values()` return an iterator; call `.toArray()` at the end.
3. Treating `structuredClone` as universal — it can't clone functions, DOM nodes or class instances with methods; those still need bespoke handling.
4. Top-level await in a module that everything imports — you've just made your entire app's startup wait on one fetch. Keep it in leaf modules.
5. Shipping `Newly Available` features to a user base with old WebViews (embedded Android browsers are the usual victims) without a build step.

## Tools and Resources

- **MDN + Baseline badges** — the ground truth for support
- **caniuse.com** — still the quickest visual check per feature
- **TC39 proposals repo on GitHub** — watch what's coming before it lands
- **ESLint + `eslint-plugin-unicorn`** — rules that push modern idioms automatically
- **Vite/esbuild `target` config** — decide once which syntax gets transpiled, then stop thinking about it

## Summary

Modern JavaScript replaced a shelf of utility libraries: `groupBy` for shaping data, Set operations for membership math, iterator helpers for lazy pipelines, `Promise.withResolvers` for deferreds, immutable array methods for state-safe updates, and `structuredClone` for real copies. Nearly all of it is Baseline in 2026. The features aren't the hard part — updating your habits is. Pick two, use them this week, and let the linter teach the rest.

## Frequently Asked Questions

### Do I still need Babel or transpilation in 2026?

For most public web apps targeting evergreen browsers — no, at least not for language features (bundlers still handle JSX and TypeScript). You still want a build step if you support old enterprise WebViews, smart TVs or embedded browsers.

### Are these features slower than lodash equivalents?

Generally the opposite — native implementations are optimised in the engine and skip function-call overhead. Iterator helpers in particular can dramatically reduce memory pressure versus chained array methods on large data.

### What's the difference between Object.groupBy and Map.groupBy?

`Object.groupBy` coerces keys to strings and returns a null-prototype object; `Map.groupBy` preserves any value as a key (objects, numbers, booleans) and returns a Map. If you're grouping by anything that isn't naturally a string, use the Map version.

### Can I use iterator helpers with async data?

Async iterator helpers (the same methods on `AsyncIterator`) are a separate proposal still moving through TC39. Today, `Array.fromAsync` plus regular helpers covers most cases: collect first, then chain.

### How do I keep up with new JavaScript features without reading specs?

Follow the TC39 meeting summaries (published after each meeting), skim the annual "What's new in ES20XX" posts each June, and check MDN's Baseline status whenever you're tempted. That's 30 minutes a quarter for full coverage.

The first time I saw an Awwwards site of the day, I assumed the developers behind it had access to some secret animation library the rest of us didn't. They did — it just wasn't secret. It was GSAP, and it has been hiding in plain sight since 2008.

This guide is everything I wish someone had handed me before I shipped my first scroll-driven site: what GSAP actually is, the four concepts that cover 90% of real work, how ScrollTrigger changes the game, and how to wire all of it into React without fighting the framework.

## Why GSAP Still Matters in 2026

CSS animations have gotten genuinely good. We have `@keyframes`, transitions, the View Transitions API and even scroll-driven animations in CSS. So why reach for a JavaScript library at all?

Three reasons keep GSAP on top for serious animation work:

- **Sequencing.** CSS can animate one element well. Choreographing twelve elements with overlapping delays, staggers and reversals is where CSS collapses and GSAP timelines shine.
- **Scroll control.** ScrollTrigger gives you scrubbing, pinning and snapping with a few lines — behaviour that is still painful or impossible to express in pure CSS across browsers.
- **Consistency.** GSAP normalises browser quirks, handles interrupted animations gracefully, and its easing engine is more expressive than anything in CSS.

Since GSAP became 100% free in 2024 — including formerly paid plugins like SplitText and MorphSVG — there is no licensing excuse left. If motion is part of your product's personality, GSAP is still the professional's tool.

## Core Concepts: The Four Building Blocks

### 1. Tweens — the atom of GSAP

A tween animates properties of a target over time. Three methods cover almost everything:

```js
import gsap from 'gsap'

// FROM current state TO these values
gsap.to('.card', { y: -24, opacity: 1, duration: 0.8, ease: 'power3.out' })

// FROM these values back to the current state
gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1 })

// Explicit start AND end — the most predictable option
gsap.fromTo('.badge', { scale: 0 }, { scale: 1, ease: 'back.out(1.7)' })
```

A rule that will save you debugging hours: prefer `fromTo` for anything that can re-run. `gsap.from` reads the current state as its destination, so if it fires twice mid-animation, the "current state" is already half-animated and things end up stuck at the wrong values.

### 2. Easing — where the feel lives

Easing is the difference between motion that feels premium and motion that feels like a PowerPoint transition. GSAP's defaults to learn first:

- `power2.out` — the everyday workhorse for UI entrances
- `power4.out` — dramatic, fast-then-settle hero moments
- `back.out(1.7)` — playful overshoot for badges and buttons
- `expo.inOut` — cinematic full-screen transitions
- `elastic` and `bounce` — use once per site, at most

Open GSAP's ease visualizer and spend ten minutes there; it teaches more than any article can.

### 3. Timelines — choreography

Timelines are why GSAP exists. Instead of juggling delays, you describe a sequence and the library keeps everything in sync:

```js
const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })

tl.from('.nav', { y: -40, opacity: 0 })
  .from('.hero-title', { y: 60, opacity: 0 }, '-=0.3')   // overlap previous by 0.3s
  .from('.hero-copy', { y: 30, opacity: 0 }, '-=0.4')
  .from('.hero-cta', { scale: 0.8, opacity: 0 }, '<0.1') // 0.1s after previous START
```

The position parameter (`'-=0.3'`, `'<'`, `'+=0.5'`) is the real superpower. Overlapping animations by 30–40% is what makes sequences feel fluid instead of robotic — nothing in real life waits for the previous thing to fully finish.

### 4. Staggers — one line, big payoff

```js
gsap.from('.grid-item', {
  y: 40,
  opacity: 0,
  stagger: { each: 0.08, from: 'start' },
})
```

Staggering a grid of cards, nav links or split-text characters is the highest impact-to-effort trick in the entire library.

## ScrollTrigger: The Reason You're Here

ScrollTrigger connects any tween or timeline to scroll position. Register it once, then attach it via config:

```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.to('.panel img', {
  yPercent: -20,                    // classic parallax
  ease: 'none',                     // linear when scrubbing!
  scrollTrigger: {
    trigger: '.panel',
    start: 'top bottom',            // when panel's top hits viewport bottom
    end: 'bottom top',
    scrub: 0.6,                     // smoothly tie progress to scroll
  },
})
```

The three modes you will actually use:

1. **Trigger mode** (no `scrub`) — the animation plays once when the element enters. Use `toggleActions: 'play none none reverse'` for reveal-on-scroll sections.
2. **Scrub mode** — animation progress is bound to scroll progress. This is parallax, progress bars, and "drawing" timelines. Always use `ease: 'none'` here; the scroll itself provides the easing.
3. **Pin mode** (`pin: true`) — the trigger element sticks while the animation plays out. Horizontal scroll sections and step-by-step product stories are pins with a scrubbed timeline inside.

> Debugging tip: add `markers: true` during development. Nine out of ten ScrollTrigger bugs are just wrong `start`/`end` values, and markers make them obvious instantly.

### Smooth scrolling

Native scroll works fine with ScrollTrigger, but butter-smooth "lerped" scrolling usually comes from a companion library like Lenis. The integration is three lines: forward Lenis's scroll events to `ScrollTrigger.update()` and drive Lenis from GSAP's ticker. If you use smoothing, keep it subtle — `lerp: 0.1` reads as premium, `lerp: 0.03` reads as broken mouse.

### Text animations

Since SplitText went free, the classic line-by-line reveal costs almost nothing:

```js
import { SplitText } from 'gsap/SplitText'

const split = SplitText.create('.headline', { type: 'lines', mask: 'lines' })
gsap.from(split.lines, {
  yPercent: 110,
  stagger: 0.08,
  ease: 'power4.out',
  duration: 1,
})
```

Remember to call `split.revert()` on cleanup, and respect `prefers-reduced-motion` — a masked line reveal means nothing to someone who has animations disabled and everything hidden.

## GSAP + React: Do It the Sanctioned Way

React owns the DOM; GSAP mutates the DOM. The official `@gsap/react` package resolves that tension with the `useGSAP` hook, which automatically scopes selectors and cleans up on unmount:

```jsx
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function Hero() {
  const container = useRef(null)

  useGSAP(
    () => {
      // selectors are scoped to `container` — no global leaks
      gsap.timeline()
        .from('.title', { y: 60, opacity: 0 })
        .from('.subtitle', { y: 30, opacity: 0 }, '-=0.4')
    },
    { scope: container },
  )

  return (
    <section ref={container}>
      <h1 className="title">Hello</h1>
      <p className="subtitle">World</p>
    </section>
  )
}
```

Everything created inside the callback — tweens, timelines, ScrollTriggers — is reverted automatically when the component unmounts. That single behaviour eliminates the "duplicate ScrollTriggers after hot reload" bug that haunts every hand-rolled `useEffect` integration.

## Best Practices

- **Animate `transform` and `opacity` only.** `x`, `y`, `scale`, `rotate` and `opacity` are compositor-friendly. Animating `width`, `top` or `margin` triggers layout and murders your frame rate.
- **Set `defaults` on timelines.** One `defaults: { ease, duration }` keeps sequences consistent and files short.
- **Use `gsap.matchMedia()`** for responsive animation — it lets you register different animations per breakpoint *and* honour `prefers-reduced-motion` in the same API.
- **Create ScrollTriggers in document order.** Or set `refreshPriority` — triggers calculate their positions in creation order, and images loading late can shift everything (call `ScrollTrigger.refresh()` after layout settles).
- **Keep durations short.** UI motion lives between 0.2s and 0.8s. Anything longer needs a very good narrative reason.

## Common Mistakes to Avoid

1. Using `gsap.from` on elements that re-render — the double-run bug described above. Reach for `fromTo`.
2. Scrubbed animations with easing — `scrub` plus `power3.out` feels swimmy and disconnected. Scrub wants `ease: 'none'`.
3. Pinning inside a transformed parent — `pin` needs an untransformed ancestor; a parent with `transform` or `will-change` breaks the fixed positioning it relies on.
4. Animating layout properties — if Chrome DevTools' performance panel shows purple (layout) during your animation, you are animating the wrong property.
5. Forgetting cleanup in SPAs — every navigation that doesn't kill old ScrollTriggers leaves ghosts that fire on the wrong page. `useGSAP` or `gsap.context()` solves this.
6. Ignoring reduced motion — wrap decorative animation in a `matchMedia('(prefers-reduced-motion: no-preference)')` check. It's an accessibility requirement, not a nicety.

## Tools and Resources

- **GSAP docs and ease visualizer** — genuinely excellent, with runnable demos for every property
- **@gsap/react** — the official React hook; don't integrate by hand
- **Lenis** — the de-facto smooth-scroll companion
- **GSAP forums** — the maintainers still answer questions personally, which is rare and wonderful
- **CodePen's GSAP collections** — reverse-engineering award-site patterns is the fastest way to level up

## Summary

GSAP earns its place in 2026 the same way it always has: tweens for single movements, timelines for choreography, staggers for groups, and ScrollTrigger for everything tied to scroll. Animate transforms only, overlap your sequences, scrub without easing, and let `useGSAP` handle the React lifecycle. Master those few rules and the gap between your site and the award-winners becomes a matter of taste, not tooling.

## Frequently Asked Questions

### Is GSAP really free for commercial projects?

Yes. Since the Webflow acquisition in 2024, GSAP and all of its plugins — including SplitText, MorphSVG and ScrollSmoother — are free for commercial use. The old "Club GreenSock" paid tiers no longer exist.

### Should I use GSAP or Framer Motion in a React app?

Use Framer Motion for component-level UI state transitions (modals, list reordering, presence animations) where its declarative API shines. Use GSAP when you need complex sequencing, scroll-driven scenes or fine-grained control. Many production sites — including this portfolio — use both.

### Does GSAP hurt performance or bundle size?

The core is around 23KB gzipped, plus ~12KB for ScrollTrigger — comparable to Framer Motion. Performance-wise GSAP is usually *faster* than hand-written CSS/JS because it batches DOM reads and writes on a single ticker.

### How do I make GSAP work with server-side rendering (Next.js)?

Run animations only on the client: `useGSAP` already does this correctly since it runs after mount. Never create tweens at module top-level, and guard any manual code with a mount check so the server never touches `window`.

### What's the fastest way to learn ScrollTrigger properly?

Build three specific things: a reveal-on-scroll section (trigger mode), a parallax hero (scrub mode) and a pinned horizontal gallery (pin mode). Those three cover every mechanism ScrollTrigger has, and every fancy effect you have seen is a combination of them.

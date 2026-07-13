# Raj Makadia — Interactive 3D Portfolio

A premium, production-ready portfolio: cinematic loading intro, an interactive **3D developer workspace** hero, a **Skills Galaxy**, GSAP + Lenis scroll experience, an **AI portfolio assistant**, and an EmailJS-powered contact form — all wrapped in glassmorphism, aurora gradients and a dark/light theme.

![Stack](https://img.shields.io/badge/React_19-Vite_8-6366f1) ![3D](https://img.shields.io/badge/Three.js-R3F_9-a855f7) ![Style](https://img.shields.io/badge/Tailwind_4-Framer_Motion-22d3ee)

## ✨ Feature map

| Area | What's inside |
| --- | --- |
| Landing | Animated loading screen → logo + progress → particle reveal → hero fade-in |
| Hero | Fullscreen 3D workspace (desk, laptop, dual monitors, RGB keyboard, steaming mug, holograms, city window), typing animation, magnetic CTAs |
| 3D interactions | Hover laptop → project preview · hover monitors → skills · hover keyboard → typing wave · hover mug → steam · camera follows mouse · click objects → navigate |
| Skills | Orbiting planet galaxy — hover tooltips, click for a detail panel |
| Projects | Device mockups (laptop / browser / phone), tilt, hover actions, tag filtering |
| Blog | `/blog` with 6 SEO-optimized articles — markdown files in `src/data/blog/posts/`, per-post meta tags + JSON-LD, reading time, categories, prev/next |
| AI assistant | Floating chatbot with markdown + code highlighting; works offline via a local knowledge engine, upgrades to OpenAI with a key |
| Extras | Custom magnetic cursor + trail, tsParticles field, aurora background, scroll progress, achievements modal, animated counters, back-to-top |
| Quality | TypeScript strict, error boundaries, lazy-loaded sections, adaptive 3D quality for mobile, reduced-motion support, semantic HTML + ARIA, SEO (OG/Twitter/JSON-LD/sitemap/robots) |

## 🚀 Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Requires Node 20+.

## 🔧 Configuration

All content lives in **`src/data/portfolio.ts`** — name, roles, bio, skills, experience, projects, services, achievements, contact details. Edit that one file and the whole site updates.

Optional integrations go in `.env.local` (copy from `.env.example`):

```bash
VITE_GITHUB_USERNAME=your-github-username   # GitHub profile links
VITE_EMAILJS_SERVICE_ID=...                 # contact form
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_OPENAI_API_KEY=...                     # AI assistant (optional — see warning below)
```

- **Contact form (production — Resend)**: the form posts to `/api/contact` (a Vercel serverless function in `api/contact.ts`) which validates server-side, checks Cloudflare Turnstile + a honeypot + per-IP rate limiting, then sends **two emails via Resend**: a styled admin notification (with Reply-To set to the visitor) and an auto-reply confirmation to the visitor. Setup: (1) create a [Resend](https://resend.com) account and verify your domain, (2) in the Vercel dashboard set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and optionally `TURNSTILE_SECRET_KEY`, (3) set `VITE_TURNSTILE_SITE_KEY` for the widget. Test locally with `vercel dev`.
- **EmailJS (fallback)**: used automatically when `/api/contact` isn't deployed. Create a service + template at [emailjs.com](https://www.emailjs.com); template variables: `from_name`, `reply_to`, `subject`, `message`. With neither configured, dev builds simulate a successful send.
- **AI assistant**: with no key it answers from a built-in knowledge base generated from `portfolio.ts`. ⚠️ A `VITE_*` key is bundled into client JS — for production route OpenAI calls through a serverless function instead.
- **Resume**: drop your PDF at `public/resume.pdf`.
- **Portrait**: replace the monogram card in `src/sections/About.tsx` with `public/avatar.jpg` when ready.
- **Domain**: search-and-replace `rajmakadia.dev` in `index.html`, `public/sitemap.xml` and `public/robots.txt`.

## 📁 Architecture

```
src/
├── animations/   # shared Framer Motion variants
├── components/   # chrome: cursor, particles, aurora, navbar, loader, chat/
│   └── ui/       # GlassCard, MagneticButton, SectionHeading
├── constants/    # nav + section ids
├── data/         # ← ALL portfolio content (edit me)
│   └── blog/     # blog metadata + posts/*.md articles
├── hooks/        # useLenis, useDeviceQuality, useActiveSection
├── layouts/      # MainLayout (global chrome)
├── pages/        # Home (lazy-loads every section)
├── sections/     # Hero, About, Skills, Experience, Projects, …
├── services/     # email.ts, ai.ts
├── store/        # zustand app store (theme, quality, intro, chat)
├── styles/       # Tailwind 4 theme + utilities
├── three/        # WorkspaceScene, SkillsGalaxy (R3F)
└── utils/        # cn, scrollToSection, math helpers
```

## ⚡ Performance notes

- Hero 3D and every below-the-fold section are **code-split** (`React.lazy`) with manual vendor chunks for three/motion/particles.
- **Adaptive quality**: mobile / low-core / low-memory / reduced-motion devices automatically drop bloom, shadows and particle counts.
- `prefers-reduced-motion` disables Lenis, cursor effects and decorative animation globally.

## 🌐 Deployment

**Vercel** (recommended): import the repo → framework auto-detected (Vite) → add env vars → deploy. SPA rewrites work out of the box.

**Netlify**: build command `npm run build`, publish directory `dist`, and add a redirect for the SPA router:

```
# public/_redirects
/*  /index.html  200
```

**GitHub Pages**: set `base` in `vite.config.ts` to `'/<repo-name>/'`, build, and publish `dist/` (e.g. with `gh-pages`).

---

Built with React 19 · TypeScript · Vite 8 · Tailwind 4 · Three.js / React Three Fiber · GSAP · Framer Motion · Lenis · Zustand · tsParticles · EmailJS

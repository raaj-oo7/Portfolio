import gsapContent from './posts/gsap-animation-masterclass.md?raw'
import copilotContent from './posts/github-copilot-complete-guide.md?raw'
import modernJsContent from './posts/modern-javascript-features.md?raw'
import es2026Content from './posts/javascript-es2026-features.md?raw'
import aiToolsContent from './posts/ai-tools-react-developers.md?raw'
import roadmapContent from './posts/frontend-developer-roadmap-2026.md?raw'

export interface BlogPost {
  slug: string
  /** Display title shown on cards and the article page */
  title: string
  /** <title> tag used for SEO */
  seoTitle: string
  /** 150–160 char meta description */
  metaDescription: string
  keywords: string[]
  /** What the featured image should depict (swap in a real image later) */
  featuredImageIdea: string
  category: 'Animation' | 'AI Tools' | 'JavaScript' | 'Career'
  date: string // ISO date
  excerpt: string
  accent: string
  content: string
}

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200))
}

const posts: BlogPost[] = [
  {
    slug: 'gsap-animation-masterclass',
    title: 'GSAP Animation Masterclass: From Zero to Scroll-Driven Hero',
    seoTitle: 'GSAP Animation Tutorial 2026 — Timelines, ScrollTrigger & React Guide',
    metaDescription:
      'Master GSAP in 2026: tweens, timelines, ScrollTrigger, smooth scrolling, text effects and React integration — with real code, best practices and pitfalls.',
    keywords: ['GSAP tutorial', 'ScrollTrigger', 'GSAP React', 'web animation', 'smooth scrolling', 'GSAP timeline'],
    featuredImageIdea:
      'Dark hero with a glowing green GSAP-style easing curve flowing across a code editor, motion-blur particles trailing it.',
    category: 'Animation',
    date: '2026-06-18',
    excerpt:
      'Everything I wish I knew before shipping my first GSAP-powered site: tweens, timelines, ScrollTrigger, and how to make it all play nicely with React.',
    accent: '#34d399',
    content: gsapContent,
  },
  {
    slug: 'github-copilot-complete-guide',
    title: 'GitHub Copilot: The Complete Guide for React Developers',
    seoTitle: 'GitHub Copilot Guide 2026 — Setup, Features, Tips & Limitations',
    metaDescription:
      'What GitHub Copilot is, how it works, and how React developers get the most from it in 2026 — setup, chat, agents, prompt tips, limits and privacy.',
    keywords: ['GitHub Copilot', 'AI pair programming', 'Copilot tips', 'Copilot React', 'AI coding assistant'],
    featuredImageIdea:
      'A split-screen editor: left side half-written React component, right side Copilot ghost-text completing it, soft blue glow.',
    category: 'AI Tools',
    date: '2026-05-30',
    excerpt:
      'Copilot went from autocomplete party trick to a genuine teammate. Here is how it works under the hood and how to make it earn its subscription.',
    accent: '#22d3ee',
    content: copilotContent,
  },
  {
    slug: 'modern-javascript-features',
    title: 'Modern JavaScript Features You Should Actually Be Using',
    seoTitle: 'Modern JavaScript Features 2026 — Practical Guide with Examples',
    metaDescription:
      'The modern JavaScript features worth adopting in 2026 — groupBy, Set methods, iterator helpers, Promise.withResolvers and more, with real examples.',
    keywords: ['modern JavaScript', 'ES2024', 'ES2025', 'JavaScript features', 'Object.groupBy', 'iterator helpers'],
    featuredImageIdea:
      'Neon yellow JS logo dissolving into fresh green syntax tokens on a dark terminal background.',
    category: 'JavaScript',
    date: '2026-04-22',
    excerpt:
      'The language quietly got great. These are the recent additions that actually change day-to-day code — not just spec trivia.',
    accent: '#fbbf24',
    content: modernJsContent,
  },
  {
    slug: 'javascript-es2026-features',
    title: 'JavaScript ES2026: What’s New and What It Means for Your Code',
    seoTitle: 'JavaScript ES2026 Features Explained — using, Error.isError & More',
    metaDescription:
      'A practical tour of ES2026: explicit resource management with using, Error.isError, Math.sumPrecise, compatibility notes and migration advice.',
    keywords: ['ES2026', 'JavaScript 2026', 'using declaration', 'explicit resource management', 'ECMAScript'],
    featuredImageIdea:
      'A roadmap-style timeline of ECMAScript editions ending in a glowing 2026 node, purple-cyan gradient.',
    category: 'JavaScript',
    date: '2026-07-05',
    excerpt:
      'The 2026 edition of ECMAScript is the most practical release in years. Here is what landed, what it replaces, and how to adopt it safely.',
    accent: '#a855f7',
    content: es2026Content,
  },
  {
    slug: 'ai-tools-react-developers',
    title: 'AI Tools Every React Developer Should Know in 2026',
    seoTitle: 'Best AI Tools for React Developers 2026 — Copilot, Cursor, Claude, v0',
    metaDescription:
      'A field guide to the AI tools that matter for React developers in 2026 — Copilot, Cursor, Claude, ChatGPT, v0, Bolt, Lovable, Windsurf — and when to use each.',
    keywords: ['AI tools for developers', 'Cursor editor', 'Claude Code', 'v0 Vercel', 'Bolt.new', 'AI React development'],
    featuredImageIdea:
      'A developer desk seen from above, with holographic logos of AI tools orbiting a React atom in the centre.',
    category: 'AI Tools',
    date: '2026-06-02',
    excerpt:
      'There are too many AI dev tools and not enough time. This is the shortlist I actually use, what each one is best at, and where they fall over.',
    accent: '#6366f1',
    content: aiToolsContent,
  },
  {
    slug: 'frontend-developer-roadmap-2026',
    title: 'Frontend Developer Roadmap 2026: A No-Fluff Path',
    seoTitle: 'Frontend Developer Roadmap 2026 — Skills, Tools & Learning Order',
    metaDescription:
      'The complete frontend roadmap for 2026: HTML, CSS, JavaScript, TypeScript, React, Next.js, testing, CI/CD, performance, AI tools and cloud basics.',
    keywords: ['frontend roadmap 2026', 'learn React', 'frontend developer skills', 'web development roadmap', 'TypeScript roadmap'],
    featuredImageIdea:
      'A subway-map style diagram where each line is a skill track (HTML, CSS, JS, React, DevOps) converging at a “Frontend Engineer” terminus.',
    category: 'Career',
    date: '2026-03-15',
    excerpt:
      'Skip the 400-node roadmap graphics. This is the realistic order to learn frontend in 2026 — and why each stop on the route earns its place.',
    accent: '#f472b6',
    content: roadmapContent,
  },
]

export const blogPosts: BlogPost[] = posts.sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getReadingTime(post: BlogPost): number {
  return readingTime(post.content)
}

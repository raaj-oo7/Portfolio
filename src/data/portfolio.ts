/**
 * Single source of truth for all portfolio content.
 * Edit this file to update every section of the site.
 */

export const personal = {
  name: 'Raj Makadia',
  firstName: 'Raj',
  roles: ['React Developer', 'Frontend Engineer', 'AI Enthusiast', 'Creative Developer'],
  tagline:
    'I build beautiful, scalable, and immersive web experiences using React, AI, and modern web technologies.',
  email: 'raj.makadia22@gmail.com',
  phone: '+91 96241 18199',
  location: 'Gujarat, India',
  website: 'https://rajmakadia.dev',
  resumeUrl: '/resume.pdf',
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME || 'raaj-oo7',
  avatar: '/avatar.jpg',
} as const

export const socials = [
  { label: 'GitHub', href: 'https://github.com/raaj-oo7', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raj-makadia-458b1a276/', icon: 'linkedin' },
  { label: 'Twitter / X', href: 'https://x.com/Raaj_2401', icon: 'twitter' },
  { label: 'Email', href: 'mailto:raj.makadia22@gmail.com', icon: 'mail' },
] as const

export const about = {
  bio: [
    'I am a frontend engineer obsessed with the intersection of design, motion and code. For the past several years I have been crafting interfaces that feel alive — from real-time dashboards to immersive 3D product experiences.',
    'My toolkit centres on React, TypeScript and Three.js, and lately I have been integrating AI copilots and LLM-powered features into production apps. I care deeply about performance budgets, accessibility and the small details that make software feel premium.',
    'When I am not shipping, I am exploring WebGL shaders, contributing to open source, or reverse-engineering award-winning websites to learn how they were built.',
  ],
  stats: [
    { label: 'Years Experience', value: 4, suffix: '+' },
    { label: 'Projects Delivered', value: 32, suffix: '+' },
    { label: 'Technologies', value: 24, suffix: '+' },
    { label: 'Happy Clients', value: 18, suffix: '+' },
  ],
  journey: [
    { year: '2022', title: 'Started professional development', text: 'First internship building React dashboards.' },
    { year: '2023', title: 'Frontend Engineer', text: 'Shipped design systems and data-heavy SPAs.' },
    { year: '2024', title: 'Creative developer era', text: 'Three.js, GSAP and WebGL entered the toolkit.' },
    { year: '2025', title: 'AI integration', text: 'LLM copilots, RAG chatbots and AI-first UX in production.' },
    { year: '2026', title: 'Today', text: 'Building immersive, AI-powered products end to end.' },
  ],
} as const

export type Skill = {
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Language' | 'AI'
  level: number // 0–100
  years: number
  color: string
  description: string
  highlights: string[]
}

export const skills: Skill[] = [
  {
    name: 'React',
    category: 'Frontend',
    level: 95,
    years: 4,
    color: '#61dafb',
    description: 'My core weapon. Hooks, Suspense, concurrent rendering, RSC patterns and everything in between.',
    highlights: ['React 19 & Server Components', 'Performance profiling', 'Design systems', 'Micro-frontends'],
  },
  {
    name: 'TypeScript',
    category: 'Language',
    level: 92,
    years: 4,
    color: '#3178c6',
    description: 'Strict-mode TypeScript everywhere. Advanced generics, discriminated unions and type-safe APIs.',
    highlights: ['Strict mode advocate', 'Type-level programming', 'Zod & runtime validation'],
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    level: 88,
    years: 3,
    color: '#ffffff',
    description: 'App Router, ISR, streaming SSR, edge middleware and full-stack React applications.',
    highlights: ['App Router', 'Edge runtime', 'SEO engineering'],
  },
  {
    name: 'Three.js',
    category: 'Frontend',
    level: 82,
    years: 2,
    color: '#a855f7',
    description: 'WebGL scenes, custom shaders, React Three Fiber and performant 3D storytelling on the web.',
    highlights: ['React Three Fiber', 'GLSL shaders', 'Scroll-driven 3D'],
  },
  {
    name: 'Node.js',
    category: 'Backend',
    level: 85,
    years: 3,
    color: '#8cc84b',
    description: 'REST & GraphQL APIs, websockets, workers and serverless functions.',
    highlights: ['Express / Fastify', 'GraphQL', 'WebSockets'],
  },
  {
    name: 'JavaScript',
    category: 'Language',
    level: 88,
    years: 4,
    color: '#f7df1e',
    description:
      'The language underneath it all — closures, the event loop, async patterns and modern ES features, learned by building dozens of vanilla-JS projects before any framework.',
    highlights: ['ES2024+ features', 'Async & the event loop', 'DOM APIs & browser internals', 'OOP & functional patterns'],
  },
  {
    name: 'HTML',
    category: 'Frontend',
    level: 95,
    years: 4,
    color: '#f97316',
    description:
      'Semantic, accessible markup as the foundation of every project — landmarks, forms done right, and SEO-friendly document structure.',
    highlights: ['Semantic structure', 'Accessibility (ARIA)', 'Forms & validation', 'SEO-friendly markup'],
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    level: 94,
    years: 3,
    color: '#22d3ee',
    description: 'Utility-first styling with design tokens, dark mode and fully custom design systems.',
    highlights: ['Tailwind v4', 'Design tokens', 'Motion-safe styling'],
  },
  {
    name: 'AWS',
    category: 'DevOps',
    level: 68,
    years: 2,
    color: '#f59e0b',
    description: 'S3, CloudFront, Lambda and Amplify for scalable frontend infrastructure.',
    highlights: ['S3 + CloudFront', 'Lambda', 'Route 53'],
  },
  {
    name: 'AI / LLMs',
    category: 'AI',
    level: 84,
    years: 2,
    color: '#34d399',
    description: 'LLM-powered product features: RAG chatbots, streaming completions, embeddings and agents.',
    highlights: ['OpenAI & Claude APIs', 'RAG pipelines', 'Prompt engineering'],
  },
]

export type ExperienceItem = {
  role: string
  company: string
  period: string
  location: string
  summary: string
  responsibilities: string[]
  tech: string[]
}

export const experience: ExperienceItem[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Fuselio Automation',
    period: '2025 — Present',
    location: 'Remote',
    summary:
      'Leading frontend architecture for AI-powered automation products — design system, 3D marketing experiences and LLM copilot features.',
    responsibilities: [
      'Architected a React 19 + TypeScript platform serving 40k+ monthly users',
      'Built an in-app AI assistant with streaming responses and RAG over product docs',
      'Cut Largest Contentful Paint from 4.2s to 1.3s through code-splitting and asset budgets',
      'Mentored 3 junior developers and established frontend review standards',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'Three.js', 'OpenAI', 'Tailwind'],
  },
  {
    role: 'Frontend Engineer',
    company: 'PixelForge Studio',
    period: '2023 — 2025',
    location: 'Ahmedabad, India',
    summary:
      'Built interactive marketing sites and dashboards for startups — heavy GSAP/scroll animation work and data visualisation.',
    responsibilities: [
      'Shipped 12+ client websites, three of which received design-award nominations',
      'Created a reusable GSAP + ScrollTrigger animation toolkit used across all projects',
      'Introduced TypeScript and testing culture, reducing production bugs by ~40%',
    ],
    tech: ['React', 'GSAP', 'Framer Motion', 'Node.js', 'MongoDB'],
  },
  {
    role: 'Web Developer (Intern → Junior)',
    company: 'TechNova Solutions',
    period: '2022 — 2023',
    location: 'Rajkot, India',
    summary:
      'Started with admin dashboards and internal tools; grew into owning full frontend features end to end.',
    responsibilities: [
      'Developed responsive dashboards with charts, tables and role-based access',
      'Migrated a legacy jQuery codebase to modern React',
      'Collaborated with designers to implement pixel-perfect UI from Figma',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Firebase'],
  },
]

export type Project = {
  title: string
  description: string
  longDescription: string
  tags: ('React' | 'JavaScript' | 'AI' | 'Full Stack' | 'UI/UX')[]
  tech: string[]
  github: string
  demo: string
  accent: string
  device: 'laptop' | 'browser' | 'mobile'
  /** Exact GitHub repo name — used to sync live data from the GitHub API */
  repo?: string
  image?: string
}

/**
 * Curated cards for repos on github.com/raaj-oo7.
 * The Projects section fetches the live repo list at runtime and merges it
 * with these entries (fresh links, plus auto-cards for brand-new repos).
 * This list is also the offline fallback and the AI assistant's knowledge.
 */
export const projects: Project[] = [
  {
    repo: 'fuselio-jira-clone',
    title: 'Fuselio Jira Clone',
    description: 'Jira-style project management platform — Kanban boards, teams, comments and attachments.',
    longDescription:
      'A full-stack project management suite inspired by Jira: drag-and-drop Kanban boards, real authentication, team invites, threaded comments and file attachments. Built in TypeScript end to end.',
    tags: ['React', 'Full Stack', 'UI/UX'],
    tech: ['React', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/raaj-oo7/fuselio-jira-clone',
    demo: 'https://github.com/raaj-oo7/fuselio-jira-clone',
    accent: '#6366f1',
    device: 'browser',
  },
  {
    repo: 'TMDB-clone',
    title: 'TMDB Movie Explorer',
    description: 'Movie discovery app powered by the TMDB API — trending titles, search and detail pages.',
    longDescription:
      'A cinema browser built on The Movie Database API: trending carousels, search, genre filtering and rich detail pages with ratings and posters.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'TMDB API', 'CSS'],
    github: 'https://github.com/raaj-oo7/TMDB-clone',
    demo: 'https://github.com/raaj-oo7/TMDB-clone',
    accent: '#f472b6',
    device: 'laptop',
  },
  {
    repo: 'chatbot-ui',
    title: 'Chatbot UI',
    description: 'Conversational chatbot interface with message history and a clean chat UX.',
    longDescription:
      'A chat interface exploring conversational UX: message bubbles, typing states and a responsive layout — the front-of-house for an AI assistant.',
    tags: ['AI', 'UI/UX', 'JavaScript'],
    tech: ['JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/raaj-oo7/chatbot-ui',
    demo: 'https://github.com/raaj-oo7/chatbot-ui',
    accent: '#34d399',
    device: 'mobile',
  },
  {
    repo: 'Github-user-search',
    title: 'GitHub User Search',
    description: 'Profile explorer built on the GitHub REST API with instant search and stats.',
    longDescription:
      'Search any GitHub username and get a profile card with avatar, bio, repo counts and links — a compact exercise in API integration and defensive UI states.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'GitHub API', 'CSS'],
    github: 'https://github.com/raaj-oo7/Github-user-search',
    demo: 'https://github.com/raaj-oo7/Github-user-search',
    accent: '#22d3ee',
    device: 'browser',
  },
  {
    repo: 'Workout-map',
    title: 'Workout Map',
    description: 'Geolocation workout tracker — log runs and rides directly onto an interactive map.',
    longDescription:
      'Click anywhere on the map to log a workout with distance, duration and cadence. Uses the Geolocation API, Leaflet maps and localStorage persistence, structured with OOP JavaScript.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'Leaflet', 'Geolocation API'],
    github: 'https://github.com/raaj-oo7/Workout-map',
    demo: 'https://github.com/raaj-oo7/Workout-map',
    accent: '#a855f7',
    device: 'laptop',
  },
  {
    repo: 'Bankist',
    title: 'Bankist',
    description: 'Minimalist online-banking experience — transfers, loans and session timers.',
    longDescription:
      'A fictional bank UI with login, money transfers, loan requests, sortable transaction history and an auto-logout timer — heavy on array methods and DOM architecture.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/raaj-oo7/Bankist',
    demo: 'https://github.com/raaj-oo7/Bankist',
    accent: '#818cf8',
    device: 'browser',
  },
  {
    repo: 'Music-Player',
    title: 'Music Player',
    description: 'Sleek audio player with playlist, seek control and animated album art.',
    longDescription:
      'A custom HTML5-audio music player: play/pause/skip, progress scrubbing, playlist switching and animated cover art. Deployed on GitHub Pages.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'HTML5 Audio', 'CSS'],
    github: 'https://github.com/raaj-oo7/Music-Player',
    demo: 'https://raaj-oo7.github.io/Music-Player/',
    accent: '#fbbf24',
    device: 'mobile',
  },
  {
    repo: 'Zuru_country',
    title: 'Zuru Country Explorer',
    description: 'Browse every country on Earth — flags, stats and dark mode via the REST Countries API.',
    longDescription:
      'Country encyclopedia app: search, region filtering, border-country navigation and theme switching, powered by the REST Countries API. Live on GitHub Pages.',
    tags: ['JavaScript', 'UI/UX'],
    tech: ['JavaScript', 'REST Countries API', 'CSS'],
    github: 'https://github.com/raaj-oo7/Zuru_country',
    demo: 'https://raaj-oo7.github.io/Zuru_country/',
    accent: '#34d399',
    device: 'browser',
  },
  {
    repo: 'todo-app-react',
    title: 'React Todo App',
    description: 'Task manager built with React — add, complete, filter and persist todos.',
    longDescription:
      'A clean React todo application with component state, list filtering and localStorage persistence — the classic done properly.',
    tags: ['React', 'UI/UX'],
    tech: ['React', 'JavaScript', 'CSS'],
    github: 'https://github.com/raaj-oo7/todo-app-react',
    demo: 'https://github.com/raaj-oo7/todo-app-react',
    accent: '#61dafb',
    device: 'browser',
  },
]

/** Repos never shown as project cards (experiments, config, forks). */
export const hiddenRepos = [
  'raaj-oo7',
  'test',
  'task',
  'reactnative',
  'freestuffdev',
  'pig-game',
  'guess-my-number',
]

export type Achievement = {
  title: string
  issuer: string
  year: string
  type: 'certificate' | 'award' | 'badge' | 'milestone'
  description: string
}

export const achievements: Achievement[] = [
  {
    title: 'Meta Front-End Developer Certificate',
    issuer: 'Meta / Coursera',
    year: '2023',
    type: 'certificate',
    description: 'Professional certification covering advanced React, testing and UX principles.',
  },
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    year: '2024',
    type: 'certificate',
    description: 'Foundational certification for AWS cloud architecture and services.',
  },
  {
    title: 'Best Web Experience — DevFest Gujarat',
    issuer: 'Google Developer Groups',
    year: '2024',
    type: 'award',
    description: 'Won first place for an immersive WebGL storytelling experience.',
  },
  {
    title: 'Hacktoberfest ×4 Finisher',
    issuer: 'DigitalOcean',
    year: '2022–2025',
    type: 'badge',
    description: 'Four consecutive years of accepted open-source contributions.',
  },
  {
    title: '100k+ Users Served',
    issuer: 'Production apps',
    year: '2025',
    type: 'milestone',
    description: 'Apps I built or co-built have crossed 100,000 cumulative users.',
  },
  {
    title: 'Top 5% — Frontend Mentor',
    issuer: 'frontendmentor.io',
    year: '2023',
    type: 'badge',
    description: 'Ranked in the top 5% globally for pixel-perfect challenge solutions.',
  },
]

export const services = [
  {
    title: 'React Development',
    description: 'Production-grade SPAs and platforms with React 19, clean architecture and full test coverage.',
    icon: 'atom',
  },
  {
    title: 'Creative Frontend',
    description: 'Award-level marketing sites with Three.js, GSAP scroll storytelling and WebGL shaders.',
    icon: 'sparkles',
  },
  {
    title: 'UI Engineering',
    description: 'Design systems, component libraries and pixel-perfect implementation from Figma.',
    icon: 'layers',
  },
  {
    title: 'AI Integration',
    description: 'LLM copilots, RAG chatbots, semantic search and streaming AI UX inside your product.',
    icon: 'bot',
  },
  {
    title: 'Performance Optimization',
    description: 'Core Web Vitals audits, bundle diets and rendering optimisation to hit 95+ Lighthouse.',
    icon: 'gauge',
  },
  {
    title: 'Full-Stack Delivery',
    description: 'End-to-end features with Node.js, databases, auth and CI/CD — shipped and monitored.',
    icon: 'server',
  },
] as const

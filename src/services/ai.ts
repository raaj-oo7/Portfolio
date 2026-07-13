import { about, achievements, experience, personal, projects, services, skills } from '@/data/portfolio'

/**
 * AI Portfolio Assistant engine.
 *
 * Two modes:
 *  1. If VITE_OPENAI_API_KEY is set, questions are answered by the OpenAI API
 *     grounded with a system prompt built from the portfolio data.
 *  2. Otherwise a local retrieval engine answers from the same knowledge base,
 *     so the assistant always works — even with zero configuration.
 */

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
const OPENAI_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? 'gpt-4o-mini'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const suggestedQuestions = [
  'What projects has Raj built?',
  'What are his strongest skills?',
  'Tell me about his experience',
  'How can I contact Raj?',
  'Does he work with AI?',
]

function knowledgeBase(): string {
  return [
    `Name: ${personal.name}. Roles: ${personal.roles.join(', ')}. Location: ${personal.location}.`,
    `Tagline: ${personal.tagline}`,
    `Contact: email ${personal.email}, phone ${personal.phone}, website ${personal.website}.`,
    `Bio: ${about.bio.join(' ')}`,
    `Stats: ${about.stats.map((s) => `${s.label}: ${s.value}${s.suffix}`).join(', ')}.`,
    `Skills: ${skills.map((s) => `${s.name} (${s.category}, ${s.level}/100, ${s.years}y) — ${s.description}`).join(' | ')}`,
    `Experience: ${experience.map((e) => `${e.role} at ${e.company} (${e.period}): ${e.summary} Responsibilities: ${e.responsibilities.join('; ')}`).join(' || ')}`,
    `Projects: ${projects.map((p) => `${p.title} [${p.tags.join(', ')}] — ${p.longDescription} Tech: ${p.tech.join(', ')}. GitHub: ${p.github}. Demo: ${p.demo}`).join(' || ')}`,
    `Achievements: ${achievements.map((a) => `${a.title} (${a.issuer}, ${a.year})`).join('; ')}`,
    `Services offered: ${services.map((s) => `${s.title}: ${s.description}`).join('; ')}`,
  ].join('\n')
}

/* ------------------------- Local retrieval engine ------------------------- */

type Rule = { keywords: string[]; answer: () => string }

const rules: Rule[] = [
  {
    keywords: ['project', 'built', 'build', 'portfolio', 'work', 'app'],
    answer: () =>
      `Raj has shipped **${projects.length} featured projects**. Highlights:\n\n` +
      projects
        .slice(0, 4)
        .map((p) => `- **${p.title}** — ${p.description}\n  \`${p.tech.slice(0, 4).join(' · ')}\``)
        .join('\n') +
      `\n\nScroll to the **Projects** section to explore them in 3D mockups, or ask me about any specific one.`,
  },
  {
    keywords: ['skill', 'stack', 'technolog', 'strongest', 'tech', 'know'],
    answer: () => {
      const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 6)
      return (
        `Raj's strongest technologies:\n\n` +
        top.map((s) => `- **${s.name}** — ${s.level}/100, ${s.years} years (${s.category})`).join('\n') +
        `\n\nHe's especially deep in the **React + TypeScript** ecosystem and has been shipping **AI-powered features** for the last two years. Check out the Skills Galaxy 🪐 for the full map.`
      )
    },
  },
  {
    keywords: ['experience', 'career', 'job', 'company', 'worked', 'history'],
    answer: () =>
      `Raj's professional journey:\n\n` +
      experience
        .map((e) => `- **${e.role}** @ ${e.company} *(${e.period})*\n  ${e.summary}`)
        .join('\n') +
      `\n\nThat's **4+ years** of production experience overall.`,
  },
  {
    keywords: ['contact', 'hire', 'reach', 'email', 'phone', 'available', 'freelance'],
    answer: () =>
      `You can reach Raj here:\n\n- 📧 **Email**: ${personal.email}\n- 📞 **Phone**: ${personal.phone}\n- 📍 **Location**: ${personal.location}\n\nOr just use the **contact form** at the bottom of this page — it lands straight in his inbox. He's open to freelance projects and full-time opportunities.`,
  },
  {
    keywords: ['ai', 'llm', 'openai', 'machine learning', 'chatbot', 'gpt', 'claude'],
    answer: () =>
      `Yes — AI integration is one of Raj's specialities. He has built:\n\n- **Neural Notes AI** — chat-with-your-notes with RAG + citations\n- **DevFlow AI** — LLM code review bot for GitHub PRs\n- A production **AI copilot** at Fuselio with streaming responses\n\nHe works with the OpenAI & Claude APIs, embeddings, and prompt engineering. *(Fun fact: I'm one of his AI features too.)*`,
  },
  {
    keywords: ['resume', 'cv', 'download'],
    answer: () =>
      `You can grab Raj's resume right from the hero section — hit the **Download Resume** button, or [download it here](${personal.resumeUrl}).`,
  },
  {
    keywords: ['achievement', 'award', 'certificate', 'certification'],
    answer: () =>
      `Raj's notable achievements:\n\n` +
      achievements.map((a) => `- **${a.title}** — ${a.issuer} (${a.year})`).join('\n'),
  },
  {
    keywords: ['service', 'offer', 'do for', 'help me'],
    answer: () =>
      `Raj offers these services:\n\n` +
      services.map((s) => `- **${s.title}** — ${s.description}`).join('\n') +
      `\n\nInterested? The contact form is the fastest way to start a conversation.`,
  },
  {
    keywords: ['who', 'about', 'raj', 'yourself', 'introduce'],
    answer: () =>
      `**${personal.name}** is a ${personal.roles.slice(0, 2).join(' & ')} based in ${personal.location}.\n\n${about.bio[0]}\n\nAsk me about his **projects**, **skills**, **experience**, or how to **get in touch**!`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'yo', 'sup'],
    answer: () =>
      `Hey there! 👋 I'm Raj's portfolio assistant. I can tell you about his **projects**, **skills**, **experience**, **achievements**, or how to **contact** him. What would you like to know?`,
  },
]

function localAnswer(question: string): string {
  const q = question.toLowerCase()
  let best: { rule: Rule; score: number } | null = null
  for (const rule of rules) {
    const score = rule.keywords.reduce((acc, k) => (q.includes(k) ? acc + 1 : acc), 0)
    if (score > 0 && (!best || score > best.score)) best = { rule, score }
  }
  if (best) return best.rule.answer()
  return `I'm best at answering questions about **Raj's work**. Try one of these:\n\n- "What projects has Raj built?"\n- "What are his strongest skills?"\n- "How can I contact him?"`
}

/* ------------------------------ OpenAI mode ------------------------------- */

async function openaiAnswer(history: ChatMessage[], question: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            `You are the friendly AI assistant embedded in Raj Makadia's portfolio website. ` +
            `Answer questions about Raj concisely using Markdown. Only use the facts below; ` +
            `if asked something unrelated, politely steer back to Raj's work.\n\n${knowledgeBase()}`,
        },
        ...history.slice(-6),
        { role: 'user', content: question },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data = (await res.json()) as { choices: { message: { content: string } }[] }
  return data.choices[0]?.message?.content ?? localAnswer(question)
}

/** Ask the assistant a question. Falls back to the local engine on any failure. */
export async function askAssistant(history: ChatMessage[], question: string): Promise<string> {
  if (OPENAI_KEY) {
    try {
      return await openaiAnswer(history, question)
    } catch {
      /* fall through to local */
    }
  }
  // Small delay so the typing indicator feels natural
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 500))
  return localAnswer(question)
}

import { Fragment, type ReactNode } from 'react'

/**
 * Tiny dependency-free Markdown renderer covering what the assistant emits:
 * bold, italics, inline code, links, bullet lists and fenced code blocks
 * with basic keyword highlighting.
 */

const KEYWORDS = /\b(const|let|var|function|return|import|export|from|await|async|if|else|new|class|type|interface)\b/g

function highlight(code: string): ReactNode {
  const parts = code.split(KEYWORDS)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-accent-cyan">{part}</span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // tokenize: **bold**, *italic*, `code`, [label](url)
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return tokens.map((tok, i) => {
    const key = `${keyPrefix}-${i}`
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={key} className="font-semibold text-(--fg)">{tok.slice(2, -2)}</strong>
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code key={key} className="rounded bg-primary-500/15 px-1.5 py-0.5 font-mono text-[11px] text-primary-300">
          {tok.slice(1, -1)}
        </code>
      )
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer noopener" className="text-accent-cyan underline underline-offset-2">
          {link[1]}
        </a>
      )
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      return <em key={key}>{tok.slice(1, -1)}</em>
    }
    return <Fragment key={key}>{tok}</Fragment>
  })
}

export function Markdown({ content }: { content: string }) {
  // split fenced code blocks first
  const segments = content.split(/```(\w*)\n?([\s\S]*?)```/g)
  const out: ReactNode[] = []

  for (let i = 0; i < segments.length; i += 3) {
    const textPart = segments[i]
    if (textPart) {
      const lines = textPart.split('\n')
      let list: string[] = []
      const flushList = (key: string) => {
        if (!list.length) return
        out.push(
          <ul key={key} className="my-1.5 space-y-1 pl-1">
            {list.map((item, li) => (
              <li key={li} className="flex gap-2">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary-400" aria-hidden />
                <span>{renderInline(item, `${key}-${li}`)}</span>
              </li>
            ))}
          </ul>,
        )
        list = []
      }
      lines.forEach((line, li) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          list.push(trimmed.slice(2))
        } else {
          flushList(`ul-${i}-${li}`)
          if (trimmed) out.push(<p key={`p-${i}-${li}`} className="my-1">{renderInline(trimmed, `p-${i}-${li}`)}</p>)
        }
      })
      flushList(`ul-${i}-end`)
    }
    const code = segments[i + 2]
    if (code !== undefined) {
      out.push(
        <pre key={`code-${i}`} className="my-2 overflow-x-auto rounded-xl border border-(--line) bg-night-950/80 p-3 font-mono text-[11px] leading-relaxed text-white/85">
          <code>{highlight(code)}</code>
        </pre>,
      )
    }
  }

  return <div className="text-[13px] leading-relaxed">{out}</div>
}

import { Fragment, type ReactNode } from 'react'

/**
 * Dependency-free Markdown renderer for blog articles.
 * Supports: ## / ### headings, paragraphs, **bold**, *italic*, `inline code`,
 * [links](url), - bullet lists, 1. numbered lists, > blockquotes, ---,
 * and ```lang fenced code blocks with light keyword highlighting.
 */

const KEYWORDS =
  /\b(const|let|var|function|return|import|export|from|await|async|if|else|for|of|in|new|class|extends|type|interface|try|catch|finally|throw|using|yield|switch|case|default|break|continue|typeof|instanceof|null|undefined|true|false)\b/g

function highlight(code: string): ReactNode {
  const lines = code.split('\n')
  return lines.map((line, li) => {
    // keep comments un-highlighted
    if (/^\s*(\/\/|#|\/\*|\*)/.test(line)) {
      return (
        <Fragment key={li}>
          <span className="text-white/40">{line}</span>
          {li < lines.length - 1 ? '\n' : ''}
        </Fragment>
      )
    }
    const parts = line.split(KEYWORDS)
    return (
      <Fragment key={li}>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="text-accent-cyan">
              {part}
            </span>
          ) : (
            <StringAware key={i} text={part} />
          ),
        )}
        {li < lines.length - 1 ? '\n' : ''}
      </Fragment>
    )
  })
}

/** Tint string literals inside a code line. */
function StringAware({ text }: { text: string }) {
  const tokens = text.split(/('[^']*'|"[^"]*"|`[^`]*`)/g)
  return (
    <>
      {tokens.map((tok, i) =>
        /^['"`]/.test(tok) ? (
          <span key={i} className="text-accent-emerald">
            {tok}
          </span>
        ) : (
          <Fragment key={i}>{tok}</Fragment>
        ),
      )}
    </>
  )
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return tokens.map((tok, i) => {
    const key = `${keyPrefix}-${i}`
    if (tok.startsWith('**') && tok.endsWith('**'))
      return (
        <strong key={key} className="font-semibold text-(--fg)">
          {tok.slice(2, -2)}
        </strong>
      )
    if (tok.startsWith('`') && tok.endsWith('`'))
      return (
        <code key={key} className="rounded bg-primary-500/12 px-1.5 py-0.5 font-mono text-[0.85em] text-primary-300">
          {tok.slice(1, -1)}
        </code>
      )
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
    if (link)
      return (
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4 hover:decoration-accent-cyan"
        >
          {link[1]}
        </a>
      )
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) return <em key={key}>{tok.slice(1, -1)}</em>
    return <Fragment key={key}>{tok}</Fragment>
  })
}

type Block =
  | { kind: 'h2' | 'h3' | 'p' | 'quote'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'code'; lang: string; code: string }
  | { kind: 'hr' }

function parse(md: string): Block[] {
  const blocks: Block[] = []
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push({ kind: 'code', lang, code: buf.join('\n') })
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: line.slice(4) })
      i++
      continue
    }
    if (line.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: line.slice(3) })
      i++
      continue
    }
    if (/^---+\s*$/.test(line)) {
      blocks.push({ kind: 'hr' })
      i++
      continue
    }
    if (line.startsWith('> ')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        buf.push(lines[i].slice(2))
        i++
      }
      blocks.push({ kind: 'quote', text: buf.join(' ') })
      continue
    }
    if (/^- /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2))
        i++
      }
      blocks.push({ kind: 'ul', items })
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      blocks.push({ kind: 'ol', items })
      continue
    }
    if (line.trim() === '') {
      i++
      continue
    }
    // paragraph: collect consecutive non-empty plain lines
    const buf: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{2,3} |- |\d+\. |> |```|---)/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    blocks.push({ kind: 'p', text: buf.join(' ') })
  }
  return blocks
}

export function BlogMarkdown({ content }: { content: string }) {
  const blocks = parse(content)
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <h2
                key={i}
                id={b.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                className="font-display scroll-mt-24 pt-6 text-2xl font-bold tracking-tight md:text-3xl"
              >
                {inline(b.text, `h2-${i}`)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="font-display scroll-mt-24 pt-2 text-lg font-bold md:text-xl">
                {inline(b.text, `h3-${i}`)}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="leading-relaxed text-(--fg-muted)">
                {inline(b.text, `p-${i}`)}
              </p>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                className="glass rounded-r-2xl border-l-2 border-primary-500 py-3 pr-5 pl-5 text-(--fg) italic"
              >
                {inline(b.text, `q-${i}`)}
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i} className="space-y-2 pl-1">
                {b.items.map((item, li) => (
                  <li key={li} className="flex gap-3 leading-relaxed text-(--fg-muted)">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                    <span>{inline(item, `ul-${i}-${li}`)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="space-y-2 pl-1">
                {b.items.map((item, li) => (
                  <li key={li} className="flex gap-3 leading-relaxed text-(--fg-muted)">
                    <span className="glass mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] text-primary-300">
                      {li + 1}
                    </span>
                    <span>{inline(item, `ol-${i}-${li}`)}</span>
                  </li>
                ))}
              </ol>
            )
          case 'code':
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-(--line)">
                <div className="flex items-center justify-between border-b border-(--line) bg-night-900/80 px-4 py-2">
                  <span className="font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
                    {b.lang || 'code'}
                  </span>
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-red-400/60" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                    <span className="h-2 w-2 rounded-full bg-green-400/60" />
                  </span>
                </div>
                <pre className="overflow-x-auto bg-night-950/90 p-4 font-mono text-[13px] leading-relaxed whitespace-pre text-white/90">
                  <code>{highlight(b.code)}</code>
                </pre>
              </div>
            )
          case 'hr':
            return <hr key={i} className="border-(--line)" />
        }
      })}
    </div>
  )
}

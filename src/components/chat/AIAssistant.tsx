import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { askAssistant, suggestedQuestions, type ChatMessage } from '@/services/ai'
import { useAppStore } from '@/store/useAppStore'
import { Markdown } from './Markdown'
import { cn } from '@/utils'

interface UiMessage extends ChatMessage {
  id: number
  /** message still being "typed out" */
  streaming?: boolean
}

const WELCOME =
  "Hey! 👋 I'm **Raj's AI assistant** — trained on his projects, skills and experience. Ask me anything, or pick a question below."

let nextId = 1
const welcomeMessage = (): UiMessage => ({ id: 0, role: 'assistant', content: WELCOME })

/** Floating AI portfolio assistant with typing animation and markdown answers. */
export function AIAssistant() {
  const { chatOpen, setChatOpen } = useAppStore()
  const [messages, setMessages] = useState<UiMessage[]>([welcomeMessage()])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Finalizes the currently streaming answer (if any). Kept in a ref so a new
  // question can complete the previous stream instead of freezing it mid-word.
  const finishStream = useRef<(() => void) | null>(null)
  const stickToBottom = useRef(true)

  useEffect(() => () => finishStream.current?.(), [])

  // focus the composer whenever the panel opens
  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 350)
  }, [chatOpen])

  // Track whether the user has scrolled away from the bottom; only then do we
  // stop auto-following new content.
  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const scrollToBottom = (force = false) => {
    const el = scrollRef.current
    if (!el) return
    if (force || stickToBottom.current) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /** Reveal an answer progressively for the typing effect. */
  const streamIn = (full: string) => {
    finishStream.current?.() // complete any previous stream first
    const id = nextId++
    setMessages((m) => [...m, { id, role: 'assistant', content: '', streaming: true }])

    let i = 0
    const timer = setInterval(() => {
      i = Math.min(full.length, i + 3 + Math.floor(Math.random() * 4))
      const done = i >= full.length
      setMessages((m) =>
        m.map((msg) => (msg.id === id ? { ...msg, content: full.slice(0, i), streaming: !done } : msg)),
      )
      if (done) {
        clearInterval(timer)
        finishStream.current = null
      }
    }, 16)

    finishStream.current = () => {
      clearInterval(timer)
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, content: full, streaming: false } : msg)))
      finishStream.current = null
    }
  }

  const send = async (text?: string) => {
    const question = (text ?? input).trim()
    if (!question || thinking) return
    setInput('')
    finishStream.current?.() // a new question completes the previous answer instantly
    const history: ChatMessage[] = messages.map(({ role, content }) => ({ role, content }))
    setMessages((m) => [...m, { id: nextId++, role: 'user', content: question }])
    stickToBottom.current = true
    requestAnimationFrame(() => scrollToBottom(true))
    setThinking(true)
    try {
      const answer = await askAssistant(history, question)
      streamIn(answer)
    } finally {
      setThinking(false)
    }
  }

  const resetChat = () => {
    finishStream.current?.()
    setMessages([welcomeMessage()])
    setInput('')
    stickToBottom.current = true
    inputRef.current?.focus()
  }

  const streaming = messages.some((m) => m.streaming)
  const lastIsAssistant = messages[messages.length - 1]?.role === 'assistant'
  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.content))
  const suggestions = suggestedQuestions.filter((q) => !asked.has(q))
  const showSuggestions = lastIsAssistant && !streaming && !thinking && suggestions.length > 0

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            onClick={() => setChatOpen(true)}
            className="glow-primary fixed right-6 bottom-24 z-[96] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 via-accent-violet to-accent-purple text-white shadow-2xl md:bottom-6"
            aria-label="Open AI assistant"
          >
            <Bot size={24} />
            <motion.span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-cyan"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={9} className="text-night-950" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="glass-strong noise fixed right-4 bottom-4 z-[300] flex h-[min(38rem,calc(100dvh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/40 md:right-6 md:bottom-6"
            role="dialog"
            aria-label="AI portfolio assistant"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-(--line) bg-gradient-to-r from-primary-600/25 to-accent-purple/20 px-5 py-4">
              <span className="glow-primary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-purple text-white">
                <Bot size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold">Portfolio Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-(--fg-muted)">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" aria-hidden /> online · knows everything about Raj
                </p>
              </div>
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={resetChat}
                  className="glass flex h-8 w-8 items-center justify-center rounded-full hover:border-accent-cyan/50"
                  aria-label="Start a new chat"
                  title="New chat"
                >
                  <RotateCcw size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="glass flex h-8 w-8 items-center justify-center rounded-full hover:border-primary-500/50"
                aria-label="Close assistant"
              >
                <X size={14} />
              </button>
            </div>

            {/* messages — data-lenis-prevent stops the page's smooth-scroll
                from hijacking wheel/touch events inside this container */}
            <div
              ref={scrollRef}
              onScroll={onScroll}
              data-lenis-prevent
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5',
                      msg.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-r from-primary-600 to-accent-violet text-sm text-white'
                        : 'glass rounded-bl-md',
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <>
                        <Markdown content={msg.content} />
                        {msg.streaming && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-accent-cyan align-middle" aria-hidden />}
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="glass flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3" aria-label="Assistant is typing">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary-400"
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* follow-up suggestions (already-asked ones drop out) */}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="glass rounded-full px-3.5 py-1.5 text-left text-xs text-(--fg-muted) transition-colors hover:border-accent-cyan/50 hover:text-(--fg)"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void send()
              }}
              className="flex items-center gap-2 border-t border-(--line) p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, experience…"
                aria-label="Message the assistant"
                className="glass min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-(--fg-muted)/60 focus:border-primary-500/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="glow-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-purple text-white transition-transform hover:scale-105 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

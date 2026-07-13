import { lazy, Suspense, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { slideInLeft, slideInRight, viewportOnce } from '@/animations/variants'
import { personal } from '@/data/portfolio'
import { ContactError, sendContactEmail } from '@/services/email'
import { cn } from '@/utils'

const Turnstile = lazy(() =>
  import('@marsidev/react-turnstile').then((m) => ({ default: m.Turnstile })),
)

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
const WHATSAPP_URL = `https://wa.me/${personal.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Raj! Found you through your portfolio.')}`

/* ------------------------------- validation ------------------------------ */

// NOTE: the honeypot is intentionally NOT in this schema — if a browser
// autofills the hidden field, schema validation would fail silently and the
// button would appear dead. It's read via a ref and judged server-side.
const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell me your name').max(100),
  email: z.string().trim().email('That email doesn’t look right').max(200),
  subject: z.string().trim().min(3, 'A short subject helps me triage').max(200),
  message: z.string().trim().min(20, 'Please write at least 20 characters').max(5000),
})

type ContactFields = z.infer<typeof ContactSchema>

/* --------------------------------- data ---------------------------------- */

const contactInfo = [
  { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
  { icon: Phone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone.replace(/\s/g, '')}` },
  { icon: FaWhatsapp, label: 'WhatsApp', value: 'Quick chat', href: WHATSAPP_URL },
  { icon: FaGithub, label: 'GitHub', value: `github.com/${personal.githubUsername}`, href: `https://github.com/${personal.githubUsername}` },
  { icon: FaLinkedinIn, label: 'LinkedIn', value: 'in/raj-makadia-458b1a276', href: 'https://www.linkedin.com/in/raj-makadia-458b1a276/' },
  { icon: MapPin, label: 'Location', value: personal.location, href: undefined },
]

const quickLinks = [
  { icon: Mail, label: 'Email', href: `mailto:${personal.email}` },
  { icon: FaWhatsapp, label: 'WhatsApp', href: WHATSAPP_URL },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://www.linkedin.com/in/raj-makadia-458b1a276/' },
]

const inputCls = (error?: string) =>
  cn(
    'glass w-full rounded-xl bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--fg-muted)/60',
    'focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20',
    error && 'border-red-400/60',
  )

/* -------------------------------- section -------------------------------- */

/** Production contact form: RHF + Zod, Turnstile, honeypot, dual-email API. */
export function Contact() {
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const honeypotRef = useRef<HTMLInputElement>(null)
  // duplicate-submission guard: hash of last payload + cooldown timestamp
  const lastSubmit = useRef<{ hash: string; at: number }>({ hash: '', at: 0 })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({ resolver: zodResolver(ContactSchema), mode: 'onTouched' })

  const onSubmit = async (fields: ContactFields) => {
    const hash = JSON.stringify([fields.email, fields.subject, fields.message])
    const now = Date.now()
    // Stable toast id: repeated clicks UPDATE one toast instead of stacking
    if (hash === lastSubmit.current.hash && now - lastSubmit.current.at < 5 * 60_000) {
      toast('This message was already sent — I’ll reply soon!', { icon: '✋', id: 'contact-status' })
      return
    }
    if (now - lastSubmit.current.at < 20_000) {
      toast('Please wait a moment before sending another message.', { icon: '⏳', id: 'contact-status' })
      return
    }

    try {
      await sendContactEmail({ ...fields, turnstileToken, company: honeypotRef.current?.value ?? '' })
      lastSubmit.current = { hash, at: now }
      setSuccess(true)
      reset()
      toast.success("Thank you! Your message has been sent successfully. I'll get back to you within 24 hours.", {
        duration: 6000,
        id: 'contact-status',
      })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      const msg =
        err instanceof ContactError
          ? err.message
          : 'Something went wrong — please try again or email me directly.'
      toast.error(msg, { duration: 6000, id: 'contact-status' })
    }
  }

  return (
    <section id="contact" className="section-pad relative mx-auto max-w-6xl" aria-label="Contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something great"
        subtitle="Got a project, an opportunity or just want to talk shop? My inbox is open."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* info cards */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={slideInLeft}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contactInfo.map((c) => {
              const inner = (
                <GlassCard key={c.label} className="flex items-center gap-4 p-4" spotlight={false}>
                  <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-accent-cyan">
                    <c.icon size={17} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">{c.label}</p>
                    <p className="truncate text-sm font-medium">{c.value}</p>
                  </div>
                </GlassCard>
              )
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  className="block transition-transform hover:-translate-y-0.5"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              )
            })}
          </div>
        </motion.div>

        {/* form */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={slideInRight}>
          <GlassCard className="relative p-7 md:p-9" spotlight={false}>
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-strong absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl px-8 text-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                  >
                    <CheckCircle2 size={56} className="text-accent-emerald" />
                  </motion.span>
                  <p className="font-display text-xl font-bold">Message sent!</p>
                  <p className="text-sm text-(--fg-muted)">
                    Thank you! Your message has been sent successfully. I'll get back to you within 24 hours —
                    a confirmation email is on its way to you.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
              {/* honeypot — visually hidden, bots fill it, server rejects it.
                  Unregistered on purpose: autofill must never block real users. */}
              <input
                ref={honeypotRef}
                type="text"
                name="contact_preference"
                tabIndex={-1}
                autoComplete="new-password"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="mb-1.5 block text-xs font-semibold tracking-wide text-(--fg-muted) uppercase">
                    Full Name
                  </label>
                  <input id="ct-name" type="text" autoComplete="name" placeholder="Ada Lovelace" className={inputCls(errors.name?.message)} aria-invalid={!!errors.name} {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="ct-email" className="mb-1.5 block text-xs font-semibold tracking-wide text-(--fg-muted) uppercase">
                    Email Address
                  </label>
                  <input id="ct-email" type="email" autoComplete="email" placeholder="you@company.com" className={inputCls(errors.email?.message)} aria-invalid={!!errors.email} {...register('email')} />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="ct-subject" className="mb-1.5 block text-xs font-semibold tracking-wide text-(--fg-muted) uppercase">
                  Subject
                </label>
                <input id="ct-subject" type="text" placeholder="Let's work together on…" className={inputCls(errors.subject?.message)} aria-invalid={!!errors.subject} {...register('subject')} />
                {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
              </div>
              <div>
                <label htmlFor="ct-message" className="mb-1.5 block text-xs font-semibold tracking-wide text-(--fg-muted) uppercase">
                  Message
                </label>
                <textarea id="ct-message" rows={5} placeholder="Tell me about your project, timeline and goals… (min. 20 characters)" className={cn(inputCls(errors.message?.message), 'resize-none')} aria-invalid={!!errors.message} {...register('message')} />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
              </div>

              {/* Cloudflare Turnstile (renders only when a site key is configured) */}
              {TURNSTILE_SITE_KEY && (
                <Suspense fallback={null}>
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(undefined)}
                    options={{ theme: 'dark', size: 'flexible' }}
                  />
                </Suspense>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="glow-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 via-accent-violet to-accent-purple px-8 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>

            {/* quick links */}
            <div className="mt-7 border-t border-(--line) pt-5">
              <p className="mb-3 text-center font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
                Prefer another channel?
              </p>
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {quickLinks.map((q) => (
                  <li key={q.label}>
                    <a
                      href={q.href}
                      target={q.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer noopener"
                      className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-(--fg-muted) transition-all hover:-translate-y-0.5 hover:border-accent-cyan/50 hover:text-(--fg)"
                    >
                      <q.icon size={13} aria-hidden /> {q.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

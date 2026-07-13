import emailjs from '@emailjs/browser'

/**
 * Contact delivery with a graceful fallback chain:
 *  1. POST /api/contact — Vercel serverless function (Resend: admin email +
 *     auto-reply, Turnstile, rate limiting). The production path.
 *  2. EmailJS — client-side fallback when the API isn't deployed (e.g. static
 *     hosting) but EmailJS keys are configured.
 *  3. Simulated send — local dev with nothing configured, so the UX is testable.
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  turnstileToken?: string
  /** honeypot — forwarded so the server can reject bots */
  company?: string
}

export class ContactError extends Error {}

const emailJsConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

async function sendViaApi(payload: ContactPayload): Promise<'sent' | 'unavailable'> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    // API not deployed (static host) or not configured → try the next transport
    if (res.status === 404 || res.status === 503) return 'unavailable'
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null
      throw new ContactError(body?.error ?? `Request failed (${res.status})`)
    }
    return 'sent'
  } catch (err) {
    if (err instanceof ContactError) throw err
    if ((err as Error).name === 'AbortError') throw new ContactError('The request timed out — please try again.')
    return 'unavailable' // network-level failure reaching our own API → fall back
  } finally {
    clearTimeout(timeout)
  }
}

async function sendViaEmailJs(payload: ContactPayload): Promise<void> {
  await emailjs.send(
    SERVICE_ID!,
    TEMPLATE_ID!,
    {
      from_name: payload.name,
      reply_to: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
    { publicKey: PUBLIC_KEY! },
  )
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const apiResult = await sendViaApi(payload)
  if (apiResult === 'sent') return

  if (emailJsConfigured) {
    try {
      await sendViaEmailJs(payload)
      return
    } catch {
      throw new ContactError('Could not send your message — please email me directly.')
    }
  }

  if (import.meta.env.DEV) {
    // nothing configured locally — simulate success so the flow is testable
    await new Promise((r) => setTimeout(r, 1200))
    console.info('[contact] no transport configured — simulated send', payload)
    return
  }

  throw new ContactError('The contact service is unavailable — please email me directly.')
}

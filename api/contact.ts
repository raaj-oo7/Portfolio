/**
 * POST /api/contact — production contact pipeline.
 *
 * Runs as a Vercel Edge Function in production and is mounted into the Vite
 * dev server by the `contactApiDev` plugin (vite.config.ts), so the SAME
 * code handles submissions locally and in production.
 *
 * Flow: validate → honeypot → rate limit → Turnstile verify → sanitize →
 *       email admin (Resend) → auto-reply visitor (Resend).
 *
 * Env vars (Vercel dashboard in production, .env.local in dev):
 *   RESEND_API_KEY                     — https://resend.com → API Keys
 *   CONTACT_TO_EMAIL   (or MY_EMAIL)   — your inbox
 *   CONTACT_FROM_EMAIL (or FROM_EMAIL) — verified sender
 *   TURNSTILE_SECRET_KEY               — optional, enables Turnstile checks
 */

import { z } from 'zod'
import { resendConfig, sendEmail } from './_lib/resend'
import { adminEmailHtml, replyEmailHtml } from './_lib/templates'

export const config = { runtime: 'edge' }

/* ----------------------------- validation ------------------------------ */

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(200),
  subject: z.string().trim().min(3, 'Subject is required').max(200),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(5000),
  turnstileToken: z.string().optional(),
  /** honeypot — humans never fill this */
  company: z.string().optional(),
})

/* ----------------------------- rate limiting --------------------------- */
// In-memory, per warm instance. Fine for a portfolio; swap for Upstash/KV
// if you ever need cross-instance guarantees.
const hits = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) return true
  recent.push(now)
  hits.set(ip, recent)
  return false
}

/* ------------------------------ turnstile ------------------------------ */

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Turnstile not configured — skip
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

/* ------------------------------- handler -------------------------------- */

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' })

  const { apiKey, to, from } = resendConfig()
  if (!apiKey || !to || !from) {
    return json(503, { error: 'Contact service is not configured' })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return json(400, { error: 'Invalid request body' })
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return json(400, { error: parsed.error.issues[0]?.message ?? 'Invalid input' })
  }
  const data = parsed.data

  // Honeypot filled → pretend success so bots learn nothing
  if (data.company) return json(200, { ok: true })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return json(429, { error: 'Too many messages — please try again later.' })
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return json(403, { error: 'Spam check failed — please retry.' })
  }

  const meta = {
    when: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    ua: request.headers.get('user-agent') ?? 'unknown',
    ip,
  }

  try {
    // 1) notify admin (Reply-To = visitor)
    await sendEmail({
      from,
      to: [to],
      reply_to: data.email,
      subject: `🚀 New Portfolio Inquiry - ${data.name}`,
      html: adminEmailHtml(data, meta),
    })
    // 2) auto-reply to the visitor (best effort — don't fail the request)
    try {
      await sendEmail({
        from,
        to: [data.email],
        subject: 'Thank you for contacting Raj Makadia 👋',
        html: replyEmailHtml(data),
      })
    } catch (e) {
      console.error('[contact] auto-reply failed', e)
    }
    return json(200, { ok: true })
  } catch (e) {
    console.error('[contact] send failed', e)
    return json(502, { error: 'Email service failed — please try again or email me directly.' })
  }
}

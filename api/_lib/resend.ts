/**
 * Thin Resend client — direct REST calls, no SDK dependency, runs on
 * both Node and Edge runtimes.
 */

export interface EmailPayload {
  from: string
  to: string[]
  subject: string
  html: string
  reply_to?: string
}

export function resendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    // CONTACT_* preferred; MY_EMAIL / FROM_EMAIL accepted as aliases
    to: process.env.CONTACT_TO_EMAIL ?? process.env.MY_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL ?? process.env.FROM_EMAIL,
  }
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { apiKey } = resendConfig()
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend ${res.status}: ${text}`)
  }
}

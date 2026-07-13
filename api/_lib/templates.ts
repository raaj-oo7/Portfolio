/**
 * Branded HTML email templates for the contact pipeline.
 * All user-supplied strings MUST pass through escapeHtml before insertion.
 */

export interface Inquiry {
  name: string
  email: string
  subject: string
  message: string
}

export interface InquiryMeta {
  when: string
  ua: string
  ip: string
}

const BRAND = {
  name: 'Raj Makadia',
  role: 'React Developer · Frontend Engineer · AI Enthusiast',
  portfolio: 'https://rajmakadia.dev',
  github: 'https://github.com/raaj-oo7',
  linkedin: 'https://www.linkedin.com/in/raj-makadia-458b1a276/',
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function shell(inner: string): string {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#060714;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060714;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <!-- gradient header -->
        <tr><td style="background:linear-gradient(120deg,#6366f1,#a855f7 55%,#22d3ee);border-radius:20px 20px 0 0;padding:28px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="width:44px;">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(10,11,30,.85);color:#fff;font-weight:700;font-size:16px;text-align:center;line-height:44px;">RM</div>
            </td>
            <td style="padding-left:14px;color:#ffffff;">
              <div style="font-size:17px;font-weight:700;">${BRAND.name}</div>
              <div style="font-size:12px;opacity:.9;">${BRAND.role}</div>
            </td>
          </tr></table>
        </td></tr>
        <!-- glass card body -->
        <tr><td style="background:#10122b;border:1px solid rgba(255,255,255,.08);border-top:none;border-radius:0 0 20px 20px;padding:32px;color:#e5e7f5;">
          ${inner}
          <!-- footer -->
          <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#9aa0c3;">
            <a href="${BRAND.portfolio}" style="color:#818cf8;text-decoration:none;margin-right:14px;">Portfolio</a>
            <a href="${BRAND.github}" style="color:#818cf8;text-decoration:none;margin-right:14px;">GitHub</a>
            <a href="${BRAND.linkedin}" style="color:#818cf8;text-decoration:none;">LinkedIn</a>
            <div style="margin-top:10px;">© ${new Date().getFullYear()} ${BRAND.name} — sent from the portfolio contact form</div>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function adminEmailHtml(d: Inquiry, meta: InquiryMeta): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:10px 14px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9aa0c3;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 14px;font-size:14px;color:#e5e7f5;">${value}</td>
    </tr>`
  return shell(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#fff;">🚀 New portfolio inquiry</h1>
    <p style="margin:0 0 22px;font-size:13px;color:#9aa0c3;">Someone reached out through the contact form.</p>
    <table role="presentation" width="100%" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;border-collapse:separate;">
      ${row('Name', escapeHtml(d.name))}
      ${row('Email', `<a href="mailto:${escapeHtml(d.email)}" style="color:#22d3ee;text-decoration:none;">${escapeHtml(d.email)}</a>`)}
      ${row('Subject', escapeHtml(d.subject))}
      ${row('Received', escapeHtml(meta.when))}
      ${row('Browser', escapeHtml(meta.ua))}
      ${row('IP', escapeHtml(meta.ip))}
    </table>
    <div style="margin-top:18px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.25);border-radius:14px;padding:18px;">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#818cf8;margin-bottom:8px;">Message</div>
      <div style="font-size:14px;line-height:1.7;color:#e5e7f5;white-space:pre-wrap;">${escapeHtml(d.message)}</div>
    </div>
    <p style="margin:22px 0 0;font-size:13px;color:#9aa0c3;">Hit reply — the Reply-To header points at the visitor.</p>
  `)
}

export function replyEmailHtml(d: Inquiry): string {
  return shell(`
    <h1 style="margin:0 0 14px;font-size:20px;color:#fff;">Thanks for reaching out, ${escapeHtml(d.name)} 👋</h1>
    <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#c7cbe6;">
      Thank you for contacting me through my portfolio — your message has been <strong style="color:#34d399;">successfully received</strong>.
    </p>
    <p style="margin:0 0 22px;font-size:14px;line-height:1.7;color:#c7cbe6;">
      I'll carefully review your inquiry and reply <strong style="color:#fff;">within 24 hours</strong>.
    </p>
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px;">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#818cf8;margin-bottom:6px;">Your message</div>
      <div style="font-size:13px;color:#9aa0c3;margin-bottom:8px;">Subject: <span style="color:#e5e7f5;">${escapeHtml(d.subject)}</span></div>
      <div style="font-size:14px;line-height:1.7;color:#e5e7f5;white-space:pre-wrap;">${escapeHtml(d.message)}</div>
    </div>
    <p style="margin:22px 0 8px;font-size:14px;color:#c7cbe6;">Meanwhile, feel free to explore my work:</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:8px;"><a href="${BRAND.portfolio}" style="display:inline-block;background:linear-gradient(90deg,#6366f1,#a855f7);color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:10px 18px;border-radius:999px;">Portfolio</a></td>
      <td style="padding-right:8px;"><a href="${BRAND.github}" style="display:inline-block;border:1px solid rgba(255,255,255,.2);color:#e5e7f5;font-size:13px;font-weight:600;text-decoration:none;padding:10px 18px;border-radius:999px;">GitHub</a></td>
      <td><a href="${BRAND.linkedin}" style="display:inline-block;border:1px solid rgba(255,255,255,.2);color:#e5e7f5;font-size:13px;font-weight:600;text-decoration:none;padding:10px 18px;border-radius:999px;">LinkedIn</a></td>
    </tr></table>
    <p style="margin:26px 0 0;font-size:14px;color:#c7cbe6;">Regards,<br/>
      <strong style="color:#fff;">${BRAND.name}</strong><br/>
      <span style="font-size:12px;color:#9aa0c3;">${BRAND.role}</span>
    </p>
  `)
}

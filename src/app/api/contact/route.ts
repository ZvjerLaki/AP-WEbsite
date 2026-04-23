import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ success: false, error: 'Email service not configured.' }, { status: 503 });
  }

  const to = process.env.RESEND_TO_EMAIL;
  if (!to) {
    return NextResponse.json({ success: false, error: 'Recipient not configured.' }, { status: 503 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { firstName = '', lastName = '', email = '', company = '', interest = '', message = '' } = body;

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Authority Partners <onboarding@resend.dev>',
    to: [to],
    replyTo: email,
    subject: `New contact from ${[firstName, lastName].filter(Boolean).join(' ') || email}`,
    html: buildEmail({ firstName, lastName, email, company, interest, message }),
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

function buildEmail(f: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}): string {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a">${value.replace(/\n/g, '<br>')}</td></tr>` : '';

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
  <div style="background:#185FA5;padding:24px 32px">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:bold">New Contact Form Submission</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px">via authoritypartners.com</p>
  </div>
  <div style="padding:28px 32px">
    <table style="border-collapse:collapse;width:100%">
      ${row('Name', [f.firstName, f.lastName].filter(Boolean).join(' '))}
      ${row('Email', `<a href="mailto:${f.email}" style="color:#185FA5">${f.email}</a>`)}
      ${row('Company', f.company)}
      ${row('Interested in', f.interest)}
      ${row('Message', f.message)}
    </table>
  </div>
  <div style="padding:16px 32px;background:#f7f7f5;border-top:1px solid #e0e0e0">
    <p style="margin:0;font-size:11px;color:#aaa">Sent from the Authority Partners website contact form.</p>
  </div>
</div>`;
}

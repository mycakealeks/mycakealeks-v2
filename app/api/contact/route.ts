import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@mycakealeks.com.tr',
      to: 'support@mycakealeks.com.tr',
      subject: `Новое сообщение от ${name} — MyCakeAleks`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#d4537e">Новое сообщение с сайта</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Сообщение:</strong></p>
          <div style="background:#fbeaf0;padding:16px;border-radius:8px;white-space:pre-wrap">${message}</div>
          <hr style="margin-top:24px;border-color:#f0e0e8"/>
          <p style="font-size:12px;color:#9ca3af">MyCakeAleks · mycakealeks.com.tr</p>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('contact form error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

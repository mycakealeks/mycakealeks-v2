import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'noreply@mycakealeks.com.tr'
const SUPPORT = 'support@mycakealeks.com.tr'

export async function POST(req: NextRequest) {
  try {
    const { name, email, businessName, website, description, locale = 'tr' } = await req.json()
    if (!name || !email || !businessName) {
      return NextResponse.json({ error: 'name, email, businessName required' }, { status: 400 })
    }

    await resend.emails.send({
      from: FROM,
      to: SUPPORT,
      subject: `🛍️ Yeni Satıcı Başvurusu — ${businessName}`,
      html: `
        <h2>Yeni Satıcı Başvurusu</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Ad Soyad</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">E-posta</td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">İşletme Adı</td><td style="padding:8px">${businessName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Web Sitesi</td><td style="padding:8px">${website || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Açıklama</td><td style="padding:8px">${description || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Dil</td><td style="padding:8px">${locale}</td></tr>
        </table>
      `,
    })

    // Auto-reply to applicant
    const autoReply: Record<string, { subject: string; body: string }> = {
      tr: {
        subject: '✅ Satıcı başvurunuz alındı — MyCakeAleks',
        body: `<p>Merhaba ${name},</p><p>Satıcı başvurunuz alındı. 3-5 iş günü içinde size geri döneceğiz.</p><p>MyCakeAleks Ekibi</p>`,
      },
      ru: {
        subject: '✅ Заявка продавца получена — MyCakeAleks',
        body: `<p>Здравствуйте, ${name}!</p><p>Ваша заявка на участие в маркетплейсе получена. Мы свяжемся с вами в течение 3-5 рабочих дней.</p><p>Команда MyCakeAleks</p>`,
      },
      en: {
        subject: '✅ Vendor application received — MyCakeAleks',
        body: `<p>Hi ${name},</p><p>Your vendor application has been received. We'll get back to you within 3-5 business days.</p><p>MyCakeAleks Team</p>`,
      },
    }
    const reply = autoReply[locale] ?? autoReply.tr
    await resend.emails.send({ from: FROM, to: email, subject: reply.subject, html: reply.body })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('vendor apply error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

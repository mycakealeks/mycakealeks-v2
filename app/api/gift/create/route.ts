import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendGiftCertificateEmail } from '@/app/lib/email'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })

    const { amount, recipientEmail, recipientName, message } = await req.json()
    if (!amount || !recipientEmail || !recipientName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const code = `GIFT${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    const senderName = me.user
      ? [(me.user as any).firstName, (me.user as any).lastName].filter(Boolean).join(' ') || me.user.email
      : 'MyCakeAleks'

    await payload.create({
      collection: 'gift-certificates',
      data: {
        code,
        amount,
        recipientEmail,
        recipientName,
        message: message || '',
        isUsed: false,
        expiresAt,
        ...(me.user ? { purchasedBy: me.user.id } : {}),
      },
    })

    await sendGiftCertificateEmail(recipientEmail, recipientName, senderName, amount, code, message || '')

    return NextResponse.json({ ok: true, code })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

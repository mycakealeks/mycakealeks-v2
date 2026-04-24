import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationEmail } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: email.trim().toLowerCase() } },
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return NextResponse.json({ ok: true }) // don't reveal if email exists
    }

    const user = result.docs[0]
    if (user.isEmailVerified) {
      return NextResponse.json({ ok: true })
    }

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires.toISOString(),
      },
    })

    await sendVerificationEmail(email, (user.firstName as string) || '', token)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-verification error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

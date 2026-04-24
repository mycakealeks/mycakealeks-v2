import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { emailVerificationToken: { equals: token } },
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 400 })
    }

    const user = result.docs[0]
    const expires = user.emailVerificationExpires
      ? new Date(user.emailVerificationExpires as string)
      : null

    if (!expires || expires < new Date()) {
      return NextResponse.json({ error: 'token_expired' }, { status: 400 })
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    })

    return NextResponse.json({ ok: true, email: user.email })
  } catch (err) {
    console.error('verify-email error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/app/lib/token'
import { sendPasswordReset } from '@/app/lib/email'
import { getPayload } from 'payload'
import config from '@payload-config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mycakealeks.com.tr'

export async function POST(req: NextRequest) {
  try {
    const { email, locale = 'tr' } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase().trim() } },
      overrideAccess: true,
      limit: 1,
    })

    // Always return ok — don't reveal whether user exists
    if (result.docs.length > 0) {
      const user = result.docs[0] as any
      // Use stored user locale, fall back to request locale
      const userLocale = user.locale || locale
      console.log('[reset-password] user locale:', userLocale, '| email:', user.email)
      const token = signToken({ email: user.email, exp: Date.now() + 3_600_000 })
      const resetLink = `${SITE}/${userLocale}/reset-password?token=${token}`
      await sendPasswordReset(user.email, user.firstName || '', resetLink, userLocale)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('reset-password error:', err)
    return NextResponse.json({ ok: true }) // always ok for security
  }
}

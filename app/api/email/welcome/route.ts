import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, locale = 'tr' } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
    await sendWelcomeEmail(email, firstName || '', locale)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('welcome email error:', err)
    return NextResponse.json({ ok: true }) // don't fail registration on email error
  }
}

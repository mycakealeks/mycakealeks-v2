import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/token'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({}))

  if (!token || !password || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const tokenData = verifyToken<{ email: string }>(token)
  if (!tokenData?.email) {
    return NextResponse.json({ error: 'Token expired or invalid' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: tokenData.email.toLowerCase().trim() } },
      overrideAccess: true,
      limit: 1,
    })

    if (!docs.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'users',
      id: docs[0].id,
      data: { password },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('confirm-reset error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/token'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = verifyToken<{ email: string }>(token)
    if (!data?.email) {
      return NextResponse.json({ error: 'Token expired or invalid' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: data.email } },
      overrideAccess: true,
      limit: 1,
    })

    if (!result.docs.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'users',
      id: result.docs[0].id,
      data: { password },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('confirm-reset error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

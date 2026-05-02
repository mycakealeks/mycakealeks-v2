import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verify user via cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      headers: { Cookie: `payload-token=${token}` },
    })
    if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const meData = await meRes.json()
    const user = meData.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { subscription, locale = 'tr' } = body
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    // Remove existing subscription for this user (avoid duplicates)
    const existing = await payload.find({
      collection: 'push-subscriptions',
      where: { user: { equals: user.id } },
      limit: 10,
    })
    for (const doc of existing.docs) {
      await payload.delete({ collection: 'push-subscriptions', id: doc.id })
    }

    await payload.create({
      collection: 'push-subscriptions',
      data: { user: user.id, subscription, locale },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('push/subscribe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

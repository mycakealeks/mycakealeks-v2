import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { sendPushNotification } from '@/app/lib/webpush'

export async function POST(req: NextRequest) {
  try {
    // Admin only
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      headers: { Cookie: `payload-token=${token}` },
    })
    const meData = await meRes.json()
    if (meData.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const { title, body, url = '/', userIds } = await req.json()

    const where = userIds?.length
      ? { user: { in: userIds } }
      : {}

    const subs = await payload.find({
      collection: 'push-subscriptions',
      where,
      limit: 1000,
    })

    let sent = 0
    let failed = 0
    for (const sub of subs.docs) {
      try {
        await sendPushNotification(sub.subscription as any, title, body, url)
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ ok: true, sent, failed })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendPushNotification } from '@/app/lib/webpush'

// Called by cron daily at 10:00 or via admin action
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })

    // Find subscriptions (limit to 500 per run)
    const subs = await payload.find({
      collection: 'push-subscriptions',
      limit: 500,
    })

    const MESSAGES: Record<string, { title: string; body: string }> = {
      tr: { title: 'Kaldığın yerden devam et! 🎂', body: 'MyCakeAleks seni bekliyor. Bugün bir ders izle!' },
      ru: { title: 'Продолжи обучение! 🎂', body: 'MyCakeAleks ждёт тебя. Посмотри урок сегодня!' },
      en: { title: 'Continue your learning! 🎂', body: 'MyCakeAleks is waiting for you. Watch a lesson today!' },
    }

    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000

    let sent = 0
    for (const sub of subs.docs) {
      try {
        // Check if user has any progress (has started a course) and hasn't been active recently
        const userId = typeof sub.user === 'object' ? (sub.user as any).id : sub.user
        const events = await payload.find({
          collection: 'user-events',
          where: {
            and: [
              { userId: { equals: userId } },
              { createdAt: { greater_than: new Date(threeDaysAgo).toISOString() } },
            ],
          },
          limit: 1,
        })

        // Skip if user was active in last 3 days
        if (events.totalDocs > 0) continue

        const locale = (sub.locale as string) || 'tr'
        const msg = MESSAGES[locale] ?? MESSAGES.tr
        await sendPushNotification(sub.subscription as any, msg.title, msg.body, '/dashboard')
        sent++
      } catch {
        // Skip failed subscriptions (expired/invalid)
      }
    }

    return NextResponse.json({ ok: true, sent })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

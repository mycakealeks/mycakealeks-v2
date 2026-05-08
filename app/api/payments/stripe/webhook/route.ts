import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseConfirmation, sendCourseAccess } from '@/app/lib/email'

async function grantCourseAccess(base: string, userId: string, courseId: string, amount: number, paymentId: string) {
  // 1. Create Order record
  await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: userId,
      items: [{ itemType: 'course', course: courseId, price: amount }],
      total: amount,
      status: 'paid',
      currency: 'TRY',
      paymentMethod: 'stripe',
      paymentId,
    }),
  })

  // 2. Add course to user's purchasedCourses
  const userRes = await fetch(`${base}/api/users/${userId}`)
  if (userRes.ok) {
    const user = await userRes.json()
    const existing: string[] = (user.purchasedCourses ?? []).map((c: any) =>
      typeof c === 'object' ? c.id : c
    )
    if (!existing.includes(courseId)) {
      await fetch(`${base}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchasedCourses: [...existing, courseId] }),
      })
    }
  }
}

async function notifyPurchase(base: string, userId: string, courseId: string, amount = 0) {
  try {
    const [userRes, courseRes] = await Promise.all([
      fetch(`${base}/api/users/${userId}`),
      fetch(`${base}/api/courses/${courseId}`),
    ])
    if (!userRes.ok || !courseRes.ok) return
    const user = await userRes.json()
    const course = await courseRes.json()
    const email: string = user.email
    const firstName: string = user.firstName || ''
    const locale: string = user.locale || 'tr'
    const courseName: string = course.title || ''
    const courseSlug: string = course.slug || courseId
    await Promise.all([
      sendPurchaseConfirmation(email, firstName, courseName, amount, locale),
      sendCourseAccess(email, firstName, courseName, courseSlug, locale),
    ])
  } catch (err) {
    console.error('notifyPurchase error:', err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  try {
    const event = JSON.parse(body)
    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object
        const { userId, courseId } = session?.metadata || {}
        const amount = (session?.amount_total ?? 0) / 100
        const paymentId: string = session?.payment_intent ?? session?.id ?? ''
        console.log('Payment completed:', { userId, courseId, amount })
        if (userId && courseId) {
          await grantCourseAccess(base, userId, courseId, amount, paymentId)
          await notifyPurchase(base, userId, courseId, amount)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data?.object
        console.log('Subscription event:', subscription?.id)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data?.object
        console.log('Subscription cancelled:', subscription?.id)
        break
      }
      default:
        console.log('Unhandled Stripe event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}

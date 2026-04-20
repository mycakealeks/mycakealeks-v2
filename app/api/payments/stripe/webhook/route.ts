import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseConfirmation, sendCourseAccess } from '@/app/lib/email'

// TODO: npm install stripe
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

async function notifyPurchase(userId: string, courseId: string, amount = 0) {
  try {
    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const [userRes, courseRes] = await Promise.all([
      fetch(`${base}/api/users/${userId}`),
      fetch(`${base}/api/courses/${courseId}`),
    ])
    if (!userRes.ok || !courseRes.ok) return
    const user = await userRes.json()
    const course = await courseRes.json()
    const email: string = user.email
    const firstName: string = user.firstName || ''
    const courseName: string = course.title || ''
    const courseSlug: string = course.slug || courseId
    await Promise.all([
      sendPurchaseConfirmation(email, firstName, courseName, amount),
      sendCourseAccess(email, firstName, courseName, courseSlug),
    ])
  } catch (err) {
    console.error('notifyPurchase error:', err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  try {
    // TODO: verify webhook signature
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    const event = JSON.parse(body)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object
        const { userId, courseId } = session?.metadata || {}
        const amount = (session?.amount_total ?? 0) / 100
        console.log('Payment completed:', { userId, courseId })
        if (userId && courseId) await notifyPurchase(userId, courseId, amount)
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

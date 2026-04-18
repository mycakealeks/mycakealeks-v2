import { NextRequest, NextResponse } from 'next/server'

// TODO: npm install stripe
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

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
        // TODO: create order in Payload, grant course access
        // await grantCourseAccess(userId, courseId)
        console.log('Payment completed:', { userId, courseId })
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data?.object
        // TODO: update subscription record in Payload
        console.log('Subscription event:', subscription?.id)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data?.object
        // TODO: mark subscription as cancelled in Payload
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

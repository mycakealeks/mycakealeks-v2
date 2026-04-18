import { NextRequest, NextResponse } from 'next/server'
import type { CreatePaymentSessionParams, PaymentSessionResult } from '@/types/payments'

// TODO: npm install stripe
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentSessionParams = await req.json()
    const { courseId, userId, plan, purchaseType, amount, currency, successUrl, cancelUrl } = body

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: replace mock with real Stripe session
    // const session = await stripe.checkout.sessions.create({
    //   mode: purchaseType === 'subscription' ? 'subscription' : 'payment',
    //   line_items: [{
    //     price_data: {
    //       currency: currency.toLowerCase(),
    //       unit_amount: Math.round(amount * 100),
    //       product_data: { name: courseId ? `Course ${courseId}` : 'Subscription' },
    //       ...(purchaseType === 'subscription' && {
    //         recurring: { interval: plan === 'yearly' ? 'year' : 'month' }
    //       }),
    //     },
    //     quantity: 1,
    //   }],
    //   metadata: { userId, courseId: courseId || '', plan: plan || '' },
    //   success_url: successUrl,
    //   cancel_url: cancelUrl,
    // })

    const result: PaymentSessionResult = {
      url: `${successUrl}?session_id=mock_${Date.now()}`,
      sessionId: `mock_session_${Date.now()}`,
      provider: 'stripe',
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Stripe session error:', error)
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 })
  }
}

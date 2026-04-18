import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import type { CreateYuKassaPaymentParams, YuKassaPaymentResult } from '@/types/payments'

// TODO: npm install yookassa  (or use fetch directly with YuKassa REST API)
// YuKassa REST API: https://yookassa.ru/developers/api

export async function POST(req: NextRequest) {
  try {
    const body: CreateYuKassaPaymentParams = await req.json()
    const { courseId, userId, plan, purchaseType, amount, currency, description, returnUrl } = body

    if (!userId || !amount || !returnUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const shopId = process.env.YUKASSA_SHOP_ID
    const secretKey = process.env.YUKASSA_SECRET_KEY

    if (!shopId || !secretKey) {
      // Return mock response when keys not configured
      const result: YuKassaPaymentResult = {
        paymentId: `mock_yk_${Date.now()}`,
        confirmationUrl: `${returnUrl}?payment_id=mock_${Date.now()}`,
        status: 'pending',
      }
      return NextResponse.json(result)
    }

    // TODO: real YuKassa API call
    // const idempotenceKey = randomUUID()
    // const response = await fetch('https://api.yookassa.ru/v3/payments', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Idempotence-Key': idempotenceKey,
    //     Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
    //   },
    //   body: JSON.stringify({
    //     amount: { value: amount.toFixed(2), currency },
    //     confirmation: { type: 'redirect', return_url: returnUrl },
    //     description,
    //     metadata: { userId, courseId: courseId || '', plan: plan || '' },
    //     capture: true,
    //   }),
    // })
    // const payment = await response.json()

    const result: YuKassaPaymentResult = {
      paymentId: `mock_yk_${Date.now()}`,
      confirmationUrl: `${returnUrl}?payment_id=mock_${Date.now()}`,
      status: 'pending',
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('YuKassa payment error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}

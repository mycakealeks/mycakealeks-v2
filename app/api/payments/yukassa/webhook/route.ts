import { NextRequest, NextResponse } from 'next/server'
import type { YuKassaWebhookEvent } from '@/types/payments'

export async function POST(req: NextRequest) {
  try {
    const event: YuKassaWebhookEvent = await req.json()

    // TODO: verify request IP is from YuKassa (185.71.76.0/27, 185.71.77.0/27, 77.75.153.0/25)

    switch (event.type) {
      case 'payment.succeeded': {
        const { id: paymentId, metadata } = event.object
        const { userId, courseId } = metadata || {}
        // TODO: create order in Payload, grant course access
        // await grantCourseAccess(userId, courseId)
        console.log('YuKassa payment succeeded:', { paymentId, userId, courseId })
        break
      }
      case 'payment.canceled': {
        const { id: paymentId } = event.object
        // TODO: mark order as cancelled in Payload
        console.log('YuKassa payment cancelled:', paymentId)
        break
      }
      case 'refund.succeeded': {
        const { id: refundId } = event.object
        // TODO: handle refund — revoke access, update payment record
        console.log('YuKassa refund succeeded:', refundId)
        break
      }
      default:
        console.log('Unhandled YuKassa event:', event.type)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('YuKassa webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import type { YuKassaWebhookEvent } from '@/types/payments'
import { sendPurchaseConfirmation, sendCourseAccess } from '@/app/lib/email'

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
  try {
    const event: YuKassaWebhookEvent = await req.json()

    // TODO: verify request IP is from YuKassa (185.71.76.0/27, 185.71.77.0/27, 77.75.153.0/25)

    switch (event.type) {
      case 'payment.succeeded': {
        const { id: paymentId, metadata, amount } = event.object
        const { userId, courseId } = metadata || {}
        const amountValue = parseFloat(amount?.value ?? '0')
        console.log('YuKassa payment succeeded:', { paymentId, userId, courseId })
        if (userId && courseId) await notifyPurchase(userId, courseId, amountValue)
        break
      }
      case 'payment.canceled': {
        const { id: paymentId } = event.object
        console.log('YuKassa payment cancelled:', paymentId)
        break
      }
      case 'refund.succeeded': {
        const { id: refundId } = event.object
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

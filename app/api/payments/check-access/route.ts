import { NextRequest, NextResponse } from 'next/server'
import type { CheckAccessResult } from '@/types/payments'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId are required' }, { status: 400 })
    }

    // TODO: replace with real Payload queries
    // 1. Check if user has purchased the course directly (Orders collection)
    // const order = await payload.find({
    //   collection: 'orders',
    //   where: {
    //     and: [
    //       { 'user': { equals: userId } },
    //       { 'items.course': { equals: courseId } },
    //       { 'status': { equals: 'paid' } },
    //     ]
    //   }
    // })
    // if (order.docs.length > 0) return { hasAccess: true, reason: 'purchased' }

    // 2. Check if user has an active subscription
    // const subscription = await payload.find({
    //   collection: 'subscriptions',
    //   where: {
    //     and: [
    //       { 'user': { equals: userId } },
    //       { 'status': { equals: 'active' } },
    //       { 'endDate': { greater_than: new Date().toISOString() } },
    //     ]
    //   }
    // })
    // if (subscription.docs.length > 0) return { hasAccess: true, reason: 'subscription' }

    // Mock: no access by default until real logic is wired
    const result: CheckAccessResult = {
      hasAccess: false,
      reason: 'no_access',
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Check access error:', error)
    return NextResponse.json({ error: 'Failed to check access' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import type { CheckAccessResult } from '@/types/payments'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json({ hasAccess: false, reason: 'no_user' } satisfies CheckAccessResult)
    }

    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const userRes = await fetch(`${base}/api/users/${userId}`, { cache: 'no-store' })
    if (!userRes.ok) {
      return NextResponse.json({ hasAccess: false, reason: 'no_user' } satisfies CheckAccessResult)
    }

    const user = await userRes.json()
    const purchased: string[] = (user.purchasedCourses ?? []).map((c: any) =>
      typeof c === 'object' ? String(c.id) : String(c)
    )

    // If no courseId provided, just check if user is logged in (general access)
    if (!courseId) {
      return NextResponse.json({ hasAccess: true, reason: 'authenticated' } satisfies CheckAccessResult)
    }

    if (purchased.includes(String(courseId))) {
      return NextResponse.json({ hasAccess: true, reason: 'purchased' } satisfies CheckAccessResult)
    }

    return NextResponse.json({ hasAccess: false, reason: 'no_access' } satisfies CheckAccessResult)
  } catch (error) {
    console.error('Check access error:', error)
    return NextResponse.json({ error: 'Failed to check access' }, { status: 500 })
  }
}

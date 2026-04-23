import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { spendPoints, getBalance, POINTS_TO_TRY } from '@/app/lib/points'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { points } = await req.json()
    if (!points || points < 10) {
      return NextResponse.json({ error: 'Minimum 10 points required' }, { status: 400 })
    }

    const balance = await getBalance(me.user.id)
    if (balance < points) {
      return NextResponse.json({ error: 'Insufficient points balance', balance }, { status: 400 })
    }

    await spendPoints(me.user.id, points)
    const discount = Math.round(points * POINTS_TO_TRY)
    return NextResponse.json({ ok: true, pointsSpent: points, discount, newBalance: balance - points })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

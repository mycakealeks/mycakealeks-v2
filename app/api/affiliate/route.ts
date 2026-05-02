import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

async function getUser(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    headers: { Cookie: `payload-token=${token}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.user ?? null
}

// GET /api/affiliate?action=stats|payouts
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const action = req.nextUrl.searchParams.get('action') || 'stats'

    const affiliateRes = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
    })
    const affiliate = affiliateRes.docs[0] ?? null

    if (action === 'stats') {
      if (!affiliate) return NextResponse.json({ affiliate: null })

      // Count referral clicks/conversions from referrals collection
      const referrals = await payload.find({
        collection: 'referrals',
        where: { referrer: { equals: user.id } },
        limit: 1000,
      })
      const conversions = referrals.docs.filter((r: any) => r.status === 'converted').length

      return NextResponse.json({
        affiliate: {
          code: affiliate.code,
          commissionRate: affiliate.commissionRate,
          totalEarned: affiliate.totalEarned,
          pendingPayout: affiliate.pendingPayout,
          status: affiliate.status,
          clicks: referrals.totalDocs,
          conversions,
        },
      })
    }

    return NextResponse.json({ affiliate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/affiliate — apply
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUser(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })

    // Check if already applied
    const existing = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ ok: true, affiliate: existing.docs[0] })
    }

    const { notes, payoutMethod } = await req.json()

    // Generate unique code from email prefix + random suffix
    const base = (user.email?.split('@')[0] ?? 'user').replace(/[^a-z0-9]/gi, '').toLowerCase()
    const code = `${base}${Math.random().toString(36).slice(2, 6)}`

    const affiliate = await payload.create({
      collection: 'affiliates',
      data: {
        user: user.id,
        code,
        commissionRate: 20,
        totalEarned: 0,
        pendingPayout: 0,
        status: 'pending',
        notes: notes || '',
        payoutMethod: payoutMethod || '',
      },
    })

    return NextResponse.json({ ok: true, affiliate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

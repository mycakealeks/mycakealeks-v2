import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyReferralCode } from '@/app/lib/referral'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { code } = await req.json()
    if (!code) return NextResponse.json({ ok: false })

    const applied = await applyReferralCode(code, me.user.id)
    return NextResponse.json({ ok: applied })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

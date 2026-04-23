import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getHistory } from '@/app/lib/points'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const history = await getHistory(me.user.id)
    return NextResponse.json({ history })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ achievements: [] })

    const data = await payload.find({
      collection: 'achievements',
      where: { user: { equals: me.user.id } },
      limit: 100,
    })
    return NextResponse.json({ achievements: data.docs })
  } catch (err: any) {
    return NextResponse.json({ achievements: [], error: err.message })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendCourseCompletionEmail } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseName } = await req.json()
    const user = me.user as any

    await sendCourseCompletionEmail(
      user.email,
      user.firstName || user.email,
      courseName,
      user.locale || 'tr',
    )
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

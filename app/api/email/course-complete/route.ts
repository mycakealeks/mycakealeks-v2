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
    const firstName = user.firstName || user.email

    await sendCourseCompletionEmail(user.email, firstName, courseName)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

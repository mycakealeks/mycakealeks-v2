import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ reviews: [] })

  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { course: { equals: courseId } },
          { isApproved: { equals: true } },
        ],
      },
      sort: '-createdAt',
      limit: 50,
    })
    return NextResponse.json({ reviews: data.docs })
  } catch (err: any) {
    return NextResponse.json({ reviews: [], error: err.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId, rating, text } = await req.json()
    if (!courseId || !rating || !text?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
    }

    // Verify purchase
    const user = me.user as any
    const purchased: any[] = user.purchasedCourses || []
    const hasCourse = purchased.some((c: any) =>
      (typeof c === 'object' ? c.id : c) === courseId
    )
    if (!hasCourse) {
      return NextResponse.json({ error: 'Must purchase course to review' }, { status: 403 })
    }

    // Prevent duplicate review
    const existing = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { user: { equals: me.user.id } },
          { course: { equals: courseId } },
        ],
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })
    }

    const review = await payload.create({
      collection: 'reviews',
      data: {
        user: me.user.id,
        course: courseId,
        rating,
        text: text.trim(),
        isApproved: false,
      },
    })

    return NextResponse.json({ ok: true, review })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

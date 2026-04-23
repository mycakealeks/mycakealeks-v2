import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { CertificateDocument, type CertLocale } from '@/app/lib/certificate'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const me = await payload.auth({ headers: req.headers })
    if (!me.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId } = await params

    // Verify course purchase
    const user = me.user as any
    const purchased: any[] = user.purchasedCourses || []
    const hasCourse = purchased.some((c: any) =>
      (typeof c === 'object' ? c.id : c) === courseId
    )
    if (!hasCourse) {
      return NextResponse.json({ error: 'Course not purchased' }, { status: 403 })
    }

    // Fetch course
    const courseRes = await payload.findByID({ collection: 'courses', id: courseId })
    if (!courseRes) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Check 100% completion
    const lessonsData = await payload.find({
      collection: 'lessons',
      where: { course: { equals: courseId } },
      limit: 200,
    })
    const progressData = await payload.find({
      collection: 'progress',
      where: {
        and: [
          { user: { equals: me.user.id } },
          { course: { equals: courseId } },
          { completed: { equals: true } },
        ],
      },
      limit: 200,
    })

    const totalLessons = lessonsData.totalDocs
    const completedLessons = progressData.totalDocs

    if (totalLessons > 0 && completedLessons < totalLessons) {
      return NextResponse.json(
        { error: 'Course not completed', totalLessons, completedLessons },
        { status: 403 },
      )
    }

    // Determine locale
    const locale = (req.nextUrl.searchParams.get('locale') ?? 'tr') as CertLocale

    // Build student name
    const studentName =
      [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

    const certId = randomUUID()
    const issuedAt = new Date().toLocaleDateString('tr-TR')

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(CertificateDocument, {
        studentName,
        courseName: (courseRes as any).title,
        issuedAt,
        certId,
        locale,
      })
    )

    // Record achievement (best-effort)
    try {
      await payload.create({
        collection: 'achievements',
        data: {
          user: me.user.id,
          type: 'first_course',
          earnedAt: new Date().toISOString(),
        },
      })
    } catch { /* may already exist */ }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certId.slice(0, 8)}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

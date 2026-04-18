import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const where: any = { user: { equals: userId } }
    if (courseId) where.course = { equals: courseId }

    const result = await payload.find({
      collection: 'progress',
      where,
      limit: 1000,
    })

    return NextResponse.json({ docs: result.docs, totalDocs: result.totalDocs })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, courseId, lessonId, watchedSeconds } = body

    if (!userId || !courseId || !lessonId) {
      return NextResponse.json({ error: 'userId, courseId, lessonId required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'progress',
      where: {
        user: { equals: userId },
        course: { equals: courseId },
        lesson: { equals: lessonId },
      },
      limit: 1,
    })

    const isCompleted = watchedSeconds !== undefined ? false : true
    const now = new Date().toISOString()

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      const updated = await payload.update({
        collection: 'progress',
        id: doc.id,
        data: {
          watchedSeconds: watchedSeconds ?? (doc.watchedSeconds || 0),
          completed: isCompleted || doc.completed,
          completedAt: isCompleted && !doc.completed ? now : doc.completedAt,
        },
      })
      return NextResponse.json(updated)
    }

    const created = await payload.create({
      collection: 'progress',
      data: {
        user: userId,
        course: courseId,
        lesson: lessonId,
        watchedSeconds: watchedSeconds ?? 0,
        completed: isCompleted,
        completedAt: isCompleted ? now : undefined,
      },
    })

    return NextResponse.json(created)
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

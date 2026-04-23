import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 3600

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const [users, lessons, courses] = await Promise.all([
      payload.find({ collection: 'users', limit: 0 }),
      payload.find({ collection: 'lessons', limit: 0 }),
      payload.find({ collection: 'courses', limit: 0, where: { status: { equals: 'published' } } }),
    ])
    return NextResponse.json({
      users: users.totalDocs,
      lessons: lessons.totalDocs,
      courses: courses.totalDocs,
    })
  } catch {
    return NextResponse.json({ users: 0, lessons: 0, courses: 0 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const userId = searchParams.get('userId')
    const currentCourseId = searchParams.get('courseId')
    const limit = parseInt(searchParams.get('limit') ?? '3', 10)

    const payload = await getPayload({ config })

    const allCoursesRes = await payload.find({ collection: 'courses', limit: 50 })
    const allCourses = allCoursesRes.docs as any[]

    const fallback = allCourses.slice(0, limit).map((c: any) => ({
      courseId: String(c.id),
      reason: '',
      course: c,
    }))

    if (!userId) return NextResponse.json({ recommendations: fallback })

    const [viewRes, purchaseRes] = await Promise.all([
      (payload as any).find({
        collection: 'user-events',
        where: { and: [{ user: { equals: userId } }, { event: { equals: 'course_view' } }] },
        limit: 20,
        sort: '-createdAt',
      }),
      (payload as any).find({
        collection: 'user-events',
        where: { and: [{ user: { equals: userId } }, { event: { equals: 'purchase' } }] },
        limit: 20,
      }),
    ])

    const viewedIds = [...new Set((viewRes.docs as any[]).map((e: any) => e.entityId).filter(Boolean))] as string[]
    const purchasedIds = [...new Set((purchaseRes.docs as any[]).map((e: any) => e.entityId).filter(Boolean))] as string[]

    if (viewedIds.length === 0 && purchasedIds.length === 0) {
      return NextResponse.json({ recommendations: fallback })
    }

    const candidateCourses = allCourses.filter((c: any) => !purchasedIds.includes(String(c.id)))
    if (candidateCourses.length === 0) return NextResponse.json({ recommendations: [] })

    const viewedTitles = viewedIds
      .map((id) => allCourses.find((c: any) => String(c.id) === id)?.title)
      .filter(Boolean)

    const purchasedTitles = purchasedIds
      .map((id) => allCourses.find((c: any) => String(c.id) === id)?.title)
      .filter(Boolean)

    const currentCourse = currentCourseId
      ? allCourses.find((c: any) => String(c.id) === currentCourseId)
      : null

    const candidateList = candidateCourses
      .map((c: any) => `ID:${c.id} "${c.title}"${c.description ? ` - ${String(c.description).slice(0, 80)}` : ''}`)
      .join('\n')

    const prompt = `Пользователь просмотрел курсы: ${viewedTitles.join(', ') || 'нет данных'}.
Купил: ${purchasedTitles.join(', ') || 'нет'}.${currentCourse ? `\nСейчас смотрит: "${currentCourse.title}".` : ''}

Из доступных курсов выбери ${limit} наиболее релевантных:
${candidateList}

Верни ТОЛЬКО JSON массив, например:
[{"courseId":"1","reason":"Логическое продолжение"},{"courseId":"2","reason":"Похожая тематика"}]`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const recs: any[] = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    const enriched = recs
      .slice(0, limit)
      .map((r: any) => ({
        ...r,
        course: allCourses.find((c: any) => String(c.id) === String(r.courseId)),
      }))
      .filter((r: any) => r.course)

    return NextResponse.json({ recommendations: enriched.length > 0 ? enriched : fallback })
  } catch (err) {
    console.error('recommendations error:', err)
    return NextResponse.json({ recommendations: [] })
  }
}

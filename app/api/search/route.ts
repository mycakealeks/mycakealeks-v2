import { NextRequest, NextResponse } from 'next/server'

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const enc = encodeURIComponent(q)

  try {
    const [coursesRes, newsRes, recipesRes, lessonsRes] = await Promise.all([
      fetch(`${SERVER}/api/courses?where[status][equals]=published&where[title][like]=${enc}&limit=5`),
      fetch(`${SERVER}/api/news?where[status][equals]=published&where[title][like]=${enc}&limit=5`),
      fetch(`${SERVER}/api/recipes?where[title][like]=${enc}&limit=5`),
      fetch(`${SERVER}/api/lessons?where[title][like]=${enc}&limit=5&depth=1`),
    ])

    const [coursesData, newsData, recipesData, lessonsData] = await Promise.all([
      coursesRes.json(),
      newsRes.json(),
      recipesRes.json(),
      lessonsRes.json(),
    ])

    const results = [
      ...(coursesData.docs || []).map((c: any) => ({
        type: 'course', id: c.id, title: c.title, slug: c.slug,
        excerpt: c.description, emoji: c.emoji || '🎂',
      })),
      ...(newsData.docs || []).map((n: any) => ({
        type: 'news', id: n.id, title: n.title, slug: n.slug,
        excerpt: n.excerpt, emoji: n.coverEmoji || '📰',
      })),
      ...(recipesData.docs || []).map((r: any) => ({
        type: 'recipe', id: r.id, title: r.title, slug: r.slug,
        excerpt: r.description, emoji: r.emoji || '🍰',
      })),
      ...(lessonsData.docs || []).map((l: any) => {
        const course = typeof l.course === 'object' ? l.course : null
        return {
          type: 'lesson',
          id: l.id,
          title: l.title,
          slug: l.id,
          courseSlug: course?.slug ?? null,
          courseTitle: course?.title ?? null,
          duration: l.duration ?? null,
          excerpt: course?.title ? `${course.title}` : undefined,
          emoji: '🎬',
        }
      }),
    ]

    return NextResponse.json({ results, total: results.length })
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message })
  }
}

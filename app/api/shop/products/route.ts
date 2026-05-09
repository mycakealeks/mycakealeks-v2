import { NextRequest, NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const vendorId = searchParams.get('vendor')
  const q = searchParams.get('q')
  const sort = searchParams.get('sort') || '-createdAt'
  const relatedCourse = searchParams.get('relatedCourse')
  const limit = searchParams.get('limit') || '20'

  const params = new URLSearchParams()
  params.set('where[status][equals]', 'published')
  params.set('limit', limit)
  params.set('depth', '2')

  if (category) params.set('where[category][equals]', category)
  if (vendorId) params.set('where[vendor][equals]', vendorId)
  if (relatedCourse) params.set('where[relatedCourses][in]', relatedCourse)
  if (q) params.set('where[name][like]', q)

  const sortMap: Record<string, string> = {
    price_asc: 'price',
    price_desc: '-price',
    newest: '-createdAt',
    featured: '-isFeatured',
  }
  params.set('sort', sortMap[sort] ?? '-createdAt')

  try {
    const res = await fetch(`${BASE}/api/products?${params.toString()}`, {
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ docs: [], totalDocs: 0 }, { status: 200 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  if (!email) return NextResponse.json({ available: true })

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    return NextResponse.json({ available: result.totalDocs === 0 })
  } catch {
    return NextResponse.json({ available: true })
  }
}

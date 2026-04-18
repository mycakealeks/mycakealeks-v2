import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const isFree = searchParams.get('isFree') === 'true'

    const cdnHostname = process.env.BUNNY_CDN_HOSTNAME
    const libraryId = process.env.BUNNY_LIBRARY_ID

    if (!cdnHostname || !libraryId) {
      return NextResponse.json({ error: 'Bunny.net not configured' }, { status: 500 })
    }

    if (!isFree) {
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const accessRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/check-access?userId=${userId}`,
        { cache: 'no-store' }
      )
      const accessData = await accessRes.json()

      if (!accessData.hasAccess) {
        return NextResponse.json({ error: 'Access denied', reason: accessData.reason }, { status: 403 })
      }
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 4 * 60 * 60

    const securityKey = process.env.BUNNY_STREAM_API_KEY || ''
    const hashInput = securityKey + videoId + expiresAt
    const token = crypto.createHash('sha256').update(hashInput).digest('hex')

    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expiresAt}`

    return NextResponse.json({ embedUrl, expiresAt })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

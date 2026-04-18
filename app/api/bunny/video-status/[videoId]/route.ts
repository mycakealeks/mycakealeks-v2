import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    const libraryId = process.env.BUNNY_LIBRARY_ID
    const apiKey = process.env.BUNNY_STREAM_API_KEY

    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: 'Bunny.net not configured' }, { status: 500 })
    }

    const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      headers: { AccessKey: apiKey },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const video = await res.json()

    const statusMap: Record<number, string> = {
      0: 'pending',
      1: 'pending',
      2: 'pending',
      3: 'processing',
      4: 'ready',
      5: 'error',
      6: 'error',
    }

    return NextResponse.json({
      videoId: video.guid,
      status: statusMap[video.status] ?? 'pending',
      duration: video.length,
      thumbnailUrl: video.thumbnailFileName
        ? `https://${process.env.BUNNY_CDN_HOSTNAME}/${video.guid}/${video.thumbnailFileName}`
        : null,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, courseId } = await req.json()

    if (!title || !courseId) {
      return NextResponse.json({ error: 'title and courseId required' }, { status: 400 })
    }

    const libraryId = process.env.BUNNY_LIBRARY_ID
    const apiKey = process.env.BUNNY_STREAM_API_KEY

    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: 'Bunny.net not configured' }, { status: 500 })
    }

    const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Bunny API error', details: text }, { status: 502 })
    }

    const video = await res.json()

    return NextResponse.json({
      videoId: video.guid,
      uploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${video.guid}`,
      uploadHeaders: { AccessKey: apiKey },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

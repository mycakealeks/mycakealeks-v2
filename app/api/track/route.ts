import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, entityId, entityType, metadata, sessionId } = body
    if (!event) return NextResponse.json({ ok: false }, { status: 400 })

    let userId: string | undefined
    const tokenCookie = req.cookies.get('payload-token')?.value
    if (tokenCookie) {
      const jwtPayload = decodeJwtPayload(tokenCookie)
      if (jwtPayload?.id) userId = String(jwtPayload.id)
    }

    const payload = await getPayload({ config })
    await (payload as any).create({
      collection: 'user-events',
      data: {
        ...(userId ? { user: userId } : {}),
        sessionId: sessionId || req.cookies.get('sid')?.value || '',
        event,
        entityId: entityId || '',
        entityType: entityType || '',
        metadata: metadata || {},
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

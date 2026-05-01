import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SignJWT } from 'jose'

const TOKEN_EXPIRATION = 60 * 60 * 24 * 30 // 30 days

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login?error=oauth', req.url))
  }

  try {
    const payload = await getPayload({ config })
    const email = session.user.email.toLowerCase()

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    let userId: string | number

    if (existing.totalDocs === 0) {
      const nameParts = (session.user.name || '').split(' ')
      const created = await (payload as any).create({
        collection: 'users',
        data: {
          email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          password: crypto.randomUUID() + crypto.randomUUID(),
          isEmailVerified: true,
        },
      })
      userId = created.id
    } else {
      const user = existing.docs[0] as any
      userId = user.id
      if (!user.isEmailVerified) {
        await (payload as any).update({
          collection: 'users',
          id: userId,
          data: { isEmailVerified: true },
        })
      }
    }

    // payload.secret is sha256(PAYLOAD_SECRET).hex().slice(0,32) — the actual signing key
    const secret = new TextEncoder().encode(payload.secret)
    const token = await new SignJWT({
      id: userId,
      email,
      collection: 'users',
      isEmailVerified: true,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_EXPIRATION}s`)
      .sign(secret)

    const redirect = req.nextUrl.searchParams.get('redirect') || '/dashboard'
    const response = NextResponse.redirect(new URL(redirect, req.url))
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRATION,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('sync-payload error:', err)
    return NextResponse.redirect(new URL('/login?error=oauth', req.url))
  }
}

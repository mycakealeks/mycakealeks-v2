import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { jwtVerify, SignJWT } from 'jose'

const RP_ID = process.env.RP_ID || new URL(process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr').hostname
const ORIGIN = process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr'
const TOKEN_EXPIRATION = 7200

export async function POST(req: NextRequest) {
  try {
    const challengeCookie = req.cookies.get('passkey-challenge')?.value
    if (!challengeCookie) return NextResponse.json({ error: 'Challenge expired' }, { status: 400 })

    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET!)
    const { payload: challengeData } = await jwtVerify(challengeCookie, secret)
    const expectedChallenge = String(challengeData.challenge)

    const body = await req.json()
    const credentialIdBase64 = body.id as string

    const payloadCMS = await getPayload({ config })
    const pkResult = await (payloadCMS as any).find({
      collection: 'passkeys',
      where: { credentialId: { equals: credentialIdBase64 } },
      limit: 1,
    })

    if (pkResult.totalDocs === 0) {
      return NextResponse.json({ error: 'Passkey not found' }, { status: 404 })
    }

    const storedPasskey = pkResult.docs[0] as any
    const authenticator = {
      credentialID: Buffer.from(storedPasskey.credentialId as string, 'base64url') as unknown as Uint8Array,
      credentialPublicKey: Buffer.from(storedPasskey.publicKey as string, 'base64url') as unknown as Uint8Array,
      counter: storedPasskey.counter as number,
      transports: storedPasskey.transports
        ? JSON.parse(storedPasskey.transports as string)
        : undefined,
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator,
      requireUserVerification: false,
    })

    if (!verification.verified) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    await (payloadCMS as any).update({
      collection: 'passkeys',
      id: storedPasskey.id,
      data: { counter: verification.authenticationInfo.newCounter },
    })

    const userId = typeof storedPasskey.user === 'object'
      ? storedPasskey.user.id
      : storedPasskey.user
    const userResult = await payloadCMS.findByID({ collection: 'users', id: userId })
    const email = userResult.email as string

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

    const response = NextResponse.json({ ok: true })
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRATION,
      path: '/',
    })
    response.cookies.delete('passkey-challenge')
    return response
  } catch (err) {
    console.error('passkey auth-verify error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

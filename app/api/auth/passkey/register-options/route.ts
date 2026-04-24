import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { jwtVerify, SignJWT } from 'jose'

const RP_ID = process.env.RP_ID || new URL(process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr').hostname
const RP_NAME = 'MyCakeAleks'

export async function GET(req: NextRequest) {
  try {
    const payloadToken = req.cookies.get('payload-token')?.value
    if (!payloadToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET!)
    const { payload: tokenData } = await jwtVerify(payloadToken, secret)
    const userId = String(tokenData.id)
    const userEmail = String(tokenData.email)

    const payloadCMS = await getPayload({ config })
    const existingPasskeys = await (payloadCMS as any).find({
      collection: 'passkeys',
      where: { user: { equals: userId } },
      limit: 100,
    })

    const excludeCredentials = existingPasskeys.docs.map((pk: any) => ({
      id: Buffer.from(pk.credentialId as string, 'base64url'),
      type: 'public-key' as const,
      transports: pk.transports ? JSON.parse(pk.transports) : undefined,
    }))

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: userId,
      userName: userEmail,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    })

    const challengeJwt = await new SignJWT({ challenge: options.challenge, userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(secret)

    const response = NextResponse.json(options)
    response.cookies.set('passkey-challenge', challengeJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('passkey register-options error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

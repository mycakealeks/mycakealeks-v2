import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { SignJWT } from 'jose'

const RP_ID = process.env.RP_ID || new URL(process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr').hostname

export async function GET(req: NextRequest) {
  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: 'preferred',
      // Empty allowCredentials = discoverable credentials (device picks from stored passkeys)
    })

    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET!)
    const challengeJwt = await new SignJWT({ challenge: options.challenge })
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
    console.error('passkey auth-options error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

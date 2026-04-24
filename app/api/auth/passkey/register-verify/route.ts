import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { jwtVerify } from 'jose'

const RP_ID = process.env.RP_ID || new URL(process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr').hostname
const ORIGIN = process.env.NEXTAUTH_URL || 'https://mycakealeks.com.tr'

export async function POST(req: NextRequest) {
  try {
    const challengeCookie = req.cookies.get('passkey-challenge')?.value
    if (!challengeCookie) return NextResponse.json({ error: 'Challenge expired' }, { status: 400 })

    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET!)
    const { payload: challengeData } = await jwtVerify(challengeCookie, secret)
    const expectedChallenge = String(challengeData.challenge)
    const userId = String(challengeData.userId)

    const body = await req.json()
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: false,
    })

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    const { credentialID, credentialPublicKey, counter, credentialDeviceType } = verification.registrationInfo

    const payloadCMS = await getPayload({ config })
    await (payloadCMS as any).create({
      collection: 'passkeys',
      data: {
        user: userId,
        credentialId: Buffer.from(credentialID).toString('base64url'),
        publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
        counter,
        deviceType: credentialDeviceType,
        transports: JSON.stringify(body.response?.transports || []),
      },
    })

    const response = NextResponse.json({ ok: true })
    response.cookies.delete('passkey-challenge')
    return response
  } catch (err) {
    console.error('passkey register-verify error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

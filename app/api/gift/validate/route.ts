import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code } = await req.json()
    if (!code) return NextResponse.json({ valid: false, message: 'Code required' })

    const result = await payload.find({
      collection: 'gift-certificates',
      where: { code: { equals: code.trim().toUpperCase() } },
      limit: 1,
    })
    const cert = result.docs[0] as any
    if (!cert) return NextResponse.json({ valid: false, message: 'Invalid code' })
    if (cert.isUsed) return NextResponse.json({ valid: false, message: 'Already used' })
    if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Expired' })
    }

    return NextResponse.json({ valid: true, amount: cert.amount, certId: cert.id })
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message })
  }
}

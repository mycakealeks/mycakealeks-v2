import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendPurchaseConfirmation } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, shippingAddress } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'items required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get current user
    const token = req.cookies.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      headers: { Cookie: `payload-token=${token}` },
      cache: 'no-store',
    })
    if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { user } = await meRes.json()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const orders: any[] = []

    for (const item of items) {
      const productRes = await payload.findByID({
        collection: 'products',
        id: item.productId,
        overrideAccess: true,
      })
      if (!productRes || productRes.status !== 'published') continue

      const price = (productRes as any).price * (item.quantity || 1)
      const vendorId = typeof (productRes as any).vendor === 'object'
        ? (productRes as any).vendor?.id
        : (productRes as any).vendor

      // Get vendor for commission rate
      let commissionRate = 15
      if (vendorId) {
        try {
          const vendor = await payload.findByID({ collection: 'vendors', id: vendorId, overrideAccess: true })
          commissionRate = (vendor as any).commissionRate ?? 15
        } catch { /* use default */ }
      }

      const commission = Math.round(price * commissionRate / 100)
      const vendorPayout = price - commission

      const order = await (payload as any).create({
        collection: 'product-orders',
        data: {
          buyer: user.id,
          vendor: vendorId || null,
          product: item.productId,
          quantity: item.quantity || 1,
          price,
          commission,
          vendorPayout,
          status: 'pending',
          shippingAddress: shippingAddress || {},
          createdAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
      orders.push(order)
    }

    // Send confirmation email
    if (orders.length > 0) {
      const productName = orders.map((o: any) => {
        const p = o.product
        return typeof p === 'object' ? p.name : 'Товар'
      }).join(', ')
      const total = orders.reduce((sum: number, o: any) => sum + (o.price || 0), 0)
      sendPurchaseConfirmation(
        user.email,
        user.firstName || '',
        productName,
        total,
        user.locale || 'tr',
      ).catch(() => {})
    }

    return NextResponse.json({ ok: true, orders })
  } catch (err) {
    console.error('shop order error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

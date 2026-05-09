import { NextRequest, NextResponse } from 'next/server'

// Cart is managed client-side via localStorage.
// This endpoint exists for server-side cart validation before order creation.

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1 } = await req.json()
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/products/${productId}`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const product = await res.json()
    if (product.status !== 'published') {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

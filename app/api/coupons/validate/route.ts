import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code, courseId, amount } = await req.json()
    if (!code || amount == null) {
      return NextResponse.json({ valid: false, message: 'Missing code or amount' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'coupons',
      where: { code: { equals: String(code).toUpperCase().trim() } },
      limit: 1,
      overrideAccess: true,
    })

    const coupon = docs[0]
    if (!coupon) return NextResponse.json({ valid: false, message: 'Coupon not found' })
    if (!coupon.isActive) return NextResponse.json({ valid: false, message: 'Coupon is inactive' })
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon has expired' })
    }
    if (coupon.maxUses && coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' })
    }
    if (coupon.minOrderAmount && amount < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount is ${coupon.minOrderAmount} TRY`,
      })
    }

    // Check if coupon is restricted to specific courses
    if (courseId && coupon.applicableCourses && coupon.applicableCourses.length > 0) {
      const applicableIds = coupon.applicableCourses.map((c: any) =>
        typeof c === 'object' ? String(c.id) : String(c)
      )
      if (!applicableIds.includes(String(courseId))) {
        return NextResponse.json({ valid: false, message: 'Coupon not applicable to this course' })
      }
    }

    const discount =
      coupon.type === 'percentage'
        ? Math.round((amount * coupon.value) / 100)
        : Math.min(coupon.value, amount)

    const finalAmount = Math.max(0, amount - discount)

    return NextResponse.json({
      valid: true,
      discount,
      finalAmount,
      type: coupon.type,
      value: coupon.value,
      message: `Discount applied: -${coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} TRY`}`,
    })
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 })
  }
}

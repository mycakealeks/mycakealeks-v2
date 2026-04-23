'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import PaymentButton from './PaymentButton'
import CouponInput from './CouponInput'
import GiftCertInput from './GiftCertInput'

interface CheckoutFormProps {
  courseId?: string
  userId: string
  baseAmount: number
  isSubscription: boolean
  plan?: string
  cancelLabel: string
  totalLabel: string
  currency: string
}

export default function CheckoutForm({
  courseId,
  userId,
  baseAmount,
  isSubscription,
  plan,
  cancelLabel,
  totalLabel,
  currency,
}: CheckoutFormProps) {
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [giftDiscount, setGiftDiscount] = useState(0)
  const discount = couponDiscount + giftDiscount
  const finalAmount = Math.max(0, baseAmount - discount)

  function handleCouponDiscount(disc: number, _final: number) {
    setCouponDiscount(disc)
  }

  function handleGiftDiscount(disc: number, _final: number) {
    setGiftDiscount(disc)
  }

  return (
    <div className="space-y-4">
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">İndirim</span>
          <span className="font-semibold text-green-600">–{discount} {currency}</span>
        </div>
      )}

      <div className="flex items-center justify-between py-3 border-t">
        <span className="text-gray-700 font-medium">{totalLabel}</span>
        <span className="text-2xl font-bold" style={{ color: '#d4537e' }}>
          {finalAmount} {currency}
        </span>
      </div>

      <CouponInput courseId={courseId} amount={baseAmount} onDiscount={handleCouponDiscount} />
      <GiftCertInput amount={baseAmount} onDiscount={handleGiftDiscount} />

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <PaymentButton
          courseId={courseId}
          userId={userId}
          amount={finalAmount}
          purchaseType={isSubscription ? 'subscription' : 'one_time'}
          plan={plan as 'monthly' | 'yearly' | undefined}
        />
        <Link
          href="/courses"
          className="block text-center text-gray-500 hover:text-pink-600 text-sm mt-2"
        >
          {cancelLabel}
        </Link>
      </div>
    </div>
  )
}

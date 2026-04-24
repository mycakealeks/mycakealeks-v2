'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { formatPrice } from '@/app/lib/currency'
import type { PurchaseType, SubscriptionPlan } from '@/types/payments'

interface PaymentButtonProps {
  courseId?: string
  userId?: string
  amount: number
  currency?: string
  purchaseType?: PurchaseType
  plan?: SubscriptionPlan
  className?: string
}

export default function PaymentButton({
  courseId,
  userId,
  amount,
  purchaseType = 'one_time',
  plan,
  className,
}: PaymentButtonProps) {
  const t = useTranslations('payment')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  // ru locale → YuKassa, all others → Stripe
  const provider = locale === 'ru' ? 'yukassa' : 'stripe'
  // Payment always processed in TRY (base currency)
  const paymentCurrency = process.env.NEXT_PUBLIC_BASE_CURRENCY ?? 'TRY'

  const handlePayment = async () => {
    setLoading(true)
    try {
      const baseUrl = window.location.origin
      const successUrl = `${baseUrl}/${locale}/payment-success`
      const cancelUrl = `${baseUrl}/${locale}/payment-failed`

      if (provider === 'stripe') {
        const res = await fetch('/api/payments/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            userId,
            plan,
            purchaseType,
            amount,
            currency: paymentCurrency,
            successUrl,
            cancelUrl,
          }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
      } else {
        const res = await fetch('/api/payments/yukassa/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            userId,
            plan,
            purchaseType,
            amount,
            currency: paymentCurrency,
            description: courseId ? `Course ${courseId}` : `Subscription ${plan}`,
            returnUrl: successUrl,
          }),
        })
        const data = await res.json()
        if (data.confirmationUrl) window.location.href = data.confirmationUrl
      }
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  const displayPrice = formatPrice(amount, locale)
  const providerLabel = provider === 'yukassa' ? t('viaYukassa') : t('viaStripe')

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className ?? 'w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 transition'}
    >
      {loading ? t('processing') : `${t('pay')} ${displayPrice} · ${providerLabel}`}
    </button>
  )
}

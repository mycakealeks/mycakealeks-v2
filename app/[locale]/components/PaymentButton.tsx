'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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
  currency,
  purchaseType = 'one_time',
  plan,
  className,
}: PaymentButtonProps) {
  const t = useTranslations('payment')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  // ru locale → ЮKassa, all others → Stripe
  const provider = locale === 'ru' ? 'yukassa' : 'stripe'
  const paymentCurrency = currency || process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'TRY'

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

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className ?? 'w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 transition'}
    >
      {loading
        ? t('processing')
        : `${t('pay')} ${amount} ${paymentCurrency} · ${provider === 'yukassa' ? t('viaYukassa') : t('viaStripe')}`}
    </button>
  )
}

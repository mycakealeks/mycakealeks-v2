'use client'

import { useState } from 'react'

interface CouponInputProps {
  courseId?: string
  amount: number
  onDiscount: (discount: number, finalAmount: number) => void
}

export default function CouponInput({ courseId, amount, onDiscount }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [applied, setApplied] = useState(false)

  async function handleApply() {
    if (!code.trim()) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), courseId, amount }),
      })
      const data = await res.json()
      if (data.valid) {
        setMessage({ text: `–${data.discount} TRY`, ok: true })
        setApplied(true)
        onDiscount(data.discount, data.finalAmount)
      } else {
        setMessage({ text: data.message || 'Invalid coupon', ok: false })
      }
    } catch {
      setMessage({ text: 'Connection error', ok: false })
    } finally {
      setLoading(false)
    }
  }

  function handleRemove() {
    setCode('')
    setMessage(null)
    setApplied(false)
    onDiscount(0, amount)
  }

  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Kupon kodu</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="KODU GİR"
          disabled={applied}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase tracking-wider focus:outline-none focus:border-pink-400"
        />
        {applied ? (
          <button
            onClick={handleRemove}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            Kaldır
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white disabled:opacity-50"
            style={{ background: '#d4537e' }}
          >
            {loading ? '...' : 'Uygula'}
          </button>
        )}
      </div>
      {message && (
        <p className="mt-2 text-sm font-semibold" style={{ color: message.ok ? '#16a34a' : '#dc2626' }}>
          {message.ok ? `✓ İndirim uygulandı: ${message.text}` : `✗ ${message.text}`}
        </p>
      )}
    </div>
  )
}

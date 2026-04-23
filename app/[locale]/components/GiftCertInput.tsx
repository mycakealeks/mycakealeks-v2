'use client'

import { useState } from 'react'

interface GiftCertInputProps {
  amount: number
  onDiscount: (discount: number, finalAmount: number) => void
}


export default function GiftCertInput({ amount, onDiscount }: GiftCertInputProps) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)
  const [appliedCode, setAppliedCode] = useState('')
  const [appliedValue, setAppliedValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function applyCode() {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gift/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setError(data.message || 'Invalid certificate')
        return
      }
      const discount = Math.min(data.amount, amount)
      setApplied(true)
      setAppliedCode(code.trim().toUpperCase())
      setAppliedValue(discount)
      onDiscount(discount, Math.max(0, amount - discount))
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  function removeCode() {
    setApplied(false)
    setAppliedCode('')
    setAppliedValue(0)
    setCode('')
    setError('')
    onDiscount(0, amount)
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-sm">
        <span className="text-purple-700 font-medium">🎁 {appliedCode} (–{appliedValue} TRY)</span>
        <button onClick={removeCode} className="text-gray-400 hover:text-gray-600 ml-3">✕</button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
          placeholder="Gift certificate code"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          onKeyDown={e => e.key === 'Enter' && applyCode()}
        />
        <button
          onClick={applyCode}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
          style={{ background: '#7c3aed' }}
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs px-1">{error}</p>}
    </div>
  )
}

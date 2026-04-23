'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

const PRESET_AMOUNTS = [250, 500, 1000]

export default function GiftPage() {
  const t = useTranslations()
  const [amount, setAmount] = useState<number>(500)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<{ code: string } | null>(null)
  const [error, setError] = useState('')

  const finalAmount = isCustom ? Number(customAmount) : amount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!finalAmount || finalAmount < 50) { setError(t('gift.minAmount')); return }
    if (!recipientName.trim() || !recipientEmail.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gift/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: finalAmount, recipientName, recipientEmail, message }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone({ code: data.code })
      } else {
        setError(data.error || 'Error')
      }
    } catch {
      setError(t('register.errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-5">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-12 md:py-16 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#fff 100%)' }}>
        <p className="text-5xl mb-4">🎁</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('gift.title')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('gift.subtitle')}</p>
      </section>

      <div className="max-w-lg mx-auto px-4 py-10">
        {done ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{t('gift.success')}</h2>
            <p className="text-gray-500 mb-6 text-sm">{t('gift.successDesc')}</p>
            <div
              className="rounded-xl p-6 mb-6 text-center"
              style={{ background: 'linear-gradient(135deg,#d4537e,#e8799e)' }}
            >
              <p className="text-white/70 text-xs uppercase tracking-widest mb-1">{t('gift.certCode')}</p>
              <p className="text-white font-extrabold text-3xl tracking-widest">{done.code}</p>
            </div>
            <p className="text-xs text-gray-400 mb-6">{t('gift.emailSent')}</p>
            <Link href="/courses" className="btn-primary px-6 py-3">{t('nav.courses')} →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl mb-5" style={{ background: '#fbeaf0', color: '#b8436c' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('gift.amount')}</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setAmount(a); setIsCustom(false) }}
                      className="px-4 py-2 rounded-xl border text-sm font-bold transition-colors"
                      style={!isCustom && amount === a
                        ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                        : { background: 'white', color: '#374151', borderColor: '#e5e7eb' }}
                    >
                      {a} TRY
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className="px-4 py-2 rounded-xl border text-sm font-bold transition-colors"
                    style={isCustom
                      ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                      : { background: 'white', color: '#374151', borderColor: '#e5e7eb' }}
                  >
                    {t('gift.custom')}
                  </button>
                </div>
                {isCustom && (
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={t('gift.customPlaceholder')}
                    min={50}
                    className="input-field"
                  />
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('gift.recipientName')}</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('gift.recipientEmail')}</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('gift.message')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder={t('gift.messagePlaceholder')}
                />
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: '#fbeaf0' }}>
                <span className="text-sm text-gray-600">{t('gift.total')}</span>
                <span className="text-2xl font-extrabold" style={{ color: '#d4537e' }}>
                  {finalAmount || '—'} TRY
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60"
              >
                {loading ? '...' : `🎁 ${t('gift.send')}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

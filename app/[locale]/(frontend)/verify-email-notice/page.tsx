'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function VerifyEmailNoticePage() {
  const t = useTranslations()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function resend() {
    setSending(true)
    setError('')
    try {
      const meRes = await fetch('/api/users/me', { credentials: 'include' })
      if (!meRes.ok) throw new Error('not logged in')
      const me = await meRes.json()
      const email = me.user?.email || me.email
      if (!email) throw new Error('no email')

      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('send failed')
      setSent(true)
    } catch {
      setError(t('verifyEmail.resendError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff 60%)' }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
        <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-6">
          My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
        </Link>

        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.noticeTitle')}</h1>
        <p className="text-gray-500 text-sm mb-6">{t('verifyEmail.noticeDesc')}</p>

        {sent ? (
          <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
            ✅ {t('verifyEmail.resendSuccess')}
          </p>
        ) : (
          <button
            onClick={resend}
            disabled={sending}
            className="btn-primary w-full justify-center py-3 disabled:opacity-40"
          >
            {sending ? t('verifyEmail.resending') : t('verifyEmail.resendBtn')}
          </button>
        )}

        {error && <p className="mt-3 text-sm" style={{ color: '#ef4444' }}>{error}</p>}

        <p className="mt-6 text-sm text-gray-400">
          <Link href="/logout" className="font-semibold" style={{ color: '#d4537e' }}>
            {t('nav.logout')}
          </Link>
        </p>
      </div>
    </main>
  )
}

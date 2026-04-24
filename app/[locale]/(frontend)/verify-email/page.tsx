'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function VerifyEmailPage() {
  const t = useTranslations()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'invalid'>('loading')

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStatus('success')
          setTimeout(() => {
            window.location.href = `/${locale}/login?verified=1`
          }, 2500)
        } else if (data.error === 'token_expired') {
          setStatus('expired')
        } else {
          setStatus('invalid')
        }
      })
      .catch(() => setStatus('invalid'))
  }, [token, locale])

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff 60%)' }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
        <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-6">
          My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
        </Link>

        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{t('verifyEmail.checking')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.successTitle')}</h1>
            <p className="text-gray-500 text-sm">{t('verifyEmail.successDesc')}</p>
          </>
        )}

        {status === 'expired' && (
          <>
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.expiredTitle')}</h1>
            <p className="text-gray-500 text-sm mb-6">{t('verifyEmail.expiredDesc')}</p>
            <Link href="/register" className="btn-primary inline-flex justify-center px-6 py-3">
              {t('verifyEmail.backToRegister')}
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.invalidTitle')}</h1>
            <p className="text-gray-500 text-sm mb-6">{t('verifyEmail.invalidDesc')}</p>
            <Link href="/register" className="btn-primary inline-flex justify-center px-6 py-3">
              {t('verifyEmail.backToRegister')}
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

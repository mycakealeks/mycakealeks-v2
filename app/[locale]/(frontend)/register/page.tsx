'use client'

import { useState, useEffect } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) localStorage.setItem('referral_code', ref)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Step 1: create user — Payload Users collection uses firstName, not name
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.errors?.[0]?.message || t('register.errorRegistration'))
        return
      }

      // Step 2: auto-login after registration
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        // Fire welcome email (non-blocking)
        fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, firstName }),
        }).catch(() => {})
        // Apply referral code if present
        const refCode = localStorage.getItem('referral_code')
        if (refCode) {
          fetch('/api/referral/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code: refCode }),
          }).catch(() => {})
          localStorage.removeItem('referral_code')
        }
        window.location.href = `/${locale}/dashboard`
      } else {
        router.push('/login' as any)
      }
    } catch {
      setError(t('register.errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: 'linear-gradient(135deg, #fbeaf0 0%, #fff 60%)' }}
    >
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-4">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('register.title')}</h1>
        </div>

        {error && (
          <div
            className="text-sm px-4 py-3 rounded-xl mb-5"
            style={{ background: '#fbeaf0', color: '#b8436c' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.namePlaceholder')}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
              placeholder={t('register.namePlaceholder')}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.emailPlaceholder')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.passwordPlaceholder')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-11"
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.523 13.523M6.343 6.343A9.953 9.953 0 003 12c1.664 4.023 5.634 7 9 7a9.95 9.95 0 005.657-1.757M9 12a3 3 0 013-3m3.536 3.536A9.954 9.954 0 0021 12c-1.664-4.023-5.634-7-9-7a9.95 9.95 0 00-3.657.707" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60"
          >
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('register.hasAccount')}{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#d4537e' }}>
            {t('register.loginLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}

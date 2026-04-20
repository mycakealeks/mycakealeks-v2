'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState(`/${locale}/dashboard`)
  const [showPassword, setShowPassword] = useState(false)

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotDone, setForgotDone] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cb = params.get('callbackUrl')
    if (cb) setCallbackUrl(cb)
  }, [])

  // If already logged in, redirect to dashboard
  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user ?? data?.id) router.push('/dashboard' as any)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = callbackUrl
      } else {
        setError(data.errors?.[0]?.message || data.message || t('login.errorLogin'))
      }
    } catch {
      setError(t('login.errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    try {
      await fetch('/api/email/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, locale }),
      })
      setForgotDone(true)
    } catch {
      // Always show success to not reveal user existence
      setForgotDone(true)
    } finally {
      setForgotLoading(false)
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
          <h1 className="text-2xl font-bold text-gray-900">
            {showForgot ? t('auth.forgotPassword') : t('login.title')}
          </h1>
        </div>

        {/* ── Forgot password panel ── */}
        {showForgot ? (
          forgotDone ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-700 font-semibold mb-2">{t('auth.checkEmail')}</p>
              <p className="text-gray-400 text-sm mb-6">{t('auth.checkEmailDesc')}</p>
              <button
                onClick={() => { setShowForgot(false); setForgotDone(false); setForgotEmail('') }}
                className="text-sm font-semibold"
                style={{ color: '#d4537e' }}
              >
                ← {t('login.title')}
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-5 text-center">{t('auth.forgotPasswordDesc')}</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
                >
                  {forgotLoading ? t('login.loading') : t('auth.sendResetLink')}
                </button>
              </form>
              <button
                onClick={() => setShowForgot(false)}
                className="block text-center text-sm text-gray-400 mt-4 w-full hover:text-gray-600"
              >
                ← {t('login.title')}
              </button>
            </>
          )
        ) : (
          /* ── Login form ── */
          <>
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
                  {t('login.emailLabel')}
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    {t('login.passwordLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-medium hover:underline"
                    style={{ color: '#d4537e' }}
                  >
                    {t('auth.forgotPasswordLink')}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                {loading ? t('login.loading') : t('login.submit')}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {t('login.noAccount')}{' '}
              <Link href="/register" className="font-semibold" style={{ color: '#d4537e' }}>
                {t('login.registerLink')}
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}

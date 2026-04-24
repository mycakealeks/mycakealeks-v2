'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import { signIn } from 'next-auth/react'

// ── Icon helpers ───────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const KeyIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
)

// ── Divider ────────────────────────────────────────────────────────────────────

function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

// ── Social buttons ─────────────────────────────────────────────────────────────

function SocialButtons({ locale, t }: { locale: string; t: any }) {
  const [passkeySupported, setPasskeySupported] = useState(false)
  const [isApple, setIsApple] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [passkeyError, setPasskeyError] = useState('')

  useEffect(() => {
    setPasskeySupported(typeof window !== 'undefined' && !!window.PublicKeyCredential)
    const ua = navigator.userAgent
    setIsApple(/Safari/.test(ua) && !/Chrome/.test(ua) && !/Android/.test(ua))
  }, [])

  const callbackUrl = `/api/auth/sync-payload?redirect=/${locale}/dashboard`

  async function handlePasskey() {
    setPasskeyLoading(true)
    setPasskeyError('')
    try {
      const { startAuthentication } = await import('@simplewebauthn/browser')
      const optRes = await fetch('/api/auth/passkey/auth-options')
      const options = await optRes.json()
      const credential = await startAuthentication(options)
      const verifyRes = await fetch('/api/auth/passkey/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credential),
      })
      const result = await verifyRes.json()
      if (result.ok) {
        window.location.href = `/${locale}/dashboard`
      } else {
        setPasskeyError(result.error || 'Passkey failed')
      }
    } catch (err: any) {
      if (err?.name !== 'NotAllowedError') {
        setPasskeyError('Passkey authentication failed')
      }
    } finally {
      setPasskeyLoading(false)
    }
  }

  return (
    <div className="space-y-2.5 mb-2">
      {/* Google */}
      <button
        onClick={() => signIn('google', { callbackUrl })}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
      >
        <GoogleIcon />
        <span className="flex-1 text-center">{t('auth.continueWithGoogle')}</span>
      </button>

      {/* Apple — only on Safari/iOS */}
      {isApple && (
        <button
          onClick={() => signIn('apple', { callbackUrl })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
        >
          <AppleIcon />
          <span className="flex-1 text-center">{t('auth.continueWithApple')}</span>
        </button>
      )}

      {/* Passkey — only if supported */}
      {passkeySupported && (
        <button
          onClick={handlePasskey}
          disabled={passkeyLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          <KeyIcon />
          <span className="flex-1 text-center">
            {passkeyLoading ? '...' : `🔑 ${t('auth.continueWithPasskey')}`}
          </span>
        </button>
      )}

      {passkeyError && <p className="text-xs text-red-500 text-center">{passkeyError}</p>}
    </div>
  )
}

// ── SMS OTP stub ───────────────────────────────────────────────────────────────

function SmsLoginStub({ t }: { t: any }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
      >
        📱 {t('auth.continueWithSms')}
      </button>
    )
  }

  return (
    <div className="mt-3 p-4 rounded-2xl bg-gray-50 space-y-3">
      {step === 'phone' ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder={t('auth.smsPhonePlaceholder')}
          />
          <button
            onClick={() => setStep('code')}
            disabled={phone.length < 8}
            className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-40"
          >
            {t('auth.smsSend')}
          </button>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-500 text-center">{t('auth.smsComingSoon')}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input-field text-center tracking-[0.5em]"
            placeholder={t('auth.smsCodePlaceholder')}
            maxLength={6}
          />
          <button
            disabled
            className="btn-primary w-full justify-center py-2.5 text-sm opacity-40 cursor-not-allowed"
          >
            {t('auth.smsVerify')}
          </button>
        </>
      )}
      <button onClick={() => { setOpen(false); setStep('phone'); setPhone('') }} className="w-full text-xs text-gray-400 hover:text-gray-600">
        ← Cancel
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

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

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotDone, setForgotDone] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cb = params.get('callbackUrl')
    if (cb) setCallbackUrl(cb)
    if (params.get('verified') === '1') setError('')
  }, [])

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.user ?? data?.id) router.push('/dashboard' as any) })
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
      setForgotDone(true)
    } finally {
      setForgotLoading(false)
    }
  }

  const isVerified = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('verified') === '1'

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

        {isVerified && (
          <div className="text-sm px-4 py-3 rounded-xl mb-5 text-center" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            ✅ {t('verifyEmail.successTitle')} — {t('login.submit')}
          </div>
        )}

        {/* ── Forgot password panel ── */}
        {showForgot ? (
          forgotDone ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-700 font-semibold mb-2">{t('auth.checkEmail')}</p>
              <p className="text-gray-400 text-sm mb-6">{t('auth.checkEmailDesc')}</p>
              <button onClick={() => { setShowForgot(false); setForgotDone(false); setForgotEmail('') }} className="text-sm font-semibold" style={{ color: '#d4537e' }}>
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
                <button type="submit" disabled={forgotLoading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60">
                  {forgotLoading ? t('login.loading') : t('auth.sendResetLink')}
                </button>
              </form>
              <button onClick={() => setShowForgot(false)} className="block text-center text-sm text-gray-400 mt-4 w-full hover:text-gray-600">
                ← {t('login.title')}
              </button>
            </>
          )
        ) : (
          <>
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl mb-5" style={{ background: '#fbeaf0', color: '#b8436c' }}>
                {error}
              </div>
            )}

            {/* Social login */}
            <SocialButtons locale={locale} t={t} />
            <OrDivider label={t('auth.or')} />

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('login.emailLabel')}</label>
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
                  <label className="text-sm font-semibold text-gray-700">{t('login.passwordLabel')}</label>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-xs font-medium hover:underline" style={{ color: '#d4537e' }}>
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
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors" tabIndex={-1}>
                    {showPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.523 13.523M6.343 6.343A9.953 9.953 0 003 12c1.664 4.023 5.634 7 9 7a9.95 9.95 0 005.657-1.757M9 12a3 3 0 013-3m3.536 3.536A9.954 9.954 0 0021 12c-1.664-4.023-5.634-7-9-7a9.95 9.95 0 00-3.657.707" /></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60">
                {loading ? t('login.loading') : t('login.submit')}
              </button>
            </form>

            {/* SMS OTP stub */}
            <div className="mt-4">
              <SmsLoginStub t={t} />
            </div>

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

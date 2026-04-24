'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import { signIn } from 'next-auth/react'

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

function RegisterAppleButton({ locale, label }: { locale: string; label: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ua = navigator.userAgent
    setShow(/Safari/.test(ua) && !/Chrome/.test(ua) && !/Android/.test(ua))
  }, [])
  if (!show) return null
  return (
    <button
      type="button"
      onClick={() => signIn('apple', { callbackUrl: `/api/auth/sync-payload?redirect=/${locale}/dashboard` })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
    >
      <AppleIcon />
      <span className="flex-1 text-center">{label}</span>
    </button>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_RE = /^[\p{L}\s'-]{2,}$/u

type EmailStatus = 'idle' | 'invalid' | 'checking' | 'taken' | 'available'
type PwStrength = 'weak' | 'medium' | 'strong'

function getPasswordStrength(pw: string): PwStrength {
  if (pw.length < 6) return 'weak'
  if (pw.length < 8) return 'medium'
  if (/\d/.test(pw)) return 'strong'
  return 'medium'
}

const EyeOpen = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EyeClosed = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.523 13.523M6.343 6.343A9.953 9.953 0 003 12c1.664 4.023 5.634 7 9 7a9.95 9.95 0 005.657-1.757M9 12a3 3 0 013-3m3.536 3.536A9.954 9.954 0 0021 12c-1.664-4.023-5.634-7-9-7a9.95 9.95 0 00-3.657.707" />
  </svg>
)

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()

  const [firstName, setFirstName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle')

  const [password, setPassword] = useState('')
  const [pwTouched, setPwTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendDone, setResendDone] = useState(false)

  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Save referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) localStorage.setItem('referral_code', ref)
  }, [searchParams])

  // Email uniqueness check (debounced)
  const checkEmailUniqueness = useCallback(async (val: string) => {
    if (!EMAIL_RE.test(val)) return
    setEmailStatus('checking')
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(val)}`)
      const data = await res.json()
      setEmailStatus(data.available ? 'available' : 'taken')
    } catch {
      setEmailStatus('available') // fail open
    }
  }, [])

  function handleEmailBlur() {
    setEmailTouched(true)
    const val = email.trim()
    if (!val) { setEmailStatus('idle'); return }
    if (!EMAIL_RE.test(val)) { setEmailStatus('invalid'); return }
    if (checkTimer.current) clearTimeout(checkTimer.current)
    checkTimer.current = setTimeout(() => checkEmailUniqueness(val), 300)
  }

  function handleEmailChange(val: string) {
    setEmail(val)
    if (emailTouched) {
      const trimmed = val.trim()
      if (!trimmed) { setEmailStatus('idle'); return }
      if (!EMAIL_RE.test(trimmed)) { setEmailStatus('invalid'); return }
      setEmailStatus('idle')
    }
  }

  // Derived
  const nameError = nameTouched && (firstName.trim().length < 2 || !NAME_RE.test(firstName.trim()))
  const pwStrength: PwStrength = password ? getPasswordStrength(password) : 'weak'
  const pwBars = { weak: 1, medium: 2, strong: 3 }[pwStrength]
  const pwColor = { weak: '#ef4444', medium: '#f59e0b', strong: '#22c55e' }[pwStrength]
  const pwLabel = {
    weak: t('validation.passwordWeak'),
    medium: t('validation.passwordMedium'),
    strong: t('validation.passwordStrong'),
  }[pwStrength]

  const emailOk = emailStatus === 'available'
  const nameOk = firstName.trim().length >= 2 && NAME_RE.test(firstName.trim())
  const pwOk = pwStrength === 'strong'
  const canSubmit = nameOk && emailOk && pwOk && !loading

  const handleResend = async () => {
    setResending(true)
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setResendDone(true)
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data?.errors?.[0]?.message || t('register.errorRegistration'))
        return
      }

      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {})

      setEmailSent(true)
    } catch {
      setSubmitError(t('register.errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4 py-12 relative"
        style={{ background: 'linear-gradient(135deg, #fbeaf0 0%, #fff 60%)' }}
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-6">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.title')}</h1>
          <p className="text-gray-500 text-sm mb-6">
            {t('verifyEmail.subtitle', { email: email.trim() })}
          </p>
          {resendDone ? (
            <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
              ✅ {t('verifyEmail.resendSuccess')}
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="btn-primary w-full justify-center py-3 disabled:opacity-40"
            >
              {resending ? t('verifyEmail.resending') : t('verifyEmail.resendBtn')}
            </button>
          )}
          <p className="mt-6 text-sm text-gray-400">
            {t('register.hasAccount')}{' '}
            <Link href="/login" className="font-semibold" style={{ color: '#d4537e' }}>
              {t('register.loginLink')}
            </Link>
          </p>
        </div>
      </main>
    )
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

        {submitError && (
          <div className="text-sm px-4 py-3 rounded-xl mb-5" style={{ background: '#fbeaf0', color: '#b8436c' }}>
            {submitError}
          </div>
        )}

        {/* Social registration */}
        <div className="space-y-2.5 mb-2">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: `/api/auth/sync-payload?redirect=/${locale}/dashboard` })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
          >
            <GoogleIcon />
            <span className="flex-1 text-center">{t('auth.continueWithGoogle')}</span>
          </button>
          <RegisterAppleButton locale={locale} label={t('auth.continueWithApple')} />
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">{t('auth.or')}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.namePlaceholder')}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              className="input-field"
              placeholder={t('register.namePlaceholder')}
              autoComplete="given-name"
              style={nameTouched ? { borderColor: nameError ? '#ef4444' : '#22c55e' } : {}}
            />
            {nameTouched && nameError && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>
                ❌ {t('validation.nameInvalid')}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.emailPlaceholder')}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className="input-field pr-10"
                placeholder="your@email.com"
                autoComplete="email"
                style={emailTouched && emailStatus !== 'idle' && emailStatus !== 'checking'
                  ? { borderColor: emailOk ? '#22c55e' : '#ef4444' }
                  : {}}
              />
              {/* Status icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                {emailStatus === 'checking' && (
                  <div className="w-4 h-4 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
                )}
                {emailStatus === 'available' && (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {(emailStatus === 'invalid' || emailStatus === 'taken') && (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>

            {/* Email feedback */}
            {emailTouched && emailStatus === 'invalid' && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>
                ❌ {t('validation.emailInvalid')}
              </p>
            )}
            {emailTouched && emailStatus === 'taken' && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#ef4444' }}>
                ❌ {t('validation.emailTaken')}
              </p>
            )}
            {emailStatus === 'checking' && (
              <p className="mt-1.5 text-xs text-gray-400">{t('validation.emailChecking')}</p>
            )}
            {emailStatus === 'available' && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: '#22c55e' }}>
                ✅ {t('validation.emailAvailable')}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('register.passwordPlaceholder')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwTouched(true) }}
                onBlur={() => setPwTouched(true)}
                className="input-field pr-11"
                placeholder="••••••••"
                autoComplete="new-password"
                style={pwTouched && password
                  ? { borderColor: pwOk ? pwColor : '#ef4444' }
                  : {}}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>

            {/* Strength bar */}
            {pwTouched && password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{ background: n <= pwBars ? pwColor : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color: pwColor }}>
                  {pwLabel}
                  {pwStrength === 'medium' && (
                    <span className="text-gray-400 font-normal ml-1">
                      — {t('validation.passwordAddDigit')}
                    </span>
                  )}
                  {pwStrength === 'weak' && (
                    <span className="text-gray-400 font-normal ml-1">
                      — {t('auth.passwordTooShort')}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
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

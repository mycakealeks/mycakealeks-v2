'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'

const HINT: Record<string, string> = {
  tr: 'Şifre en az 8 karakter, büyük harf ve rakam içermelidir',
  ru: 'Пароль должен содержать минимум 8 символов, заглавную букву и цифру',
  en: 'Password must contain at least 8 characters, uppercase letter and number',
}

const STRENGTH_LABEL: Record<string, [string, string, string]> = {
  tr: ['Zayıf', 'Orta', 'Güçlü'],
  ru: ['Слабый', 'Средний', 'Сильный'],
  en: ['Weak', 'Medium', 'Strong'],
}

function getStrength(pw: string): 0 | 1 | 2 {
  if (pw.length < 6) return 0
  if (pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return 2
  return 1
}

const STRENGTH_COLOR = ['#ef4444', '#f59e0b', '#16a34a']
const STRENGTH_BG    = ['#fee2e2', '#fef9c3', '#dcfce7']

function StrengthBar({ password, locale }: { password: string; locale: string }) {
  if (!password) return null
  const level = getStrength(password)
  const labels = STRENGTH_LABEL[locale] ?? STRENGTH_LABEL.en
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= level ? STRENGTH_COLOR[level] : '#e5e7eb' }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: STRENGTH_COLOR[level] }}>
        {labels[level]}
      </p>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  showStrength,
  locale,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  showStrength?: boolean
  locale: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pr-10"
          placeholder="••••••••"
          minLength={8}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#d4537e')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
          tabIndex={-1}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {showStrength && <StrengthBar password={value} locale={locale} />}
      {showStrength && (
        <p className="text-xs text-gray-400 mt-1.5">{HINT[locale] ?? HINT.en}</p>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tok = params.get('token') || ''
    if (!tok) setError(t('auth.resetTokenInvalid'))
    setToken(tok)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError(t('profile.passwordMismatch')); return }
    if (password.length < 8) { setError(t('auth.passwordTooShort')); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/email/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      console.log('[reset-password] response:', res.status, data)
      if (res.ok) {
        setDone(true)
      } else {
        setError(data.error || t('auth.resetTokenInvalid'))
      }
    } catch (err) {
      console.error('[reset-password] fetch error:', err)
      setError(t('login.errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #fbeaf0 0%, #fff 60%)' }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-4">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.resetPassword')}</h1>
        </div>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-700 font-semibold mb-6">{t('auth.resetSuccess')}</p>
            <Link href="/login" className="btn-primary px-8 py-3">
              {t('nav.login')}
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl mb-5" style={{ background: '#fbeaf0', color: '#b8436c' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordField
                label={t('profile.newPassword')}
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                showStrength
                locale={locale}
              />
              <PasswordField
                label={t('profile.confirmPassword')}
                value={confirm}
                onChange={setConfirm}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                locale={locale}
              />
              <button
                type="submit"
                disabled={loading || !token}
                className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60"
              >
                {loading ? t('login.loading') : t('auth.resetPassword')}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

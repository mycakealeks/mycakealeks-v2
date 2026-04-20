'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function ResetPasswordPage() {
  const t = useTranslations()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

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
      if (res.ok) {
        setDone(true)
      } else {
        setError(data.error || t('auth.resetTokenInvalid'))
      }
    } catch {
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.newPassword')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('profile.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
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

'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default function LoginPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        setError(data.message || t('login.errorLogin'))
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
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight mb-6">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('login.title')}</h1>
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
              {t('login.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('login.passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60"
          >
            {loading ? '...' : t('login.submit')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('login.noAccount')}{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#d4537e' }}>
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}

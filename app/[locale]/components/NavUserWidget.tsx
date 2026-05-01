'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface User {
  firstName?: string
  email?: string
}

export default function NavUserWidget() {
  const t = useTranslations()
  const locale = useLocale()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUser(data?.user ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } finally {
      window.location.href = locale === 'tr' ? '/' : `/${locale}`
    }
  }

  if (loading) {
    return <div className="hidden md:block w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
  }

  if (!user) {
    return (
      <>
        <Link href="/login" className="hidden md:inline-flex btn-outline text-sm py-2 px-4">
          {t('nav.login')}
        </Link>
        <Link href="/register" className="hidden md:inline-flex btn-primary text-sm py-2 px-4">
          {t('nav.start')}
        </Link>
      </>
    )
  }

  const initial = (user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()
  const displayName = user.firstName || user.email?.split('@')[0] || ''

  return (
    <div ref={dropdownRef} className="hidden md:flex items-center gap-2 relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pr-2 pl-0.5 py-0.5 hover:bg-pink-50 transition-colors"
        aria-label="User menu"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: '#d4537e' }}
        >
          {initial}
        </div>
        <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{displayName}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
          style={{ minWidth: 180 }}
        >
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>🏠</span>
            <span>{t('nav.dashboard')}</span>
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>👤</span>
            <span>{t('profile.title')}</span>
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left hover:bg-gray-50 transition-colors"
            style={{ color: '#d4537e' }}
          >
            <span>🚪</span>
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

interface AuthUser {
  firstName?: string
  email?: string
}

const LOCALES = ['tr', 'ru', 'en'] as const

function setPreferredLocale(loc: string) {
  document.cookie = `preferred-locale=${loc}; path=/; max-age=31536000; samesite=lax`
}

function MobileLangSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="md:hidden flex items-center gap-0">
      {LOCALES.map((loc, i) => (
        <span key={loc} className="flex items-center">
          <a
            href={`/${loc}${pathname === '/' ? '' : pathname}`}
            onClick={() => setPreferredLocale(loc)}
            style={{
              fontSize: 12,
              fontWeight: locale === loc ? 700 : 400,
              color: locale === loc ? '#d4537e' : '#9ca3af',
              textDecoration: 'none',
              padding: '2px 4px',
            }}
          >
            {loc.toUpperCase()}
          </a>
          {i < LOCALES.length - 1 && (
            <span style={{ color: '#d1d5db', fontSize: 11, userSelect: 'none' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function MobileMenu() {
  const t = useTranslations()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleOrientationChange = () => setOpen(false)
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  const close = useCallback(() => setOpen(false), [])

  const handleLogout = async () => {
    close()
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } finally {
      window.location.href = locale === 'tr' ? '/' : `/${locale}`
    }
  }

  const portal = mounted ? createPortal(
    <>
      {/* Overlay — z-index 200, below drawer */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          cursor: 'pointer',
        }}
      />

      {/* Drawer — z-index 201, above overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          maxHeight: '100dvh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 9999 }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderBottom: '1px solid #f3f4f6',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </span>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              width: 44, height: 44, display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: 12, border: 'none',
              background: 'transparent', cursor: 'pointer', color: '#9ca3af',
            }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '8px 16px' }}>
          {([
            { href: '/courses', emoji: '📚', label: t('nav.courses') },
            { href: '/news', emoji: '📰', label: t('nav.news') },
            { href: '/recipes', emoji: '🍰', label: t('nav.recipes') },
            { href: '/pricing', emoji: '💎', label: t('nav.pricing') },
            { href: '/about', emoji: '👩‍🍳', label: t('nav.about') },
            { href: '/search', emoji: '🔍', label: t('nav.search') },
            { href: '/faq', emoji: '❓', label: t('nav.faq') },
            { href: '/dashboard', emoji: '📊', label: t('nav.dashboard') },
          ] as const).map((item, idx, arr) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 4px',
                color: '#374151', fontWeight: 500, fontSize: 16,
                textDecoration: 'none',
                borderBottom: idx < arr.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              <span style={{ fontSize: 20, width: 32, display: 'inline-block' }}>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth section */}
        {user ? (
          <div style={{ padding: '12px 16px 8px' }}>
            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0 14px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: '#d4537e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 17, flexShrink: 0,
              }}>
                {(user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                  {user.firstName || user.email?.split('@')[0]}
                </div>
                {user.email && <div style={{ fontSize: 12, color: '#9ca3af' }}>{user.email}</div>}
              </div>
            </div>
            {/* User actions */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
              <Link
                href="/dashboard"
                onClick={close}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 44, borderRadius: 10, border: 'none',
                  background: '#d4537e', color: '#fff', fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', cursor: 'pointer', pointerEvents: 'auto', gap: 6,
                }}
              >
                🏠 {t('nav.dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 44, borderRadius: 10, border: '1.5px solid #f3f4f6',
                  color: '#d4537e', fontWeight: 600, fontSize: 14,
                  background: 'transparent', cursor: 'pointer', pointerEvents: 'auto', gap: 6,
                }}
              >
                🚪 {t('nav.logout')}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, padding: '12px 16px 8px' }}>
            <Link
              href="/login"
              onClick={close}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 48, borderRadius: 10, border: '1.5px solid #d4537e',
                color: '#d4537e', fontWeight: 600, fontSize: 15,
                textDecoration: 'none', cursor: 'pointer', pointerEvents: 'auto',
              }}
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/register"
              onClick={close}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 48, borderRadius: 10, border: 'none',
                background: '#d4537e', color: '#fff', fontWeight: 600, fontSize: 15,
                textDecoration: 'none', cursor: 'pointer', pointerEvents: 'auto',
              }}
            >
              {t('nav.start')}
            </Link>
          </div>
        )}

        {/* Language switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 16px 4px' }}>
          <LanguageSwitcher />
        </div>
      </div>
    </>,
    document.body
  ) : null

  return (
    <>
      <MobileLangSwitcher />
      {/* Hamburger button — stays in the nav */}
      <button
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {portal}
    </>
  )
}

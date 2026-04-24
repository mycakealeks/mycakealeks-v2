'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function MobileMenu() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

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
          {[
            { href: '/courses', emoji: '📚', label: t('nav.courses') },
            { href: '/news', emoji: '📰', label: t('nav.news') },
            { href: '/recipes', emoji: '🍰', label: t('nav.recipes') },
            { href: '/pricing', emoji: '💎', label: t('nav.pricing') },
            { href: '/about', emoji: '👩‍🍳', label: t('nav.about') },
            { href: '/search', emoji: '🔍', label: t('nav.search') },
            { href: '/faq', emoji: '❓', label: t('nav.faq') },
            { href: '/dashboard', emoji: '📊', label: t('nav.dashboard') },
          ].map((item, idx, arr) => (
            <a
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
            </a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: 12, padding: '12px 16px 8px' }}>
          <a
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
          </a>
          <a
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
          </a>
        </div>

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

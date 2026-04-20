'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function MobileMenu() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[45] md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Bottom sheet drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl md:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        }`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-lg font-extrabold">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </span>
          <button
            onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-4 py-2">
          {[
            { href: '/courses' as const, emoji: '📚', label: t('nav.courses') },
            { href: '/news' as const, emoji: '📰', label: t('nav.news') },
            { href: '/recipes' as const, emoji: '🍰', label: t('nav.recipes') },
            { href: '/dashboard' as const, emoji: '📊', label: t('nav.dashboard') },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="flex items-center gap-3 py-3.5 px-1 text-gray-700 font-medium text-base border-b border-gray-100 last:border-0 active:bg-gray-50 rounded-xl"
            >
              <span className="text-xl w-8">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="px-4 pt-2 pb-2 flex gap-3">
          <Link href="/login" onClick={close} className="btn-outline flex-1 justify-center py-3 text-base">
            {t('nav.login')}
          </Link>
          <Link href="/register" onClick={close} className="btn-primary flex-1 justify-center py-3 text-base">
            {t('nav.start')}
          </Link>
        </div>

        {/* Language switcher */}
        <div className="px-4 pt-2 pb-1 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  )
}

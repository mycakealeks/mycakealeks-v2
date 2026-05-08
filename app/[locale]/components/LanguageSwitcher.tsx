'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

const locales = ['tr', 'ru', 'en'] as const

function setPreferredLocale(loc: string) {
  document.cookie = `preferred-locale=${loc}; path=/; max-age=31536000; samesite=lax`
}

function buildHref(targetLocale: string, pathname: string) {
  if (targetLocale === 'tr') return pathname
  return `/${targetLocale}${pathname === '/' ? '' : pathname}`
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
      {locales.map((loc) => (
        <a
          key={loc}
          href={buildHref(loc, pathname)}
          onClick={() => setPreferredLocale(loc)}
          className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
            locale === loc
              ? 'bg-pink-600 text-white'
              : 'text-gray-500 hover:text-pink-600'
          }`}
        >
          {loc.toUpperCase()}
        </a>
      ))}
    </div>
  )
}

export function MobileLanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold"
        style={{ color: '#d4537e', background: '#fbeaf0' }}
      >
        {locale.toUpperCase()}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
          style={{ minWidth: 72 }}
        >
          {locales.map((loc) => (
            <a
              key={loc}
              href={buildHref(loc, pathname)}
              onClick={() => { setPreferredLocale(loc); setOpen(false) }}
              className="block px-4 py-2 text-xs font-semibold transition-colors"
              style={locale === loc ? { color: '#d4537e', background: '#fbeaf0' } : { color: '#374151' }}
            >
              {loc.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

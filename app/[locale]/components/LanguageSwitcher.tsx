'use client'

import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

const locales = ['tr', 'ru', 'en'] as const

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  function buildHref(targetLocale: string) {
    return `/${targetLocale}${pathname === '/' ? '' : pathname}`
  }

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
      {locales.map((loc) => (
        <a
          key={loc}
          href={buildHref(loc)}
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

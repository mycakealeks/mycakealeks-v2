'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

const navItems = [
  {
    key: 'dashboard',
    href: '/dashboard' as const,
    label: 'Dashboard',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'myCourses',
    href: '/my-courses' as const,
    label: 'Courses',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: 'ai',
    href: '/dashboard' as const,
    label: 'AI',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    key: 'profile',
    href: '/profile' as const,
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const t = useTranslations()
  const pathname = usePathname()

  const labels: Record<string, string> = {
    dashboard: t('dashboard.title'),
    myCourses: t('dashboard.myCourses'),
    ai: 'AI',
    profile: t('profile.title'),
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } finally {
      window.location.href = '/'
    }
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex items-stretch"
      style={{
        borderColor: '#f0e0e8',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors"
            style={{ color: isActive ? '#d4537e' : '#9ca3af' }}
          >
            {item.icon(isActive)}
            <span className="text-[10px] font-semibold leading-none">{labels[item.key]}</span>
          </Link>
        )
      })}

      {/* Logout tab */}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors text-gray-400 hover:text-gray-600"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-[10px] font-semibold leading-none">{t('nav.logout')}</span>
      </button>
    </nav>
  )
}

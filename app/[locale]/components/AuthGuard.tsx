'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

interface AuthGuardProps {
  children: (user: any) => React.ReactNode
}

const LOADING_LABEL: Record<string, string> = { tr: 'Yükleniyor...', ru: 'Загрузка...', en: 'Loading...' }

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading')
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const u = data.user ?? null
        if (!u) throw new Error('no user')
        setUser(u)
        setStatus('ok')
      })
      .catch(() => {
        setStatus('denied')
        const callbackUrl = window.location.pathname + window.location.search
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}` as any)
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">{LOADING_LABEL[locale] ?? 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (status === 'denied') return null

  return <>{children(user)}</>
}

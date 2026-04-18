'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'

interface AuthGuardProps {
  children: (user: any) => React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setUser(data.user ?? data)
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
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'denied') return null

  return <>{children(user)}</>
}

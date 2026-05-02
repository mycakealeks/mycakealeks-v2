'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

const LABELS: Record<string, { subscribe: string; subscribed: string; denied: string; unsupported: string }> = {
  tr: {
    subscribe: '🔔 Bildirimlere abone ol',
    subscribed: '✓ Bildirimler açık',
    denied: 'Bildirimler engellendi',
    unsupported: 'Desteklenmiyor',
  },
  ru: {
    subscribe: '🔔 Включить уведомления',
    subscribed: '✓ Уведомления включены',
    denied: 'Уведомления заблокированы',
    unsupported: 'Не поддерживается',
  },
  en: {
    subscribe: '🔔 Enable notifications',
    subscribed: '✓ Notifications enabled',
    denied: 'Notifications blocked',
    unsupported: 'Not supported',
  },
}

export default function PushNotificationButton() {
  const locale = useLocale()
  const labels = LABELS[locale] ?? LABELS.tr
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'loading' | 'unsupported'>('idle')

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'granted') setStatus('subscribed')
    else if (Notification.permission === 'denied') setStatus('denied')
  }, [])

  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return
    setStatus('loading')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription: sub.toJSON(), locale }),
      })
      setStatus('subscribed')
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'unsupported') return null
  if (status === 'denied') {
    return (
      <p className="text-xs text-gray-400">{labels.denied}</p>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={status === 'subscribed' || status === 'loading'}
      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors disabled:opacity-60"
      style={
        status === 'subscribed'
          ? { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
          : { background: '#fbeaf0', color: '#d4537e', borderColor: '#f0d0dc', cursor: 'pointer' }
      }
    >
      {status === 'loading' ? (
        <span className="w-4 h-4 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      ) : null}
      {status === 'subscribed' ? labels.subscribed : status === 'loading' ? '...' : labels.subscribe}
    </button>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

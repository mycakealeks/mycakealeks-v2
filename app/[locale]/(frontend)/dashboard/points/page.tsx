'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Sidebar from '@/app/[locale]/components/Sidebar'
import BottomNav from '@/app/[locale]/components/BottomNav'
import AuthGuard from '@/app/[locale]/components/AuthGuard'

interface PointsEntry {
  id: string
  points: number
  type: 'earned' | 'spent'
  reason: string
  createdAt: string
}

function PointsContent({ user }: { user: any }) {
  const t = useTranslations()
  const [balance, setBalance] = useState<number | null>(null)
  const [history, setHistory] = useState<PointsEntry[]>([])
  const [loading, setLoading] = useState(true)

  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  useEffect(() => {
    Promise.all([
      fetch('/api/points/balance').then((r) => r.json()),
      fetch('/api/points/history').then((r) => r.json()),
    ])
      .then(([balData, histData]) => {
        setBalance(balData.balance ?? 0)
        setHistory(histData.history ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const REASON_LABELS: Record<string, string> = {
    course_purchase: '🎂',
    recipe_purchase: '🍰',
    referral: '👥',
    promotion: '🎁',
    bonus: '⭐',
    spend: '💳',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user.email} />
      <BottomNav />

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
              ← {t('dashboard.title')}
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('points.title')}</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Balance card */}
              <div
                className="rounded-2xl p-6 mb-8 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff5f8 100%)', border: '1.5px solid #f0d0dc' }}
              >
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('points.balance')}</p>
                  <p className="text-5xl font-extrabold" style={{ color: '#d4537e' }}>{balance ?? 0}</p>
                  <p className="text-xs text-gray-400 mt-2">{t('points.spendDesc')}</p>
                </div>
                <span className="text-6xl">⭐</span>
              </div>

              {/* History */}
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('points.history')}</h2>

              {history.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">⭐</p>
                  <p>{t('points.noHistory')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl w-9">{REASON_LABELS[entry.reason] ?? '⭐'}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{entry.reason.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-lg font-extrabold"
                        style={{ color: entry.type === 'earned' ? '#d4537e' : '#6b7280' }}
                      >
                        {entry.type === 'earned' ? '+' : '-'}{entry.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function PointsPage() {
  return <AuthGuard>{(user) => <PointsContent user={user} />}</AuthGuard>
}

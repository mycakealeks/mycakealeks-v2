'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/app/lib/currency'

interface Rec {
  courseId: string
  reason: string
  course: {
    id: string | number
    title: string
    slug: string
    description?: string
    price: number
    emoji?: string
  }
}

const TITLES: Record<string, string> = {
  tr: 'Sizin için seçtik',
  ru: 'Для вас',
  en: 'Recommended for you',
}
const AI_LABEL: Record<string, string> = {
  tr: 'AI Öneri',
  ru: 'AI рекомендует',
  en: 'AI Pick',
}

export default function RecommendedCourses({
  courseId,
}: {
  courseId?: string
}) {
  const locale = useLocale()
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get userId from /api/users/me (payload built-in endpoint, uses httpOnly cookie)
    async function load() {
      let userId: string | undefined
      try {
        const meRes = await fetch('/api/users/me')
        if (meRes.ok) {
          const me = await meRes.json()
          userId = me?.user?.id ? String(me.user.id) : undefined
        }
      } catch { /* anonymous user */ }

      const params = new URLSearchParams({ limit: '3' })
      if (userId) params.set('userId', userId)
      if (courseId) params.set('courseId', courseId)

      try {
        const res = await fetch(`/api/recommendations?${params}`)
        const data = await res.json()
        setRecs(data.recommendations ?? [])
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (recs.length === 0) return null

  const title = TITLES[locale] ?? TITLES.en
  const aiLabel = AI_LABEL[locale] ?? AI_LABEL.en

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        ✨ {title}
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {recs.map((rec) => (
          <Link
            key={rec.courseId}
            href={`/courses/${rec.course.slug}` as any}
            className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-pink-200 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{rec.course.emoji ?? '🎂'}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#fbeaf0', color: '#d4537e' }}
              >
                {aiLabel}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{rec.course.title}</h3>
            {rec.reason && (
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{rec.reason}</p>
            )}
            <p className="text-sm font-bold" style={{ color: '#d4537e' }}>
              {formatPrice(rec.course.price, locale)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

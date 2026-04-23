'use client'

import { useEffect, useState } from 'react'

interface Review {
  id: string
  user: { firstName?: string; lastName?: string; email: string } | string
  rating: number
  text: string
  createdAt: string
}

interface Props {
  courseId: string
  reviewsLabel: string
  ratingLabel: string
  writeLabel: string
  submitLabel: string
  mustPurchaseLabel: string
  loginLabel: string
  alreadyReviewedLabel: string
  pendingLabel: string
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <span
            style={{
              fontSize: interactive ? 24 : 16,
              color: i <= (hovered || rating) ? '#f59e0b' : '#d1d5db',
            }}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  )
}

export default function CourseReviews({
  courseId,
  reviewsLabel,
  ratingLabel,
  writeLabel,
  submitLabel,
  mustPurchaseLabel,
  loginLabel,
  alreadyReviewedLabel,
  pendingLabel,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [authState, setAuthState] = useState<'loading' | 'guest' | 'no-purchase' | 'can-review' | 'reviewed'>('loading')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?courseId=${courseId}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Check auth + purchase status
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { setAuthState('guest'); return }
        const purchased: any[] = d.user.purchasedCourses || []
        const has = purchased.some((c: any) => (typeof c === 'object' ? c.id : c) === courseId)
        if (!has) { setAuthState('no-purchase'); return }
        setAuthState('can-review')
      })
      .catch(() => setAuthState('guest'))
  }, [courseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId, rating, text }),
      })
      if (res.status === 409) { setAuthState('reviewed'); return }
      if (res.ok) {
        setSubmitted(true)
        setText('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{reviewsLabel}</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avg)} />
            <span className="font-bold text-gray-900">{avg}</span>
            <span className="text-sm text-gray-400">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review form */}
      {authState === 'can-review' && !submitted && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-3 text-sm">{writeLabel}</p>
          <div className="mb-3">
            <Stars rating={rating} interactive onRate={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-400 mb-3"
            placeholder="..."
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white disabled:opacity-60"
            style={{ background: '#d4537e' }}
          >
            {submitting ? '...' : submitLabel}
          </button>
        </form>
      )}
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700 font-semibold">
          ✓ {pendingLabel}
        </div>
      )}
      {authState === 'reviewed' && (
        <p className="mb-4 text-sm text-gray-400">{alreadyReviewedLabel}</p>
      )}
      {authState === 'no-purchase' && (
        <p className="mb-4 text-sm text-gray-400">{mustPurchaseLabel}</p>
      )}
      {authState === 'guest' && (
        <p className="mb-4 text-sm text-gray-400">{loginLabel}</p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">—</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => {
            const u = typeof r.user === 'object' ? r.user : { email: String(r.user) }
            const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email
            const initials = name.slice(0, 2).toUpperCase()
            return (
              <div key={r.id} className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: '#d4537e' }}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{name}</span>
                    <Stars rating={r.rating} />
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

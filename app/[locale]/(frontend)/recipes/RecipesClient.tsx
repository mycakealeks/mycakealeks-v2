'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

type Difficulty = 'easy' | 'medium' | 'hard'
type Category = 'all' | 'cake' | 'cream' | 'decoration' | 'dough' | 'other'

const DIFF_COLOR: Record<Difficulty, { bg: string; color: string }> = {
  easy:   { bg: '#f0fdf4', color: '#16a34a' },
  medium: { bg: '#fefce8', color: '#ca8a04' },
  hard:   { bg: '#fef2f2', color: '#dc2626' },
}

export default function RecipesClient({ recipes, t }: { recipes: any[]; t: Record<string, string> }) {
  const [category, setCategory] = useState<Category>('all')
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all')

  const diffLabel: Record<string, string> = {
    easy: t.diffEasy,
    medium: t.diffMedium,
    hard: t.diffHard,
  }

  const catLabels: Record<string, string> = {
    all: t.catAll,
    cake: t.catCake,
    cream: t.catCream,
    decoration: t.catDecoration,
    dough: t.catDough,
    other: t.catOther,
  }

  const filtered = recipes.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (difficulty !== 'all' && r.difficulty !== difficulty) return false
    return true
  })

  const pillStyle = (active: boolean) =>
    active
      ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
      : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'cake', 'cream', 'decoration', 'dough', 'other'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="text-sm px-3 py-1.5 rounded-full border font-semibold transition-colors"
            style={pillStyle(category === c)}
          >
            {catLabels[c]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className="text-sm px-3 py-1.5 rounded-full border font-semibold transition-colors"
            style={pillStyle(difficulty === d)}
          >
            {d === 'all' ? t.filterAll : diffLabel[d]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">🔍</p>
          <p>{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((r) => {
            const diff = r.difficulty as Difficulty
            const ds = diff ? DIFF_COLOR[diff] : null
            return (
              <Link
                key={r.id}
                href={`/recipes/${r.slug}` as any}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover flex flex-col"
              >
                {/* Emoji hero */}
                <div
                  className="h-36 flex items-center justify-center text-7xl"
                  style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff 100%)' }}
                >
                  {r.coverEmoji || '🎂'}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {diff && ds && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={ds}>
                        {diffLabel[diff]}
                      </span>
                    )}
                    {r.prepTime && (
                      <span className="text-xs text-gray-400">⏱ {r.prepTime} {t.min}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 flex-1">{r.title}</h3>
                  {r.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{r.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    {r.isFree ? (
                      <span className="text-sm font-bold" style={{ color: '#16a34a' }}>✓ {t.free}</span>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: '#d4537e' }}>{r.price} TRY</span>
                    )}
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#fbeaf0', color: '#d4537e' }}>
                      {r.isFree ? t.filterAll : t.buy} →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

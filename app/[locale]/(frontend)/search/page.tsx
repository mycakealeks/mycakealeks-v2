'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

type ResultType = 'course' | 'news' | 'recipe' | 'lesson'

interface SearchResult {
  type: ResultType
  id: string
  title: string
  slug: string
  excerpt?: string
  emoji?: string
  courseSlug?: string | null
  courseTitle?: string | null
  duration?: number | null
}

const TYPE_LABELS: Record<string, Record<ResultType, string>> = {
  tr: { course: 'Kurs', news: 'Haber', recipe: 'Tarif', lesson: 'Ders' },
  ru: { course: 'Курс', news: 'Новость', recipe: 'Рецепт', lesson: 'Урок' },
  en: { course: 'Course', news: 'News', recipe: 'Recipe', lesson: 'Lesson' },
}

function resultHref(item: SearchResult): string {
  if (item.type === 'course') return `/courses/${item.slug}`
  if (item.type === 'news') return `/news/${item.slug}`
  if (item.type === 'recipe') return `/recipes/${item.slug}`
  if (item.type === 'lesson' && item.courseSlug) {
    return `/courses/${item.courseSlug}/lessons/${item.id}`
  }
  return '/courses'
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function SearchPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<ResultType | 'all'>('all')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typeLabels = TYPE_LABELS[locale] ?? TYPE_LABELS.en

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim() || query.length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [query])

  const filtered = filter === 'all' ? results : results.filter((r) => r.type === filter)
  const filterTypes: Array<ResultType | 'all'> = ['all', 'course', 'lesson', 'news', 'recipe']

  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/news" className="nav-link text-sm">{t('nav.news')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{t('search.title')}</h1>

        {/* Search input */}
        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="input-field pl-12"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
          )}
        </div>

        {/* Filters */}
        {results.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {filterTypes.map((f) => {
              const count = f === 'all' ? results.length : results.filter((r) => r.type === f).length
              if (f !== 'all' && count === 0) return null
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-sm px-3 py-1.5 rounded-full border font-semibold transition-colors"
                  style={filter === f
                    ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                    : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}
                >
                  {f === 'all' ? t('search.filterAll') : typeLabels[f]}
                  {` (${count})`}
                </button>
              )
            })}
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && !loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400">{t('search.noResults')}</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={resultHref(item) as any}
              className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-pink-200 hover:bg-pink-50 transition-colors group"
            >
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#fbeaf0', color: '#d4537e' }}
                  >
                    {typeLabels[item.type]}
                  </span>
                  {item.type === 'lesson' && item.courseTitle && (
                    <span className="text-xs text-gray-400">{item.courseTitle}</span>
                  )}
                  {item.type === 'lesson' && item.duration && (
                    <span className="text-xs text-gray-400">⏱ {formatDuration(item.duration)}</span>
                  )}
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors truncate">
                  {item.title}
                </p>
                {item.excerpt && item.type !== 'lesson' && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

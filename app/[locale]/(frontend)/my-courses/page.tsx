'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Sidebar from '@/app/[locale]/components/Sidebar'

type FilterType = 'all' | 'inProgress' | 'completed'

interface CourseCard {
  courseId: string
  title: string
  slug: string
  totalLessons: number
  completedLessons: number
  nextLessonId?: string
  pct: number
}

export default function MyCoursesPage() {
  const t = useTranslations()
  const [user, setUser] = useState<any>(null)
  const [cards, setCards] = useState<CourseCard[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch('/api/users/me', { credentials: 'include' })
        if (!meRes.ok) { window.location.href = '/login'; return }
        const meData = await meRes.json()
        const userData = meData.user ?? meData
        setUser(userData)

        const courses: any[] = userData.purchasedCourses || []
        if (courses.length === 0) { setLoading(false); return }

        const result: CourseCard[] = await Promise.all(
          courses.map(async (course: any) => {
            const courseId = typeof course === 'object' ? course.id : course
            const courseTitle = typeof course === 'object' ? (course.title ?? '') : ''
            const courseSlug = typeof course === 'object' ? (course.slug ?? course.id) : course

            const [lessonsRes, progressRes] = await Promise.all([
              fetch(`/api/lessons?where[course][equals]=${courseId}&limit=100`),
              fetch(`/api/progress?userId=${userData.id}&courseId=${courseId}`),
            ])
            const lessonsData = await lessonsRes.json()
            const progressData = await progressRes.json()

            const totalLessons = lessonsData.docs?.length ?? 0
            const completedIds = new Set(
              (progressData.docs ?? [])
                .filter((p: any) => p.completed)
                .map((p: any) => (typeof p.lesson === 'object' ? p.lesson.id : p.lesson))
            )
            const completedLessons = completedIds.size

            const sorted = (lessonsData.docs ?? []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            const nextLesson = sorted.find((l: any) => !completedIds.has(l.id))

            return {
              courseId,
              title: courseTitle,
              slug: courseSlug,
              totalLessons,
              completedLessons,
              nextLessonId: nextLesson?.id,
              pct: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
            }
          })
        )
        setCards(result)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = cards.filter((c) => {
    if (filter === 'completed') return c.pct === 100
    if (filter === 'inProgress') return c.pct > 0 && c.pct < 100
    return true
  })

  const userName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : ''

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user?.email} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{t('myCourses.title')}</h1>

          {/* Filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {([
              ['all', t('myCourses.filterAll')],
              ['inProgress', t('myCourses.filterInProgress')],
              ['completed', t('myCourses.filterCompleted')],
            ] as [FilterType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
                style={
                  filter === key
                    ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                    : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-5xl mb-3">🎂</p>
              <p className="text-gray-500 mb-5">{t('myCourses.empty')}</p>
              <Link href="/courses" className="btn-primary px-6 py-2.5 text-sm">
                {t('myCourses.browseBtn')}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((c) => (
                <div key={c.courseId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
                  <div
                    className="h-36 flex items-center justify-center text-6xl"
                    style={{ background: '#fbeaf0' }}
                  >
                    🎂
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-gray-900 text-base leading-snug">{c.title}</h3>
                      {c.pct === 100 && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                          style={{ background: '#dcfce7', color: '#16a34a' }}
                        >
                          ✓ {t('dashboard.completed')}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>
                          {t('myCourses.lessonsCount', {
                            completed: c.completedLessons,
                            total: c.totalLessons,
                          })}
                        </span>
                        <span>{c.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.pct}%`, background: c.pct === 100 ? '#16a34a' : '#d4537e' }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {c.pct === 100 ? (
                        <>
                          <Link
                            href={`/courses/${c.slug}` as any}
                            className="text-sm font-semibold px-4 py-2 rounded-lg border"
                            style={{ borderColor: '#d4537e', color: '#d4537e' }}
                          >
                            {t('myCourses.viewBtn')}
                          </Link>
                          <button
                            className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ background: '#fbeaf0', color: '#d4537e' }}
                          >
                            🏆 {t('myCourses.certificate')}
                          </button>
                        </>
                      ) : c.nextLessonId ? (
                        <Link
                          href={`/courses/${c.slug}/lessons/${c.nextLessonId}` as any}
                          className="btn-primary text-sm py-2 px-5"
                        >
                          {c.pct === 0 ? t('myCourses.startBtn') : t('myCourses.continueBtn')} →
                        </Link>
                      ) : (
                        <Link
                          href={`/courses/${c.slug}` as any}
                          className="btn-primary text-sm py-2 px-5"
                        >
                          {t('myCourses.viewBtn')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

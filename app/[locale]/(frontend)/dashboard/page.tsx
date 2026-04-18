'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Sidebar from '@/app/[locale]/components/Sidebar'
import AiChat from '@/app/[locale]/components/AiChat'

interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  purchasedCourses?: any[]
}

interface CourseProgress {
  courseId: string
  title: string
  emoji: string
  totalLessons: number
  completedLessons: number
  lastLessonId?: string
  lastLessonTitle?: string
  slug?: string
}

export default function DashboardPage() {
  const t = useTranslations()
  const [user, setUser] = useState<User | null>(null)
  const [courseProgresses, setCourseProgresses] = useState<CourseProgress[]>([])
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

        const progresses: CourseProgress[] = await Promise.all(
          courses.map(async (course: any) => {
            const courseId = typeof course === 'object' ? course.id : course
            const courseTitle = typeof course === 'object' ? course.title : ''

            const [lessonsRes, progressRes] = await Promise.all([
              fetch(`/api/lessons?where[course][equals]=${courseId}&limit=100`),
              fetch(`/api/progress?userId=${userData.id}&courseId=${courseId}`),
            ])
            const lessonsData = await lessonsRes.json()
            const progressData = await progressRes.json()

            const totalLessons = lessonsData.docs?.length ?? 0
            const completedLessons = (progressData.docs ?? []).filter((p: any) => p.completed).length

            const sorted = (lessonsData.docs ?? []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            const completedIds = new Set((progressData.docs ?? []).filter((p: any) => p.completed).map((p: any) => {
              return typeof p.lesson === 'object' ? p.lesson.id : p.lesson
            }))
            const nextLesson = sorted.find((l: any) => !completedIds.has(l.id))

            return {
              courseId,
              title: courseTitle,
              emoji: '🎂',
              totalLessons,
              completedLessons,
              lastLessonId: nextLesson?.id,
              lastLessonTitle: nextLesson?.title,
              slug: typeof course === 'object' ? course.slug ?? course.id : course,
            }
          })
        )
        setCourseProgresses(progresses)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const userName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : ''
  const totalCompleted = courseProgresses.reduce((s, c) => s + c.completedLessons, 0)
  const totalHours = Math.round(totalCompleted * 0.25)
  const certs = courseProgresses.filter(c => c.totalLessons > 0 && c.completedLessons >= c.totalLessons).length

  const continueTarget = courseProgresses.find(c => c.lastLessonId && c.completedLessons < c.totalLessons)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user?.email} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium" style={{ color: '#d4537e' }}>
              {t('dashboard.welcomeBack')} 👋
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
              {userName || t('dashboard.welcome')}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: courseProgresses.length, label: t('dashboard.statCourses'), icon: '🎂' },
              { value: totalCompleted, label: t('dashboard.statLessons'), icon: '✅' },
              { value: totalHours, label: t('dashboard.statHours'), icon: '⏱' },
              { value: certs, label: t('dashboard.statCerts'), icon: '🏆' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-2xl mb-2">{s.icon}</p>
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Continue learning */}
          {continueTarget && (
            <div
              className="rounded-2xl p-6 mb-10 flex items-center justify-between gap-4"
              style={{ background: 'linear-gradient(135deg, #fbeaf0 0%, #fff 100%)', border: '1.5px solid #f0d0dc' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#d4537e' }}>
                  {t('dashboard.continueLearning')}
                </p>
                <h2 className="text-lg font-bold text-gray-900 mt-1">{continueTarget.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t('dashboard.lastLesson')}: {continueTarget.lastLessonTitle}
                </p>
              </div>
              <Link
                href={`/courses/${continueTarget.slug}/lessons/${continueTarget.lastLessonId}` as any}
                className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm"
              >
                {t('dashboard.continueBtn')} →
              </Link>
            </div>
          )}

          {/* My courses */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">{t('dashboard.myCourses')}</h2>
              <Link href="/my-courses" className="text-sm font-semibold" style={{ color: '#d4537e' }}>
                {t('dashboard.goToCourses')}
              </Link>
            </div>

            {courseProgresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <p className="text-5xl mb-3">🎂</p>
                <p className="text-gray-500 mb-4">{t('dashboard.noCoursesText')}</p>
                <Link href="/courses" className="btn-primary px-6 py-2.5 text-sm">
                  {t('dashboard.noCoursesBuy')}
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {courseProgresses.slice(0, 4).map((cp) => {
                  const pct = cp.totalLessons > 0 ? Math.round((cp.completedLessons / cp.totalLessons) * 100) : 0
                  return (
                    <div key={cp.courseId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: '#fbeaf0' }}
                        >
                          {cp.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{cp.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {cp.completedLessons}/{cp.totalLessons} {t('courses.lessons')}
                          </p>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{t('dashboard.progress')}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: '#d4537e' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {cp.lastLessonId ? (
                          <Link
                            href={`/courses/${cp.slug}/lessons/${cp.lastLessonId}` as any}
                            className="text-xs font-semibold px-4 py-1.5 rounded-lg"
                            style={{ background: '#fbeaf0', color: '#d4537e' }}
                          >
                            {pct === 0 ? t('dashboard.startBtn') : t('dashboard.continueBtn')} →
                          </Link>
                        ) : (
                          <Link
                            href={`/courses/${cp.slug}` as any}
                            className="text-xs font-semibold px-4 py-1.5 rounded-lg"
                            style={{ background: '#fbeaf0', color: '#d4537e' }}
                          >
                            {t('myCourses.viewBtn')}
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* AI Chat */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5" id="ai">{t('dashboard.aiAssistant')}</h2>
            {courseProgresses.length > 0 ? (
              <AiChat />
            ) : (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: '#fbeaf0' }}
              >
                <p className="text-3xl mb-2">🤖</p>
                <p className="text-gray-600">{t('dashboard.aiLocked')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

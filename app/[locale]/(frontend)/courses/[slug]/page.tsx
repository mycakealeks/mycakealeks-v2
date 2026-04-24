import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import LessonList from '@/app/[locale]/components/LessonList'
import PaymentButton from '@/app/[locale]/components/PaymentButton'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'
import CourseReviews from '@/app/[locale]/components/CourseReviews'

const SITE = 'https://mycakealeks.com.tr'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses?where[slug][equals]=${slug}&limit=1`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    const course = data.docs?.[0]
    if (!course) return { title: 'MyCakeAleks' }
    const title = `${course.title} | MyCakeAleks`
    const description = course.description || `${course.title} - MyCakeAleks`
    const url = `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/courses/${slug}`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'website',
      },
    }
  } catch {
    return { title: 'MyCakeAleks' }
  }
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations()
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`

  let course: any = null
  let lessons: any[] = []

  try {
    const courseRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses?where[slug][equals]=${slug}&limit=1`,
      { cache: 'no-store' }
    )
    const courseData = await courseRes.json()
    course = courseData.docs?.[0] ?? null

    if (course) {
      const lessonsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons?where[course][equals]=${course.id}&limit=100&sort=order`,
        { cache: 'no-store' }
      )
      const lessonsData = await lessonsRes.json()
      lessons = lessonsData.docs ?? []
    }
  } catch {
    // keep null
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🎂</p>
          <p className="text-gray-500 mb-4">Course not found</p>
          <Link href="/courses" className="btn-primary px-6 py-2.5 text-sm">{t('nav.courses')}</Link>
        </div>
      </main>
    )
  }

  const freeLessons = lessons.filter((l) => l.isFree).length
  const currency = process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'TRY'

  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.courses'), url: `${base}/courses` },
    { name: course.title, url: `${base}/courses/${slug}` },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || course.title,
    provider: { '@type': 'Organization', name: 'MyCakeAleks', url: SITE },
    offers: { '@type': 'Offer', price: course.price, priceCurrency: 'TRY' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold" style={{ color: '#d4537e' }}>
            MyCakeAleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link">{t('nav.courses')}</Link>
            <Link href="/login" className="btn-outline text-sm px-5 py-2">{t('nav.login')}</Link>
            <Link href="/register" className="btn-primary text-sm px-5 py-2">{t('nav.start')}</Link>
            <LanguageSwitcher />
          </div>
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-12 pb-28 md:pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/courses" className="hover:text-pink-600 transition-colors">{t('nav.courses')}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{course.title}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Hero card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div
                className="w-full h-48 md:h-64 flex items-center justify-center text-8xl"
                style={{ background: 'linear-gradient(135deg, #fbeaf0 0%, #fff 100%)' }}
              >
                {course.emoji || '🎂'}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {course.level && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: '#fbeaf0', color: '#d4537e' }}
                    >
                      {LEVEL_LABELS[course.level] ?? course.level}
                    </span>
                  )}
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#f0fdf4', color: '#16a34a' }}
                  >
                    {lessons.length} {t('courses.lessons')}
                  </span>
                  {freeLessons > 0 && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: '#eff6ff', color: '#2563eb' }}
                    >
                      {t('course.freeLessonsCount', { count: freeLessons })}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{course.title}</h1>
                {course.description && (
                  <p className="text-gray-600 leading-relaxed">{course.description}</p>
                )}
              </div>
            </div>

            {/* Free lessons preview */}
            {freeLessons > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">{t('course.freeLessons')}</h2>
                <div className="space-y-3">
                  {lessons.filter((l) => l.isFree).map((lesson, i) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.id}` as any}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#fbeaf0', color: '#d4537e' }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                      <span className="ml-auto text-xs font-semibold" style={{ color: '#16a34a' }}>
                        {t('course.free')}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — hidden on mobile (shown as sticky bottom bar instead) */}
          <div className="hidden md:block md:col-span-1">
            {/* Purchase card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-gray-900">
                  {course.price} {currency}
                </span>
                {course.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">{course.oldPrice} {currency}</span>
                )}
              </div>
              {course.oldPrice && (
                <p className="text-xs font-semibold mb-4" style={{ color: '#16a34a' }}>
                  {t('course.discount', { percent: Math.round((1 - course.price / course.oldPrice) * 100) })}
                </p>
              )}

              <PaymentButton
                courseId={String(course.id)}
                amount={course.price}
              />

              <div className="mt-5 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📹</span>
                  <span>{t('course.videoLessons', { count: lessons.length })}</span>
                </div>
                {course.level && (
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>{LEVEL_LABELS[course.level] ?? course.level}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>♾️</span>
                  <span>{t('course.lifetimeAccess')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>{t('course.certificate')}</span>
                </div>
              </div>
            </div>

            {/* All lessons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">{t('lessons.title')}</h2>
              </div>
              {lessons.length === 0 ? (
                <p className="text-gray-400 text-sm px-5 py-6 text-center">{t('lessons.empty')}</p>
              ) : (
                <LessonList
                  lessons={lessons}
                  courseSlug={slug}
                  hasAccess={false}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile: lesson list (below main content, above reviews) */}
        <div className="md:hidden mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">{t('lessons.title')}</h2>
          </div>
          {lessons.length === 0 ? (
            <p className="text-gray-400 text-sm px-5 py-6 text-center">{t('lessons.empty')}</p>
          ) : (
            <LessonList lessons={lessons} courseSlug={slug} hasAccess={false} />
          )}
        </div>

        {/* Reviews */}
        {course && (
          <div className="mt-8">
            <CourseReviews
              courseId={String(course.id)}
              reviewsLabel={t('reviews.title')}
              ratingLabel={t('reviews.rating')}
              writeLabel={t('reviews.write')}
              submitLabel={t('reviews.submit')}
              mustPurchaseLabel={t('reviews.mustPurchase')}
              loginLabel={t('reviews.loginRequired')}
              alreadyReviewedLabel={t('reviews.alreadyReviewed')}
              pendingLabel={t('reviews.pending')}
            />
          </div>
        )}
      </div>

      {/* Mobile sticky buy bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div>
          <p className="text-xs text-gray-400">{course.title}</p>
          <p className="text-lg font-extrabold" style={{ color: '#d4537e' }}>
            {course.price} {process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'TRY'}
          </p>
        </div>
        <div className="flex-1">
          <PaymentButton courseId={String(course.id)} amount={course.price} />
        </div>
      </div>
    </div>
  )
}

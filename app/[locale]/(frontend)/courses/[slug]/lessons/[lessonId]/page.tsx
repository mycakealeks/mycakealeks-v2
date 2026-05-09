import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LessonList from '@/app/[locale]/components/LessonList'
import LessonProgressClient from '@/app/[locale]/components/LessonProgressClient'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'
import TrackEvent from '@/app/[locale]/components/TrackEvent'

interface Props {
  params: Promise<{ locale: string; slug: string; lessonId: string }>
}

const SITE = 'https://mycakealeks.com.tr'

export default async function LessonPage({ params }: Props) {
  const { locale, slug, lessonId } = await params
  const t = await getTranslations()
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`

  let lesson: any = null
  let course: any = null
  let lessons: any[] = []
  let recommendedProducts: any[] = []

  try {
    const lessonRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}`,
      { cache: 'no-store' }
    )
    lesson = await lessonRes.json()

    if (lesson?.course) {
      const courseId = typeof lesson.course === 'object' ? lesson.course.id : lesson.course
      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses/${courseId}`, { cache: 'no-store' }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons?where[course][equals]=${courseId}&limit=100&sort=order`, { cache: 'no-store' }),
      ])
      course = await courseRes.json()
      const lessonsData = await lessonsRes.json()
      lessons = lessonsData.docs ?? []

      // Fetch products recommended for this course
      try {
        const prodRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shop/products?relatedCourse=${courseId}&limit=3`,
          { cache: 'no-store' }
        )
        const prodData = await prodRes.json()
        recommendedProducts = prodData.docs ?? []
      } catch { /* no products */ }
    }
  } catch {
    // keep null
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Lesson not found</p>
      </main>
    )
  }

  const courseId = typeof lesson.course === 'object' ? lesson.course?.id : lesson.course
  const sorted = [...lessons].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
  const lessonNumber = sorted.findIndex((l: any) => l.id === lessonId) + 1 || 1
  const totalLessons = sorted.length

  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.courses'), url: `${base}/courses` },
    ...(course?.title ? [{ name: course.title, url: `${base}/courses/${slug}` }] : []),
    ...(lesson?.title ? [{ name: lesson.title, url: `${base}/courses/${slug}/lessons/${lessonId}` }] : []),
  ]

  return (
    <main className="min-h-screen bg-white">
      <TrackEvent event="lesson_view" entityId={lessonId} entityType="lesson" />
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link">{t('nav.courses')}</Link>
            <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">{t('nav.dashboard')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Back link */}
        <div className="mb-4">
          <Link href={`/courses/${slug}`} className="text-sm font-medium" style={{ color: '#d4537e' }}>
            ← {course?.title ?? t('lessons.backToCourse')}
          </Link>
        </div>

        {/* Mobile: stacked. Desktop: 2/3 + 1/3 grid */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">

          {/* Video + progress — full width mobile, 2/3 desktop */}
          <div className="md:col-span-2">
            <LessonProgressClient
              lessonId={lessonId}
              lessonTitle={lesson.title}
              lessonNumber={lessonNumber}
              totalLessons={totalLessons}
              courseId={courseId}
              videoId={lesson.videoId}
              isFree={lesson.isFree}
              attachments={lesson.attachments}
            />
          </div>

          {/* Lesson list + recommended products sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="border border-gray-100 rounded-xl overflow-hidden md:sticky md:top-24">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">{t('lessons.title')}</h2>
              </div>
              <LessonList
                lessons={lessons}
                courseSlug={slug}
                hasAccess={false}
                activeLessonId={lessonId}
                courseId={courseId}
              />
            </div>

            {/* Recommended products */}
            {recommendedProducts.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">{t('shop.recommendedForLesson')}</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {recommendedProducts.map((product: any) => {
                    const thumb = product.images?.[0]?.image
                    const thumbUrl = typeof thumb === 'object' ? thumb?.url : null
                    return (
                      <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                          style={{ background: '#fbeaf0' }}>
                          {thumbUrl
                            ? <img src={thumbUrl} alt={product.name} className="w-full h-full object-cover" />
                            : <span className="text-xl">🛍️</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs font-bold" style={{ color: '#d4537e' }}>
                            {product.price} ₺
                          </p>
                        </div>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ background: '#d4537e' }}
                        >
                          {t('shop.addToCart')}
                        </Link>
                      </div>
                    )
                  })}
                </div>
                <div className="px-4 py-3 border-t border-gray-50">
                  <Link href="/shop" className="text-xs font-medium" style={{ color: '#d4537e' }}>
                    {t('nav.shop')} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

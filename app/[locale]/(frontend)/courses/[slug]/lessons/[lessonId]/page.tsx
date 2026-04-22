import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import VideoPlayer from '@/app/[locale]/components/VideoPlayer'
import LessonList from '@/app/[locale]/components/LessonList'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'

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

  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.courses'), url: `${base}/courses` },
    ...(course?.title ? [{ name: course.title, url: `${base}/courses/${slug}` }] : []),
    ...(lesson?.title ? [{ name: lesson.title, url: `${base}/courses/${slug}/lessons/${lessonId}` }] : []),
  ]

  return (
    <main className="min-h-screen bg-white">
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

          {/* Video + info — full width mobile, 2/3 desktop */}
          <div className="md:col-span-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

            {lesson.videoId ? (
              <VideoPlayer
                videoId={lesson.videoId}
                isFree={lesson.isFree}
                courseId={typeof lesson.course === 'object' ? lesson.course?.id : lesson.course}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">{t('lessons.noVideo')}</p>
              </div>
            )}

            {lesson.attachments?.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-gray-800 mb-3">{t('lessons.materials')}</h2>
                <ul className="space-y-2">
                  {lesson.attachments.map((att: any) => (
                    <li key={att.id}>
                      {att.file?.url ? (
                        <a href={att.file.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm hover:underline" style={{ color: '#d4537e' }}>
                          📎 {att.title || att.file.filename}
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">📎 {att.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Lesson list — under video on mobile, sidebar on desktop */}
          <div className="md:col-span-1">
            <div className="border border-gray-100 rounded-xl overflow-hidden md:sticky md:top-24">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">{t('lessons.title')}</h2>
              </div>
              <LessonList
                lessons={lessons}
                courseSlug={slug}
                hasAccess={false}
                activeLessonId={lessonId}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

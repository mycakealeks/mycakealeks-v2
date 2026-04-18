import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import VideoPlayer from '@/app/[locale]/components/VideoPlayer'
import LessonList from '@/app/[locale]/components/LessonList'

interface Props {
  params: Promise<{ locale: string; slug: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params
  const t = await getTranslations()

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
      const courseRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses/${courseId}`,
        { cache: 'no-store' }
      )
      course = await courseRes.json()

      const lessonsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons?where[course][equals]=${courseId}&limit=100&sort=order`,
        { cache: 'no-store' }
      )
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

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4 items-center">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">{t('nav.courses')}</Link>
          <Link href="/dashboard" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">{t('nav.dashboard')}</Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-4">
          <Link href={`/courses/${slug}`} className="text-pink-600 hover:underline text-sm">
            ← {course?.title ?? t('lessons.backToCourse')}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

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
                        <a
                          href={att.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline text-sm"
                        >
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

          <div className="col-span-1">
            <div className="border rounded-xl overflow-hidden sticky top-8">
              <div className="bg-gray-50 px-4 py-3 border-b">
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

import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import LessonList from '@/app/[locale]/components/LessonList'
import PaymentButton from '@/app/[locale]/components/PaymentButton'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations()

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
        <p className="text-gray-500">Course not found</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4 items-center">
          <Link href="/courses" className="text-pink-600 font-semibold">{t('nav.courses')}</Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">{t('nav.login')}</Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>
            )}

            <div className="bg-pink-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('lessons.count', { count: lessons.length })}</p>
                  <p className="text-3xl font-bold text-pink-600 mt-1">
                    {course.price} {process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || 'TRY'}
                  </p>
                </div>
                <PaymentButton
                  courseId={course.id}
                  courseTitle={course.title}
                  price={course.price}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="font-semibold text-gray-800">{t('lessons.title')}</h2>
              </div>
              {lessons.length === 0 ? (
                <p className="text-gray-400 text-sm px-4 py-6 text-center">{t('lessons.empty')}</p>
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
      </div>
    </main>
  )
}

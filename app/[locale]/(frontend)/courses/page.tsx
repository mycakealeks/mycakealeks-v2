import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'

const SITE = 'https://mycakealeks.com.tr'

const COURSES_META: Record<string, { title: string; description: string; ogLocale: string }> = {
  tr: { title: 'Pasta Kursları | MyCakeAleks', description: 'Profesyonel online pasta ve konditerlik kursları. Başlangıçtan ileri seviyeye, her kurs sertifikalı.', ogLocale: 'tr_TR' },
  ru: { title: 'Курсы кондитерского мастерства | MyCakeAleks', description: 'Профессиональные онлайн курсы по кондитерскому делу. От начинающего до профессионала, с сертификатом.', ogLocale: 'ru_RU' },
  en: { title: 'Cake & Pastry Courses | MyCakeAleks', description: 'Professional online cake and pastry courses. From beginner to advanced, all courses include a certificate.', ogLocale: 'en_US' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = COURSES_META[locale] ?? COURSES_META.tr
  const url = `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/courses`
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description, url, type: 'website', locale: m.ogLocale },
  }
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const SITE = 'https://mycakealeks.com.tr'
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`
  let courses: any[] = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses?limit=12&where[status][equals]=published`, {
      cache: 'no-store',
    })
    const data = await res.json()
    courses = data.docs || []
  } catch {
    courses = []
  }

  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.courses'), url: `${base}/courses` },
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
            <Link href="/courses" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.courses')}</Link>
            <Link href="/recipes" className="nav-link">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <Link href="/login" className="hidden md:inline-flex btn-outline text-sm py-2 px-4">{t('nav.login')}</Link>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="py-12 md:py-16 px-4 md:px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #fbeaf0 0%, #fff 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('courses.title')}</h1>
          <p className="text-gray-500 mb-7 text-sm md:text-base">{t('courses.heroSubtitle')}</p>
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={t('courses.searchPlaceholder')}
              className="input-field pl-10 pr-4 py-3 shadow-sm text-base"
            />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-wrap gap-2">
        {[
          { key: 'filterAll', label: t('courses.filterAll') },
          { key: 'filterBeginner', label: t('courses.filterBeginner') },
          { key: 'filterIntermediate', label: t('courses.filterIntermediate') },
          { key: 'filterAdvanced', label: t('courses.filterAdvanced') },
        ].map((f, i) => (
          <button
            key={f.key}
            className="text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors min-h-[44px]"
            style={
              i === 0
                ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
            }
          >
            {f.label}
          </button>
        ))}
      </section>

      {/* GRID — 1 col → 2 col → 3 col */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎂</p>
            <p className="text-gray-400 text-base">{t('courses.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {courses.map((course: any) => (
              <div key={course.id} className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-40 md:h-44 flex items-center justify-center text-6xl" style={{ background: '#fbeaf0' }}>
                  🎂
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {typeof course.description === 'string' ? course.description : t('courses.defaultDescription')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl" style={{ color: '#d4537e' }}>
                      {course.price} ₺
                    </span>
                    <Link
                      href={`/courses/${course.slug || course.id}`}
                      className="btn-primary text-sm py-2.5 px-4 min-h-[44px] flex items-center"
                    >
                      {t('courses.buy')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

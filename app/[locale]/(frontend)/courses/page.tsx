import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default async function CoursesPage() {
  const t = await getTranslations()
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

  const levelColors: Record<string, string> = {
    beginner: '#dcfce7',
    intermediate: '#fef9c3',
    advanced: '#fbeaf0',
  }

  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.courses')}</Link>
            <Link href="/recipes" className="nav-link">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="btn-outline text-sm py-2 px-4">{t('nav.login')}</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #fbeaf0 0%, #fff 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{t('courses.title')}</h1>
          <p className="text-gray-500 mb-8">{t('courses.heroSubtitle')}</p>
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={t('courses.searchPlaceholder')}
              className="input-field pl-10 pr-4 py-3 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-2">
        {[
          { key: 'filterAll', label: t('courses.filterAll') },
          { key: 'filterBeginner', label: t('courses.filterBeginner') },
          { key: 'filterIntermediate', label: t('courses.filterIntermediate') },
          { key: 'filterAdvanced', label: t('courses.filterAdvanced') },
        ].map((f, i) => (
          <button
            key={f.key}
            className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
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

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎂</p>
            <p className="text-gray-400 text-lg">{t('courses.empty')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="h-44 flex items-center justify-center text-6xl"
                  style={{ background: '#fbeaf0' }}
                >
                  🎂
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {typeof course.description === 'string'
                      ? course.description
                      : t('courses.defaultDescription')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl" style={{ color: '#d4537e' }}>
                      {course.price} ₺
                    </span>
                    <Link
                      href={`/courses/${course.slug || course.id}`}
                      className="btn-primary text-sm py-2 px-4"
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

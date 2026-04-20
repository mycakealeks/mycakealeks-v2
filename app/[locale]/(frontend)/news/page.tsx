import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

interface Props {
  searchParams: Promise<{ category?: string }>
}

const CATEGORIES = ['trends', 'recipes', 'techniques', 'business', 'inspiration'] as const

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NewsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const t = await getTranslations()

  let news: any[] = []
  try {
    const catParam = category ? `&where[category][equals]=${category}` : ''
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news?where[status][equals]=published&sort=-publishedAt&limit=30${catParam}`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    news = data.docs || []
  } catch {
    news = []
  }

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
            <Link href="/news" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.news')}</Link>
            <Link href="/recipes" className="nav-link text-sm">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <Link href="/login" className="hidden md:inline-flex btn-outline text-sm py-2 px-4">{t('nav.login')}</Link>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-10 md:py-14 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#fff 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-3xl mb-3">📰</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('news.title')}</h1>
          <p className="text-gray-500 text-sm md:text-base">{t('news.subtitle')}</p>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-wrap gap-2">
        <Link
          href="/news"
          className="text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors min-h-[44px] flex items-center"
          style={!category ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' } : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}
        >
          {t('news.catAll')}
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/news?category=${cat}`}
            className="text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors min-h-[44px] flex items-center"
            style={category === cat ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' } : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}
          >
            {t(`news.cat_${cat}` as any)}
          </Link>
        ))}
      </section>

      {/* NEWS GRID */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        {news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400">{t('news.noNews')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {news.map((item: any) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Cover */}
                <div className="h-40 flex items-center justify-center text-6xl" style={{ background: '#fbeaf0' }}>
                  {item.coverEmoji || '🎂'}
                </div>
                <div className="p-5">
                  {/* Category tag */}
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block"
                    style={{ background: '#fbeaf0', color: '#d4537e' }}
                  >
                    {t(`news.cat_${item.category}` as any)}
                  </span>
                  <h2 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                    <span className="text-xs font-semibold" style={{ color: '#d4537e' }}>{t('news.readMore')} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

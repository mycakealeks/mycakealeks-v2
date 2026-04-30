import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './components/LanguageSwitcher'
import MobileMenu from './components/MobileMenu'
import RecommendedCourses from './components/RecommendedCourses'
import { formatPrice } from '@/app/lib/currency'

const SITE = 'https://mycakealeks.com.tr'

const HOME_META: Record<string, { title: string; description: string; ogLocale: string }> = {
  tr: {
    title: 'MyCakeAleks - Profesyonel Pasta Kursları | Online Konditerlik Eğitimi',
    description: "Türkiye'nin en iyi online pasta kursları. Sıfırdan uzmana: fondant, düğün pastası, Fransız pastacılık. HD video, AI asistan, sertifika.",
    ogLocale: 'tr_TR',
  },
  ru: {
    title: 'MyCakeAleks - Профессиональные курсы кондитерского мастерства',
    description: 'Лучшие онлайн курсы по кондитерскому делу. От нуля до профессионала: фондан, свадебные торты, французская выпечка. HD видео, AI ассистент, сертификат.',
    ogLocale: 'ru_RU',
  },
  en: {
    title: 'MyCakeAleks - Professional Cake & Pastry Courses Online',
    description: 'Best online pastry courses. From beginner to pro: fondant, wedding cakes, French pastry. HD video lessons, AI assistant, certificate.',
    ogLocale: 'en_US',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = HOME_META[locale] ?? HOME_META.tr
  const url = locale === 'tr' ? SITE : `${SITE}/${locale}`
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      url,
      type: 'website',
      locale: m.ogLocale,
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations()
  const m = HOME_META[locale] ?? HOME_META.tr

  // Real platform stats
  let statsData = { users: 0, lessons: 0, courses: 0 }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/stats`,
      { cache: 'no-store' },
    )
    if (res.ok) statsData = await res.json()
  } catch { /* use defaults */ }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyCakeAleks',
    url: SITE,
    description: m.description,
    sameAs: [],
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link">{t('nav.courses')}</Link>
            <Link href="/news" className="nav-link">{t('nav.news')}</Link>
            <Link href="/pricing" className="nav-link">{t('nav.pricing')}</Link>
            <Link href="/about" className="nav-link">{t('nav.about')}</Link>
            <Link href="/search" className="nav-link text-gray-400 hover:text-gray-600" aria-label="Search">🔍</Link>
          </div>
          {/* Desktop right */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Link href="/login" className="hidden md:inline-flex btn-outline text-sm py-2 px-4">{t('nav.login')}</Link>
            <Link href="/register" className="hidden md:inline-flex btn-primary text-sm py-2 px-4">{t('nav.start')}</Link>
            {/* Mobile hamburger */}
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center text-center">
        <span
          className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-5"
          style={{ background: '#fbeaf0', color: '#d4537e' }}
        >
          ✨ {t('home.badge')}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          {t('home.title')}{' '}
          <span style={{ color: '#d4537e' }}>{t('home.titleAccent')}</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-xl mb-8 px-2">{t('home.subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/courses" className="btn-primary px-7 py-3.5 text-base justify-center">
            {t('home.ctaCourses')} →
          </Link>
          <Link href="/register" className="btn-outline px-7 py-3.5 text-base justify-center">
            {t('home.ctaStart')}
          </Link>
        </div>

        {/* Stats — 2×2 on mobile, 4 cols on md */}
        <div className="mt-12 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl">
          {[
            { val: '4000+', label: t('home.stat1Label') },
            { val: '30+', label: t('home.stat2Label') },
            { val: '100+', label: t('home.stat3Label') },
            { val: '3', label: t('home.stat4Label') },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold" style={{ color: '#d4537e' }}>{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSES ── */}
      <section style={{ background: '#fbeaf0' }} className="py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('home.coursesTitle')}</h2>
            <p className="text-gray-500 mt-2">{t('home.coursesSubtitle')}</p>
          </div>
          {/* 1 col → 2 col → 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                emoji: t('home.courseEmoji1'), title: t('home.course1Title'), level: t('home.course1Level'),
                lessons: t('home.course1Lessons'), hours: t('home.course1Hours'),
                price: t('home.course1Price'), oldPrice: t('home.course1OldPrice'), featured: false,
              },
              {
                emoji: t('home.courseEmoji2'), title: t('home.course2Title'), level: t('home.course2Level'),
                lessons: t('home.course2Lessons'), hours: t('home.course2Hours'),
                price: t('home.course2Price'), oldPrice: t('home.course2OldPrice'), featured: true,
              },
              {
                emoji: t('home.courseEmoji3'), title: t('home.course3Title'), level: t('home.course3Level'),
                lessons: t('home.course3Lessons'), hours: t('home.course3Hours'),
                price: t('home.course3Price'), oldPrice: t('home.course3OldPrice'), featured: false,
              },
            ].map((c) => (
              <div
                key={c.title}
                className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm"
                style={c.featured ? { outline: '2px solid #d4537e' } : {}}
              >
                {c.featured && (
                  <div className="text-center text-xs font-bold py-1.5 text-white" style={{ background: '#d4537e' }}>
                    🔥 {t('home.bestseller')}
                  </div>
                )}
                <div className="h-40 md:h-44 flex items-center justify-center text-6xl md:text-7xl"
                  style={{ background: c.featured ? '#fbeaf0' : '#f9fafb' }}>
                  {c.emoji}
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fbeaf0', color: '#d4537e' }}>
                    {c.level}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">📹 {c.lessons} &nbsp;·&nbsp; ⏱ {c.hours}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xl" style={{ color: '#d4537e' }}>{formatPrice(Number(c.price), locale)}</span>
                      <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(Number(c.oldPrice), locale)}</span>
                    </div>
                    <Link href="/courses" className="btn-primary text-sm py-2.5 px-4 min-h-[44px] flex items-center">
                      {t('home.buyBtn')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI BANNER ── */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #EEEDFE 0%, #fbeaf0 100%)' }}
        >
          {/* flex-col on mobile, grid on md */}
          <div className="flex flex-col md:grid md:grid-cols-2">
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit"
                style={{ background: 'rgba(212,83,126,0.12)', color: '#d4537e' }}
              >
                AI
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{t('home.aiTitle')}</h2>
              <p className="text-gray-500 mb-6 text-sm md:text-base">{t('home.aiSubtitle')}</p>
              <Link href="/dashboard" className="btn-primary w-fit px-6 py-3 min-h-[44px]">
                {t('home.aiBtn')} →
              </Link>
            </div>
            <div className="px-8 pb-8 md:p-10 flex items-end justify-center">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-end">
                  <div className="text-sm text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%]"
                    style={{ background: '#d4537e' }}>
                    {t('home.aiChatYou')}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="text-sm text-gray-700 bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%]">
                    {t('home.aiChatBot')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: '#fbeaf0' }} className="py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 md:mb-12">{t('home.featTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: '🎬', title: t('home.feat1Title'), desc: t('home.feat1Desc') },
              { icon: '🤖', title: t('home.feat2Title'), desc: t('home.feat2Desc') },
              { icon: '🏆', title: t('home.feat3Title'), desc: t('home.feat3Desc') },
            ].map((f) => (
              <div key={f.title} className="card-hover bg-white rounded-2xl p-6 md:p-7 text-center shadow-sm">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 md:mb-12">{t('home.reviewsTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { name: t('home.review1Name'), country: t('home.review1Country'), text: t('home.review1Text') },
              { name: t('home.review2Name'), country: t('home.review2Country'), text: t('home.review2Text') },
              { name: t('home.review3Name'), country: t('home.review3Country'), text: t('home.review3Text') },
            ].map((r) => (
              <div key={r.name} className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#d4537e' }}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.country}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl py-12 md:py-16 px-6 md:px-8"
          style={{ background: '#fbeaf0' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{t('home.ctaTitle')}</h2>
          <p className="text-gray-500 mb-7 text-sm md:text-base">{t('home.ctaSubtitle')}</p>
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base min-h-[44px] inline-flex">
            {t('home.ctaBtn')} →
          </Link>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-10">
        <RecommendedCourses />
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-xl font-bold">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/news" className="nav-link text-sm">{t('nav.news')}</Link>
            <Link href="/pricing" className="nav-link text-sm">{t('nav.pricing')}</Link>
            <Link href="/about" className="nav-link text-sm">{t('nav.about')}</Link>
            <Link href="/faq" className="nav-link text-sm">{t('nav.faq')}</Link>
            <Link href="/login" className="nav-link text-sm">{t('nav.login')}</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 MyCakeAleks</p>
        </div>
      </footer>
    </main>
  )
}

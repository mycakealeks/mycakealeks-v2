import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from './components/LanguageSwitcher'

export default async function HomePage() {
  const t = await getTranslations()

  return (
    <main className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link">{t('nav.courses')}</Link>
            <Link href="/recipes" className="nav-link">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="btn-outline text-sm py-2 px-4">{t('nav.login')}</Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">{t('nav.start')}</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <span
          className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
          style={{ background: '#fbeaf0', color: '#d4537e' }}
        >
          ✨ {t('home.badge')}
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          {t('home.title')}{' '}
          <span style={{ color: '#d4537e' }}>{t('home.titleAccent')}</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-8">{t('home.subtitle')}</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/courses" className="btn-primary px-7 py-3 text-base">
            {t('home.ctaCourses')} →
          </Link>
          <Link href="/register" className="btn-outline px-7 py-3 text-base">
            {t('home.ctaStart')}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl">
          {[
            { val: t('home.stat1Value'), label: t('home.stat1Label') },
            { val: t('home.stat2Value'), label: t('home.stat2Label') },
            { val: t('home.stat3Value'), label: t('home.stat3Label') },
            { val: t('home.stat4Value'), label: t('home.stat4Label') },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold" style={{ color: '#d4537e' }}>{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSES ── */}
      <section style={{ background: '#fbeaf0' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('home.coursesTitle')}</h2>
            <p className="text-gray-500 mt-2">{t('home.coursesSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: t('home.courseEmoji1'),
                title: t('home.course1Title'),
                level: t('home.course1Level'),
                lessons: t('home.course1Lessons'),
                hours: t('home.course1Hours'),
                price: t('home.course1Price'),
                oldPrice: t('home.course1OldPrice'),
                featured: false,
              },
              {
                emoji: t('home.courseEmoji2'),
                title: t('home.course2Title'),
                level: t('home.course2Level'),
                lessons: t('home.course2Lessons'),
                hours: t('home.course2Hours'),
                price: t('home.course2Price'),
                oldPrice: t('home.course2OldPrice'),
                featured: true,
              },
              {
                emoji: t('home.courseEmoji3'),
                title: t('home.course3Title'),
                level: t('home.course3Level'),
                lessons: t('home.course3Lessons'),
                hours: t('home.course3Hours'),
                price: t('home.course3Price'),
                oldPrice: t('home.course3OldPrice'),
                featured: false,
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`card-hover bg-white rounded-2xl overflow-hidden shadow-sm ${
                  c.featured ? 'ring-2' : ''
                }`}
                style={c.featured ? { ringColor: '#d4537e' } as React.CSSProperties : {}}
              >
                {c.featured && (
                  <div
                    className="text-center text-xs font-bold py-1.5 text-white"
                    style={{ background: '#d4537e' }}
                  >
                    🔥 {t('home.bestseller')}
                  </div>
                )}
                <div
                  className="h-44 flex items-center justify-center text-7xl"
                  style={{ background: c.featured ? '#fbeaf0' : '#f9fafb' }}
                >
                  {c.emoji}
                </div>
                <div className="p-5">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: '#fbeaf0', color: '#d4537e' }}
                  >
                    {c.level}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    📹 {c.lessons} &nbsp;·&nbsp; ⏱ {c.hours}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xl" style={{ color: '#d4537e' }}>
                        {c.price} ₺
                      </span>
                      <span className="text-xs text-gray-400 line-through ml-2">{c.oldPrice} ₺</span>
                    </div>
                    <Link href="/courses" className="btn-primary text-sm py-2 px-4">
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
      <section className="py-20 px-6">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #EEEDFE 0%, #fbeaf0 100%)' }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit"
                style={{ background: 'rgba(212,83,126,0.12)', color: '#d4537e' }}
              >
                AI
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('home.aiTitle')}</h2>
              <p className="text-gray-500 mb-7">{t('home.aiSubtitle')}</p>
              <Link href="/dashboard" className="btn-primary w-fit px-6 py-3">
                {t('home.aiBtn')} →
              </Link>
            </div>
            <div className="p-10 flex items-end justify-center">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-end">
                  <div
                    className="text-sm text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%]"
                    style={{ background: '#d4537e' }}
                  >
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
      <section style={{ background: '#fbeaf0' }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('home.featTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎬', title: t('home.feat1Title'), desc: t('home.feat1Desc') },
              { icon: '🤖', title: t('home.feat2Title'), desc: t('home.feat2Desc') },
              { icon: '🏆', title: t('home.feat3Title'), desc: t('home.feat3Desc') },
            ].map((f) => (
              <div key={f.title} className="card-hover bg-white rounded-2xl p-7 text-center shadow-sm">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('home.reviewsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
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
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl py-16 px-8"
          style={{ background: '#fbeaf0' }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('home.ctaTitle')}</h2>
          <p className="text-gray-500 mb-8">{t('home.ctaSubtitle')}</p>
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
            {t('home.ctaBtn')} →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xl font-bold">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </p>
          <div className="flex gap-6">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/recipes" className="nav-link text-sm">{t('nav.recipes')}</Link>
            <Link href="/login" className="nav-link text-sm">{t('nav.login')}</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 MyCakeAleks</p>
        </div>
      </footer>
    </main>
  )
}

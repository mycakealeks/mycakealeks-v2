import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

const SITE = 'https://mycakealeks.com.tr'

const ABOUT_META: Record<string, { title: string; description: string }> = {
  tr: { title: 'Aleksandra Hakkında | MyCakeAleks', description: 'Profesyonel konditer ve eğitmen Aleksandra\'nın hikayesi. 10+ yıl deneyim, 2400+ öğrenci.' },
  ru: { title: 'Об Александре | MyCakeAleks', description: 'История профессионального кондитера и преподавателя Александры. 10+ лет опыта, 2400+ студентов.' },
  en: { title: 'About Aleksandra | MyCakeAleks', description: 'The story of professional pastry chef and instructor Aleksandra. 10+ years experience, 2400+ students.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = ABOUT_META[locale] ?? ABOUT_META.tr
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description, url: `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/about`, type: 'profile' },
  }
}

const STORY: Record<string, { heading: string; text: string[] }> = {
  tr: {
    heading: 'Benim Hikayem',
    text: [
      'Mutfak tutkum çocukluğumda büyükannemin yanında başladı. Onun ellerinden çıkan her tatlı, bende hem sanatsal bir hayranlık hem de derin bir merak uyandırıyordu.',
      '2012 yılında İstanbul\'da profesyonel konditerlik eğitimi aldım. Sonrasında Paris\'te Fransız patisserie tekniklerini, Tokyo\'da Japon tatlı sanatını öğrendim.',
      'Bugün 10 yılı aşkın deneyimimle 2400\'den fazla öğrenciye pasta ve tatlı sanatını öğretiyorum. Her öğrencimin kendi tarzını bulmasına yardımcı olmak benim en büyük motivasyonum.',
    ],
  },
  ru: {
    heading: 'Моя история',
    text: [
      'Любовь к кондитерскому делу началась в детстве на кухне у бабушки. Каждый её десерт пробуждал во мне восхищение и желание создавать что-то своё.',
      'В 2012 году я прошла профессиональное обучение кондитерскому делу в Стамбуле. Затем изучала французскую патиссерию в Париже и японское кондитерское искусство в Токио.',
      'Сегодня, имея более 10 лет опыта, я преподаю кондитерское мастерство более чем 2400 студентам. Помогать каждому найти свой стиль — моя главная мотивация.',
    ],
  },
  en: {
    heading: 'My Story',
    text: [
      'My passion for pastry began in childhood in my grandmother\'s kitchen. Every dessert she made sparked both artistic admiration and deep curiosity in me.',
      'In 2012, I completed professional pastry training in Istanbul. I then studied French patisserie techniques in Paris and Japanese confectionery arts in Tokyo.',
      'Today, with over 10 years of experience, I teach pastry arts to more than 2,400 students. Helping each student find their own style is my greatest motivation.',
    ],
  },
}

const MISSION: Record<string, string> = {
  tr: '"Her pasta bir hikaye anlatır. Benim misyonum, o hikayeyi sizinle paylaşmak ve sizi kendi hikayenizi yaratmaya ilham vermek."',
  ru: '"Каждый торт рассказывает историю. Моя миссия — поделиться этой историей с вами и вдохновить вас на создание своей собственной."',
  en: '"Every cake tells a story. My mission is to share that story with you and inspire you to create your own."',
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const story = STORY[locale] ?? STORY.tr
  const mission = MISSION[locale] ?? MISSION.tr

  let statsData = { users: 0, lessons: 0, courses: 0 }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/stats`,
      { cache: 'no-store' },
    )
    if (res.ok) statsData = await res.json()
  } catch { /* use defaults */ }

  const stats = [
    { value: '10+', label: t('about.yearsExp'), icon: '⭐' },
    { value: statsData.users > 0 ? `${statsData.users}+` : '—', label: t('about.students'), icon: '👩‍🍳' },
    { value: statsData.lessons > 0 ? `${statsData.lessons}+` : '—', label: t('about.courses'), icon: '📚' },
    { value: '3', label: t('about.countries'), icon: '🌍' },
  ]

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
            <Link href="/news" className="nav-link text-sm">{t('nav.news')}</Link>
            <Link href="/about" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.about')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-14 md:py-20 px-4" style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff5f8 100%)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <div
            className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex-shrink-0 flex items-center justify-center text-8xl shadow-lg"
            style={{ background: 'linear-gradient(135deg,#f9c8d8 0%,#fbeaf0 100%)' }}
          >
            👩‍🍳
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#d4537e' }}>
              {t('about.role')}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Aleksandra</h1>
            <p className="text-gray-500 text-lg leading-relaxed">{t('about.tagline')}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/courses" className="btn-primary px-6 py-3 text-sm">{t('about.ctaCourses')}</Link>
              <Link href="/faq" className="btn-outline px-6 py-3 text-sm">{t('nav.faq')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{story.heading}</h2>
          {story.text.map((para, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
          ))}
        </div>
      </section>

      {/* MISSION QUOTE */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <blockquote
            className="rounded-2xl p-8 text-center italic text-lg font-medium text-gray-700 leading-relaxed"
            style={{ background: '#fbeaf0', borderLeft: `4px solid #d4537e` }}
          >
            {mission}
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('about.ctaTitle')}</h2>
          <p className="text-gray-500 mb-6">{t('about.ctaSubtitle')}</p>
          <Link href="/courses" className="btn-primary px-8 py-3.5 text-base inline-flex">
            {t('about.ctaCourses')} →
          </Link>
        </div>
      </section>
    </main>
  )
}

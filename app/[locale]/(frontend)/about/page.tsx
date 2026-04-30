import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

const SITE = 'https://mycakealeks.com.tr'

const ABOUT_META: Record<string, { title: string; description: string }> = {
  tr: { title: 'Aleksandra Hakkında | MyCakeAleks', description: 'Profesyonel konditer ve eğitmen Aleksandra\'nın online okulu. 4000+ öğrenci, 100+ özgün tarif.' },
  ru: { title: 'Об Александре | MyCakeAleks', description: 'Онлайн-школа профессионального кондитера Александры. 4000+ учеников, 100+ авторских рецептов.' },
  en: { title: 'About Aleksandra | MyCakeAleks', description: 'Professional pastry chef and instructor Aleksandra\'s online school. 4000+ students, 100+ original recipes.' },
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
    heading: 'Hikayem',
    text: [
      'Online konditerlik okuluma hoş geldiniz! Adım Aleksandra, profesyonel bir konditerim!',
      'İşime bayılıyorum, tatlılardan ilham alıyorum ve size de ilham vermek istiyorum! Tariflerim ve derslerim sayesinde hem kendiniz hem de sevdikleriniz için özel anlar yaratabileceksiniz.',
      'Müşterilerinizi eşsiz lezzetler ve mükemmel kombinasyonlarla hayrete düşürün! 4000\'den fazla öğrencim kurslarımı tamamlayarak kendi konditerlik işlerini başarıyla geliştirdi.',
    ],
  },
  ru: {
    heading: 'Моя история',
    text: [
      'Приветствую Вас в моей онлайн-школе для кондитеров! Меня зовут Александра, я профессиональный кондитер!',
      'Безумно люблю своё дело, вдохновляюсь десертами, и хочу вдохновлять Вас! Благодаря моим рецептам и урокам, Вы сможете радовать себя и своих близких, быть в центре внимания на любом празднике.',
      'Удивляйте своих заказчиков необычными вкусами и идеальными сочетаниями! Уже более 4000 учеников прошли мои курсы и успешно развивают своё кондитерское дело.',
    ],
  },
  en: {
    heading: 'My Story',
    text: [
      'Welcome to my online pastry school! My name is Aleksandra, and I\'m a professional pastry chef!',
      'I\'m incredibly passionate about my craft, inspired by desserts, and I want to inspire you! Through my recipes and lessons, you\'ll be able to create special moments for yourself and your loved ones.',
      'Amaze your customers with unique flavors and perfect combinations! Over 4,000 students have completed my courses and are successfully growing their own pastry businesses.',
    ],
  },
}

const MISSION: Record<string, string> = {
  tr: '"Her pasta sevgi ve ilhamla yapılır. Misyonum sizi kendi ellerinizle güzellik yaratmaya ve bu mutluluğu sevdiklerinizle paylaşmaya ilham vermektir."',
  ru: '"Каждый торт — это любовь и вдохновение. Моя миссия — вдохновить Вас создавать красоту своими руками и делиться радостью с близкими."',
  en: '"Every cake is made with love and inspiration. My mission is to inspire you to create beauty with your own hands and share that joy with your loved ones."',
}

const FOR_WHOM: Record<string, string[]> = {
  tr: [
    'Kendiniz ve sevdikleriniz için lezzetli ve güzel pastalar yapmayı öğrenmek isteyenler',
    'Başlamak isteyip başarabileceğinden şüphe edenler',
    'Deneyimli konditerler ve ürün yelpazelerini genişletmek isteyenler',
    'Yeni bir kariyer edinmek ve bu alanda para kazanmak isteyenler',
  ],
  ru: [
    'Хотите научиться готовить вкусные и красивые торты для себя и близких',
    'Очень хотите начать, но сомневаетесь, что сможете так же, как другие кондитеры',
    'Вы уже опытный кондитер и хотите расширить свой ассортимент',
    'Хотите освоить новый вид деятельности и начать на этом зарабатывать',
  ],
  en: [
    'Want to learn to make delicious and beautiful cakes for yourself and loved ones',
    'Want to start but doubt you can do it as well as other pastry chefs',
    'Already an experienced pastry chef looking to expand your repertoire',
    'Want to master a new skill and start earning from it',
  ],
}

const FOR_WHOM_ICONS = ['🎂', '💪', '🌟', '💰']

const OFFERS: Record<string, { title: string; desc: string; icon: string }[]> = {
  tr: [
    { icon: '🎬', title: 'Video Dersler ve Teknoloji Kartları', desc: '30\'dan fazla özgün tarif, adım adım talimatlar ve ayrıntılı teknoloji kartları' },
    { icon: '🏆', title: 'MyCakeAleks Özel Kursu', desc: '5 haftada konditerlik mesleğini öğren. Temelden ustalığa eksiksiz program' },
    { icon: '🇹🇷', title: 'Türk Ürünleri Rehberi', desc: 'Türkiye\'de tatlı malzemeleri için kapsamlı rehber: nereden alınır, ne ile değiştirilir' },
  ],
  ru: [
    { icon: '🎬', title: 'Видео-уроки и технологические карты', desc: 'Более 30 авторских рецептов с подробными пошаговыми инструкциями и технологическими картами' },
    { icon: '🏆', title: 'Авторский курс MyCakeAleks', desc: 'Освой профессию кондитера за 5 недель. Полная программа от основ до уверенного мастерства' },
    { icon: '🇹🇷', title: 'Гайд по турецким продуктам', desc: 'Полный список продуктов для десертов в Турции: где купить, чем заменить, что выбрать' },
  ],
  en: [
    { icon: '🎬', title: 'Video Lessons & Recipe Cards', desc: 'Over 30 original recipes with step-by-step instructions and detailed recipe cards' },
    { icon: '🏆', title: 'MyCakeAleks Signature Course', desc: 'Master the pastry profession in 5 weeks. A complete program from basics to confident mastery' },
    { icon: '🇹🇷', title: 'Turkish Products Guide', desc: 'Complete guide to dessert ingredients in Turkey: where to buy, what to substitute, what to choose' },
  ],
}

const SOCIAL_LABELS: Record<string, { title: string; instagram: string; telegram: string; telegramChat: string }> = {
  tr: { title: 'Kaçırma, takip et', instagram: 'Instagram @mycakealeks', telegram: 'Telegram Kanalı', telegramChat: 'Telegram Sohbeti' },
  ru: { title: 'Подпишись, чтобы не пропустить', instagram: 'Instagram @mycakealeks', telegram: 'Telegram канал', telegramChat: 'Telegram чат' },
  en: { title: 'Follow along', instagram: 'Instagram @mycakealeks', telegram: 'Telegram Channel', telegramChat: 'Telegram Chat' },
}

const FOR_WHOM_TITLE: Record<string, string> = {
  tr: 'Kimler için uygun?',
  ru: 'Для кого подходит обучение?',
  en: 'Who is this for?',
}

const OFFERS_TITLE: Record<string, string> = {
  tr: 'Ne sunuyoruz?',
  ru: 'Что предлагает школа',
  en: 'What we offer',
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const story = STORY[locale] ?? STORY.ru
  const mission = MISSION[locale] ?? MISSION.ru
  const forWhom = FOR_WHOM[locale] ?? FOR_WHOM.ru
  const offers = OFFERS[locale] ?? OFFERS.ru
  const social = SOCIAL_LABELS[locale] ?? SOCIAL_LABELS.ru

  const stats = [
    { value: '4000+', label: t('about.stat1Label'), icon: '👩‍🍳' },
    { value: '100+', label: t('about.stat2Label'), icon: '📋' },
    { value: '30+', label: t('about.stat3Label'), icon: '🎬' },
    { value: '3', label: t('about.stat4Label'), icon: '🌍' },
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
          {/* TODO: заменить на реальное фото */}
          <div
            className="w-48 h-48 md:w-64 md:h-64 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: '#d4537e' }}
          >
            <span className="text-white font-extrabold select-none" style={{ fontSize: '5rem', lineHeight: 1 }}>АГ</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#d4537e' }}>
              {t('about.role')}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-1">Aleksandra</h1>
            <p className="text-gray-600 leading-relaxed mb-5">{t('about.tagline')}</p>
            <div className="flex gap-3 flex-wrap mb-5">
              <Link href="/courses" className="btn-primary px-6 py-3 text-sm">{t('about.ctaCourses')}</Link>
              <a
                href="https://instagram.com/mycakealeks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-5 py-3 text-sm flex items-center gap-2"
              >
                📸 {social.instagram}
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://t.me/+A5Kjio0mbFYyNTMy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                style={{ background: '#e8f4fd', color: '#0088cc' }}
              >
                ✈️ {social.telegram}
              </a>
              <a
                href="https://t.me/tortodelnya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                style={{ background: '#e8f4fd', color: '#0088cc' }}
              >
                💬 {social.telegramChat}
              </a>
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
            style={{ background: '#fbeaf0', borderLeft: '4px solid #d4537e' }}
          >
            {mission}
          </blockquote>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="py-12 px-4" style={{ background: '#fafafa' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{FOR_WHOM_TITLE[locale] ?? FOR_WHOM_TITLE.ru}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {forWhom.map((text, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 flex items-start gap-4 border border-gray-100 shadow-sm"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: '#fbeaf0' }}
                >
                  {FOR_WHOM_ICONS[i]}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{OFFERS_TITLE[locale] ?? OFFERS_TITLE.ru}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {offers.map((offer, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-center border"
                style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff 100%)', borderColor: '#f0d0dc' }}
              >
                <p className="text-4xl mb-4">{offer.icon}</p>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{offer.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="py-10 px-4" style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff5f8 100%)' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{social.title}</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a
              href="https://instagram.com/mycakealeks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: 'linear-gradient(135deg,#f9c8d8,#d4537e)', color: '#fff' }}
            >
              📸 {social.instagram}
            </a>
            <a
              href="https://t.me/+A5Kjio0mbFYyNTMy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: '#0088cc', color: '#fff' }}
            >
              ✈️ {social.telegram}
            </a>
            <a
              href="https://t.me/tortodelnya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: '#229ed9', color: '#fff' }}
            >
              💬 {social.telegramChat}
            </a>
          </div>
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

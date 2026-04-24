import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import { formatPrice } from '@/app/lib/currency'

const SITE = 'https://mycakealeks.com.tr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    tr: 'Fiyatlar | MyCakeAleks',
    ru: 'Тарифы | MyCakeAleks',
    en: 'Pricing | MyCakeAleks',
  }
  return { title: titles[locale] ?? titles.tr }
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const PLAN_PRICES_TRY = { single: 490, bundle: 990, allaccess: 1990 }

  const plans = [
    {
      key: 'single',
      name: t('pricing.planSingle'),
      price: formatPrice(PLAN_PRICES_TRY.single, locale),
      period: t('pricing.perCourse'),
      popular: false,
      features: [
        { label: t('pricing.feat1Video'), ok: true },
        { label: t('pricing.feat2Cert'), ok: true },
        { label: t('pricing.feat3AI'), ok: false },
        { label: t('pricing.feat4AllCourses'), ok: false },
        { label: t('pricing.feat5Support'), ok: false },
      ],
      cta: t('pricing.ctaSingle'),
      href: '/courses',
    },
    {
      key: 'bundle',
      name: t('pricing.planBundle'),
      price: formatPrice(PLAN_PRICES_TRY.bundle, locale),
      period: t('pricing.per3Courses'),
      popular: true,
      features: [
        { label: t('pricing.feat1Video'), ok: true },
        { label: t('pricing.feat2Cert'), ok: true },
        { label: t('pricing.feat3AI'), ok: true },
        { label: t('pricing.feat4AllCourses'), ok: false },
        { label: t('pricing.feat5Support'), ok: true },
      ],
      cta: t('pricing.ctaBundle'),
      href: '/courses',
    },
    {
      key: 'allaccess',
      name: t('pricing.planAllAccess'),
      price: formatPrice(PLAN_PRICES_TRY.allaccess, locale),
      period: t('pricing.perYear'),
      popular: false,
      features: [
        { label: t('pricing.feat1Video'), ok: true },
        { label: t('pricing.feat2Cert'), ok: true },
        { label: t('pricing.feat3AI'), ok: true },
        { label: t('pricing.feat4AllCourses'), ok: true },
        { label: t('pricing.feat5Support'), ok: true },
      ],
      cta: t('pricing.ctaAllAccess'),
      href: '/courses',
    },
  ]

  const faqs = [
    { q: t('pricing.faq1q'), a: t('pricing.faq1a') },
    { q: t('pricing.faq2q'), a: t('pricing.faq2a') },
    { q: t('pricing.faq3q'), a: t('pricing.faq3a') },
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
            <Link href="/pricing" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.pricing')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-12 md:py-16 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#fff 100%)' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('pricing.title')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('pricing.subtitle')}</p>
      </section>

      {/* PLANS */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className="relative rounded-2xl p-6 flex flex-col"
              style={plan.popular
                ? { border: '2px solid #d4537e', background: '#fff' }
                : { border: '1.5px solid #e5e7eb', background: '#fff' }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white whitespace-nowrap"
                  style={{ background: '#d4537e' }}
                >
                  {t('pricing.mostPopular')}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-400 ml-1">/ {plan.period}</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span style={{ color: f.ok ? '#d4537e' : '#d1d5db' }}>{f.ok ? '✓' : '✗'}</span>
                    <span className={f.ok ? 'text-gray-700' : 'text-gray-400'}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href as any}
                className={plan.popular ? 'btn-primary w-full justify-center py-3' : 'btn-outline w-full justify-center py-3'}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON NOTE */}
      <section className="max-w-3xl mx-auto px-4 py-4 text-center">
        <p className="text-sm text-gray-400">{t('pricing.guarantee')}</p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('faq.title')}</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

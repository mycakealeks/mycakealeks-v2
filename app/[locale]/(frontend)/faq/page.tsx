'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

const FAQS: Record<string, Array<{ q: string; a: string }>> = {
  tr: [
    {
      q: 'MyCakeAleks kursları kimler için?',
      a: 'Başlangıçtan ileri seviyeye kadar herkes için uygundur. Hiç deneyiminiz olmasa bile temel kurslarımızla pasta yapımını öğrenebilirsiniz.',
    },
    {
      q: 'Sertifika alabilir miyim?',
      a: 'Evet, her kursu tamamladığınızda dijital sertifikanız otomatik olarak oluşturulur. Sertifikayı LinkedIn ve özgeçmişinizde kullanabilirsiniz.',
    },
    {
      q: 'Kurslar ne kadar sürer?',
      a: '3 ila 15 saat arasında değişir. Kendi hızınızda ilerleyebilirsiniz — dersler sınırsız süre erişime sahip, istediğiniz zaman tekrar izleyebilirsiniz.',
    },
    {
      q: 'Ödeme güvenli mi?',
      a: 'Evet, ödeme işlemleri dünya çapında güvenilir Stripe altyapısı üzerinden gerçekleştirilir. Kart bilgileriniz şifreli olarak korunur.',
    },
    {
      q: 'AI asistan nedir?',
      a: 'Claude AI destekli pasta asistanımız, tarif, teknik veya malzeme hakkındaki sorularınızı anında yanıtlar. 7/24 kullanılabilir ve Türkçe, Rusça, İngilizce konuşabilir.',
    },
    {
      q: 'İade politikası nedir?',
      a: 'Satın alma tarihinden itibaren 7 gün içinde herhangi bir sebep göstermeksizin tam iade talep edebilirsiniz. destek@mycakealeks.com.tr adresine yazmanız yeterlidir.',
    },
  ],
  ru: [
    {
      q: 'Для кого подходят курсы MyCakeAleks?',
      a: 'Курсы подходят для всех — от полных новичков до опытных кондитеров. Даже без опыта вы сможете освоить основы с нуля.',
    },
    {
      q: 'Получу ли я сертификат?',
      a: 'Да, после завершения каждого курса вы автоматически получаете цифровой сертификат. Его можно добавить в LinkedIn и резюме.',
    },
    {
      q: 'Сколько длятся курсы?',
      a: 'От 3 до 15 часов в зависимости от курса. Вы учитесь в собственном темпе — доступ к урокам бессрочный, можно пересматривать в любое время.',
    },
    {
      q: 'Безопасна ли оплата?',
      a: 'Да, все платежи обрабатываются через надёжную платформу Stripe. Данные вашей карты надёжно зашифрованы.',
    },
    {
      q: 'Что такое AI-ассистент?',
      a: 'Это кондитерский помощник на базе Claude AI, который мгновенно отвечает на вопросы о рецептах, техниках и ингредиентах. Доступен 24/7 на русском, турецком и английском языках.',
    },
    {
      q: 'Какова политика возврата?',
      a: 'Вы можете запросить полный возврат без объяснения причин в течение 7 дней с момента покупки. Напишите нам на support@mycakealeks.com.tr.',
    },
  ],
  en: [
    {
      q: 'Who are MyCakeAleks courses for?',
      a: 'Our courses are designed for everyone — from complete beginners to experienced bakers. No prior experience needed to get started.',
    },
    {
      q: 'Will I receive a certificate?',
      a: 'Yes, a digital certificate is automatically generated upon completing each course. You can share it on LinkedIn or add it to your resume.',
    },
    {
      q: 'How long do the courses take?',
      a: 'Courses range from 3 to 15 hours depending on the level. You learn at your own pace — lifetime access means you can rewatch any lesson anytime.',
    },
    {
      q: 'Is payment secure?',
      a: 'Absolutely. All payments are processed through Stripe, a globally trusted payment platform. Your card details are fully encrypted.',
    },
    {
      q: 'What is the AI assistant?',
      a: 'It\'s a pastry assistant powered by Claude AI that instantly answers your questions about recipes, techniques, and ingredients. Available 24/7 in Turkish, Russian, and English.',
    },
    {
      q: 'What is your refund policy?',
      a: 'You can request a full refund within 7 days of purchase, no questions asked. Just email us at support@mycakealeks.com.tr.',
    },
  ],
}

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-pink-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-base pr-4">{q}</span>
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200"
          style={{ background: '#fbeaf0', color: '#d4537e', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '300px' : '0px' }}
      >
        <p className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const t = useTranslations()
  const locale = useLocale()
  const faqs = FAQS[locale] ?? FAQS.tr
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/news" className="nav-link text-sm">{t('nav.news')}</Link>
            <Link href="/recipes" className="nav-link text-sm">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-10 md:py-14 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#fff 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-3xl mb-3">❓</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('faq.title')}</h1>
          <p className="text-gray-500 text-sm md:text-base">{t('faq.subtitle')}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 md:px-6 py-10 pb-20">
        {faqs.map((item, i) => (
          <AccordionItem
            key={i}
            q={item.q}
            a={item.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}

        {/* CTA */}
        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: '#fbeaf0' }}
        >
          <p className="font-semibold text-gray-900 mb-1">{t('faq.stillHaveQuestions')}</p>
          <p className="text-sm text-gray-500 mb-4">{t('faq.contactUs')}</p>
          <Link href="/courses" className="btn-primary px-6 py-2.5 text-sm">
            {t('nav.courses')} →
          </Link>
        </div>
      </section>
    </main>
  )
}

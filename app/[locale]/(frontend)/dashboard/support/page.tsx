'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'
import Sidebar from '@/app/[locale]/components/Sidebar'
import BottomNav from '@/app/[locale]/components/BottomNav'
import AuthGuard from '@/app/[locale]/components/AuthGuard'

const TEXT: Record<string, any> = {
  tr: {
    title: 'Destek',
    subtitle: 'Size nasıl yardımcı olabiliriz?',
    chatBtn: '💬 Canlı Destek Başlat',
    chatDesc: 'Ekibimizle gerçek zamanlı sohbet edin',
    emailTitle: 'E-posta ile Ulaşın',
    emailDesc: '24 saat içinde yanıt veririz',
    telegramTitle: 'Telegram Kanalı',
    telegramDesc: 'Duyurular ve güncellemeler için',
    faqTitle: 'Sık Sorulan Sorular',
    faqs: [
      {
        q: 'Kursu satın aldıktan sonra ne zaman erişebilirim?',
        a: 'Ödeme onaylandıktan hemen sonra kursunuza erişebilirsiniz. Hesabınıza giriş yapın ve "Kurslarım" bölümüne gidin.',
      },
      {
        q: 'Kursu tamamlamak için belirli bir süre var mı?',
        a: 'Hayır! Tüm kurslar ömür boyu erişimle sunulmaktadır. İstediğiniz zaman, istediğiniz hızda ilerleyebilirsiniz.',
      },
      {
        q: 'İade nasıl talep edebilirim?',
        a: 'Satın alma tarihinden itibaren 7 gün içinde ve kursun %20\'sinden azını izlediyseniz iade talep edebilirsiniz. support@mycakealeks.com.tr adresine yazın.',
      },
      {
        q: 'Sertifika alabilir miyim?',
        a: 'Evet! Kursu tamamladığınızda otomatik olarak dijital sertifikanız oluşturulur ve profilinizden indirebilirsiniz.',
      },
    ],
  },
  ru: {
    title: 'Поддержка',
    subtitle: 'Как мы можем вам помочь?',
    chatBtn: '💬 Открыть чат поддержки',
    chatDesc: 'Общайтесь с нашей командой в реальном времени',
    emailTitle: 'Напишите нам',
    emailDesc: 'Ответим в течение 24 часов',
    telegramTitle: 'Telegram-канал',
    telegramDesc: 'Новости и обновления платформы',
    faqTitle: 'Частые вопросы',
    faqs: [
      {
        q: 'Когда я получу доступ к курсу после оплаты?',
        a: 'Немедленно после подтверждения оплаты. Войдите в аккаунт и перейдите в раздел «Мои курсы».',
      },
      {
        q: 'Есть ли ограничение по времени для прохождения курса?',
        a: 'Нет! Все курсы предоставляются с пожизненным доступом. Учитесь в удобном для вас темпе.',
      },
      {
        q: 'Как оформить возврат?',
        a: 'Возврат возможен в течение 7 дней с момента покупки, если просмотрено менее 20% курса. Напишите на support@mycakealeks.com.tr.',
      },
      {
        q: 'Получу ли я сертификат?',
        a: 'Да! После завершения курса автоматически формируется цифровой сертификат, доступный для скачивания в профиле.',
      },
    ],
  },
  en: {
    title: 'Support',
    subtitle: 'How can we help you?',
    chatBtn: '💬 Start Live Chat',
    chatDesc: 'Chat with our team in real time',
    emailTitle: 'Email Us',
    emailDesc: 'We reply within 24 hours',
    telegramTitle: 'Telegram Channel',
    telegramDesc: 'Announcements and updates',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'When can I access my course after purchase?',
        a: 'Immediately after payment confirmation. Log in and go to "My Courses".',
      },
      {
        q: 'Is there a time limit to complete the course?',
        a: 'No! All courses come with lifetime access. Learn at your own pace.',
      },
      {
        q: 'How do I request a refund?',
        a: 'You can request a refund within 7 days of purchase if you\'ve watched less than 20% of the course. Email support@mycakealeks.com.tr.',
      },
      {
        q: 'Will I receive a certificate?',
        a: 'Yes! A digital certificate is automatically generated upon course completion and available for download in your profile.',
      },
    ],
  },
}

function SupportContent({ user }: { user: any }) {
  const locale = useLocale()
  const t = TEXT[locale] ?? TEXT.tr
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  const openCrisp = () => {
    const crisp = (window as any).$crisp
    if (crisp) {
      crisp.push(['do', 'chat:show'])
      crisp.push(['do', 'chat:open'])
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user.email} />
      <BottomNav />

      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t.title}</h1>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>

          {/* Contact options */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Live chat */}
            <button
              onClick={openCrisp}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left hover:border-pink-200 hover:shadow-md transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl"
                style={{ background: '#fbeaf0' }}
              >
                💬
              </div>
              <p className="font-bold text-gray-900 text-sm group-hover:text-pink-600 transition-colors">{t.chatBtn}</p>
              <p className="text-xs text-gray-500 mt-1">{t.chatDesc}</p>
            </button>

            {/* Email */}
            <a
              href="mailto:support@mycakealeks.com.tr"
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-pink-200 hover:shadow-md transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl"
                style={{ background: '#fbeaf0' }}
              >
                ✉️
              </div>
              <p className="font-bold text-gray-900 text-sm group-hover:text-pink-600 transition-colors">{t.emailTitle}</p>
              <p className="text-xs text-gray-500 mt-1">support@mycakealeks.com.tr</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.emailDesc}</p>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/mycakealeks"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-pink-200 hover:shadow-md transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl"
                style={{ background: '#fbeaf0' }}
              >
                📣
              </div>
              <p className="font-bold text-gray-900 text-sm group-hover:text-pink-600 transition-colors">{t.telegramTitle}</p>
              <p className="text-xs text-gray-500 mt-1">@mycakealeks</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.telegramDesc}</p>
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{t.faqTitle}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {t.faqs.map((faq: any, i: number) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                    <svg
                      width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      className="flex-shrink-0 transition-transform"
                      style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', color: '#d4537e' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SupportPage() {
  return <AuthGuard>{(user) => <SupportContent user={user} />}</AuthGuard>
}

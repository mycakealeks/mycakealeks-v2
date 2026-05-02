import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const SITE = 'https://mycakealeks.com.tr'

const META: Record<string, { title: string; description: string }> = {
  tr: {
    title: 'Kullanım Şartları | MyCakeAleks',
    description: 'MyCakeAleks kullanım şartları — platform kuralları, ödeme ve iade politikası, telif hakları.',
  },
  ru: {
    title: 'Условия использования | MyCakeAleks',
    description: 'Условия использования MyCakeAleks — правила платформы, оплата, возврат, авторские права.',
  },
  en: {
    title: 'Terms of Use | MyCakeAleks',
    description: 'MyCakeAleks terms of use — platform rules, payment and refund policy, intellectual property.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.tr
  const url = `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/terms`
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description, url, type: 'website' },
  }
}

const content: Record<string, { title: string; date: string; sections: { h: string; body: string }[] }> = {
  tr: {
    title: 'MyCakeAleks Kullanım Şartları',
    date: '1 Mayıs 2026',
    sections: [
      {
        h: '1. Hizmet Tanımı',
        body: 'MyCakeAleks, pastacılık sanatını öğrenmek isteyenlere yönelik çevrimiçi bir eğitim platformudur. Platform; video dersler, tarifler ve pratik teknikler aracılığıyla kapsamlı kurs içerikleri sunar.',
      },
      {
        h: '2. Kayıt ve Hesap',
        body: 'Platforma kayıt olabilmek için 18 yaşında veya daha büyük olmanız gerekmektedir. Hesap oluştururken doğru ve güncel bilgi vermeniz zorunludur. Hesabınızın güvenliğinden siz sorumlusunuz; şifrenizi başkalarıyla paylaşmamalısınız.',
      },
      {
        h: '3. Ödeme ve Erişim',
        body: 'Satın alınan kurslara ömür boyu erişim hakkı tanınır. Stripe güvenli ödeme altyapısı kullanılmaktadır. İade: kursun %20\'sinden azını izlemişseniz satın alma tarihinden itibaren 7 gün içinde iade talep edebilirsiniz. İade talepleri için support@mycakealeks.com.tr adresine yazın.',
      },
      {
        h: '4. Fikri Mülkiyet',
        body: "Platform üzerindeki tüm içerikler — video dersler, tarifler, görseller, metinler — MyCakeAleks'e aittir ve Türk ve uluslararası telif hakkı yasaları kapsamında korunmaktadır. İçeriklerin izinsiz kopyalanması, dağıtılması veya yayınlanması yasaktır.",
      },
      {
        h: '5. Yasaklı Kullanımlar',
        body: 'Şunlar kesinlikle yasaktır: kurs erişiminin üçüncü şahıslara devredilmesi veya satılması; video indirme araçları kullanılması; ticari amaçlı içerik kullanımı (izin alınmadan); platforma zarar verecek nitelikte yazılım veya araç kullanımı.',
      },
      {
        h: '6. Sorumluluk Sınırı',
        body: "MyCakeAleks, teknik arızalar, internet kesintisi veya mücbir sebepler nedeniyle oluşan erişim sorunlarından sorumlu tutulamaz. Platform \"olduğu gibi\" sunulmakta olup sürekli erişilebilirlik garanti edilmemektedir.",
      },
      {
        h: '7. Şartlarda Değişiklik',
        body: "MyCakeAleks bu şartları değiştirme hakkını saklı tutar. Önemli değişiklikler, yürürlüğe girmeden en az 30 gün önce kayıtlı e-posta adresinize bildirilir. Değişiklik sonrası platformu kullanmaya devam etmeniz yeni şartları kabul ettiğiniz anlamına gelir.",
      },
      {
        h: '8. İletişim',
        body: 'Sorularınız için: support@mycakealeks.com.tr',
      },
    ],
  },
  ru: {
    title: 'Условия использования MyCakeAleks',
    date: '1 мая 2026',
    sections: [
      {
        h: '1. Описание сервиса',
        body: 'MyCakeAleks — онлайн-платформа для обучения кондитерскому мастерству. Платформа предоставляет доступ к видеоурокам, рецептам и практическим техникам для всех уровней подготовки.',
      },
      {
        h: '2. Регистрация и аккаунт',
        body: 'Для регистрации необходимо быть старше 18 лет и предоставить достоверные данные. Вы несёте ответственность за безопасность своего аккаунта и обязуетесь не передавать доступ третьим лицам.',
      },
      {
        h: '3. Оплата и доступ',
        body: 'После оплаты предоставляется пожизненный доступ к приобретённому курсу. Оплата обрабатывается через Stripe. Возврат средств: возможен в течение 7 дней с момента покупки, если просмотрено менее 20% курса. Для оформления возврата: support@mycakealeks.com.tr.',
      },
      {
        h: '4. Авторские права',
        body: 'Все материалы платформы — видеоуроки, рецепты, изображения, тексты — являются собственностью MyCakeAleks и защищены законодательством об авторском праве. Копирование, распространение или публикация без письменного разрешения запрещены.',
      },
      {
        h: '5. Запрещённые действия',
        body: 'Строго запрещено: перепродажа или передача доступа к курсам; скачивание видеоматериалов любыми способами; использование материалов в коммерческих целях без разрешения; любые действия, нарушающие работу платформы.',
      },
      {
        h: '6. Ответственность',
        body: 'MyCakeAleks не несёт ответственности за технические сбои, перебои в интернете или форс-мажорные обстоятельства. Платформа предоставляется «как есть» без гарантии непрерывной доступности.',
      },
      {
        h: '7. Изменение условий',
        body: 'MyCakeAleks вправе изменять настоящие условия. Существенные изменения уведомляются на зарегистрированный email не менее чем за 30 дней до вступления в силу. Продолжение использования платформы после изменений означает согласие с новыми условиями.',
      },
      {
        h: '8. Контакт',
        body: 'По вопросам: support@mycakealeks.com.tr',
      },
    ],
  },
  en: {
    title: 'MyCakeAleks Terms of Use',
    date: 'May 1, 2026',
    sections: [
      {
        h: '1. Service Description',
        body: 'MyCakeAleks is an online learning platform dedicated to the art of pastry and cake making. The platform provides access to video lessons, recipes and practical techniques for all skill levels.',
      },
      {
        h: '2. Registration and Account',
        body: 'You must be at least 18 years old to register. You agree to provide accurate and up-to-date information when creating an account. You are responsible for the security of your account and must not share access credentials with others.',
      },
      {
        h: '3. Payment and Access',
        body: 'Upon purchase, you receive lifetime access to the course. Payments are securely processed via Stripe. Refunds: you may request a refund within 7 days of purchase if you have viewed less than 20% of the course. For refund requests: support@mycakealeks.com.tr.',
      },
      {
        h: '4. Intellectual Property',
        body: 'All content on the platform — video lessons, recipes, images, and text — is owned by MyCakeAleks and protected by Turkish and international copyright law. Copying, distributing or publishing content without written permission is strictly prohibited.',
      },
      {
        h: '5. Prohibited Activities',
        body: 'The following are strictly prohibited: reselling or transferring course access to third parties; downloading video content by any means; using content for commercial purposes without permission; any action that disrupts or harms the platform.',
      },
      {
        h: '6. Limitation of Liability',
        body: 'MyCakeAleks is not liable for technical failures, internet outages or force majeure events. The platform is provided "as is" without guaranteed continuous availability.',
      },
      {
        h: '7. Changes to Terms',
        body: 'MyCakeAleks reserves the right to modify these terms. Significant changes will be communicated to your registered email at least 30 days before taking effect. Continued use of the platform after changes constitutes acceptance of the updated terms.',
      },
      {
        h: '8. Contact',
        body: 'For inquiries: support@mycakealeks.com.tr',
      },
    ],
  },
}

export default async function TermsPage() {
  const locale = await getLocale()
  const c = content[locale] ?? content.tr
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`
  const breadcrumbHome = locale === 'ru' ? 'Главная' : locale === 'en' ? 'Home' : 'Ana Sayfa'
  const breadcrumbSelf = locale === 'ru' ? 'Условия использования' : locale === 'en' ? 'Terms of Use' : 'Kullanım Şartları'

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-lg font-extrabold">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-pink-600 transition-colors">{breadcrumbHome}</Link>
          <span>/</span>
          <span className="text-gray-600">{breadcrumbSelf}</span>
        </div>

        <p className="text-sm text-gray-400 mb-2">{c.date}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ color: '#d4537e' }}>
          {c.title}
        </h1>

        <div className="space-y-8">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.h}</h2>
              <p className="text-gray-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm font-semibold" style={{ color: '#d4537e' }}>
            ← {breadcrumbHome}
          </Link>
        </div>
      </div>
    </main>
  )
}

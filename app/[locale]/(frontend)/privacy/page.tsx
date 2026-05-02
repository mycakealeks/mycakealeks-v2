import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const SITE = 'https://mycakealeks.com.tr'

const META: Record<string, { title: string; description: string }> = {
  tr: {
    title: 'Gizlilik Politikası | MyCakeAleks',
    description: 'MyCakeAleks gizlilik politikası — kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi.',
  },
  ru: {
    title: 'Политика конфиденциальности | MyCakeAleks',
    description: 'Политика конфиденциальности MyCakeAleks — как мы собираем, используем и защищаем ваши персональные данные.',
  },
  en: {
    title: 'Privacy Policy | MyCakeAleks',
    description: 'MyCakeAleks privacy policy — how we collect, use and protect your personal data.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.tr
  const url = `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/privacy`
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description, url, type: 'website' },
  }
}

const content: Record<string, { title: string; date: string; sections: { h: string; body: string }[] }> = {
  tr: {
    title: 'MyCakeAleks Gizlilik Politikası',
    date: '1 Mayıs 2026',
    sections: [
      {
        h: '1. Topladığımız Veriler',
        body: 'Ad-soyad ve e-posta adresi; ödeme bilgileri (Stripe aracılığıyla işlenir, kart numarası tarafımızca saklanmaz); kurs izleme geçmişi ve ilerleme durumu; IP adresi ve cihaz bilgileri.',
      },
      {
        h: '2. Verilerin Kullanım Amacı',
        body: 'Satın alınan kurslara erişim sağlamak; e-posta bildirimleri ve kampanya duyuruları göndermek (abonelikten çıkma hakkınız saklıdır); platformu geliştirmek ve kullanıcı deneyimini iyileştirmek; Google Analytics 4 ve Yandex Metrika ile anonim kullanım istatistikleri toplamak.',
      },
      {
        h: '3. Verilerin Saklanması',
        body: "Verileriniz Avrupa'daki sunucularda (Hetzner, Almanya) barındırılmakta ve endüstri standardı şifreleme ile korunmaktadır. Aktif hesabınız olduğu sürece verileriniz saklanır; hesap silme talebinde 30 gün içinde kişisel verileriniz silinir.",
      },
      {
        h: '4. Üçüncü Taraflarla Paylaşım',
        body: 'Verilerinizi yalnızca hizmet sunmak için gerekli iş ortaklarıyla paylaşırız: Stripe (ödeme işlemleri), Bunny.net (video içerikleri), Resend (e-posta gönderimi), Google Analytics (anonim istatistikler). Verilerinizi hiçbir koşulda satmayız.',
      },
      {
        h: '5. Kullanıcı Hakları (KVKK)',
        body: 'Türkiye Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında: verilerinizin işlenip işlenmediğini öğrenme, erişim talep etme, düzeltme veya silme talep etme ve veri taşınabilirliği haklarına sahipsiniz. Talepler için: support@mycakealeks.com.tr',
      },
      {
        h: '6. Çerezler (Cookies)',
        body: 'Oturum yönetimi için zorunlu çerezler kullanırız (payload-token). Analitik amaçlarla Google Analytics ve Yandex Metrika çerezleri kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz; ancak zorunlu çerezlerin devre dışı bırakılması oturum açma işlevini etkileyebilir.',
      },
      {
        h: '7. Uygulanacak Hukuk',
        body: "Bu politika Türkiye Cumhuriyeti hukuku (KVKK) ve AB GDPR düzenlemeleri çerçevesinde hazırlanmıştır. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.",
      },
      {
        h: '8. İletişim',
        body: 'Gizlilik konusundaki sorularınız için: support@mycakealeks.com.tr',
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности MyCakeAleks',
    date: '1 мая 2026',
    sections: [
      {
        h: '1. Какие данные мы собираем',
        body: 'Имя, фамилия и адрес электронной почты; платёжные данные (обрабатываются через Stripe, номер карты нами не хранится); история просмотров курсов и прогресс обучения; IP-адрес и информация об устройстве.',
      },
      {
        h: '2. Как мы используем данные',
        body: 'Предоставление доступа к приобретённым курсам; отправка email-уведомлений и новостей платформы (с возможностью отписки); улучшение платформы и пользовательского опыта; сбор анонимной статистики через Google Analytics 4 и Яндекс Метрику.',
      },
      {
        h: '3. Хранение данных',
        body: 'Ваши данные хранятся на серверах в Европе (Hetzner, Германия) и защищены промышленным шифрованием. Данные хранятся, пока ваш аккаунт активен. После запроса на удаление аккаунта персональные данные удаляются в течение 30 дней.',
      },
      {
        h: '4. Передача третьим лицам',
        body: 'Мы передаём данные только партнёрам, необходимым для работы сервиса: Stripe (обработка платежей), Bunny.net (видеоконтент), Resend (email-рассылки), Google Analytics (анонимная статистика). Мы никогда не продаём ваши данные.',
      },
      {
        h: '5. Права пользователя (GDPR)',
        body: 'В соответствии с GDPR вы имеете право: запросить копию своих данных, исправить неточные данные, удалить аккаунт и все связанные данные, отписаться от любых рассылок. Для реализации прав: support@mycakealeks.com.tr',
      },
      {
        h: '6. Cookie-файлы',
        body: 'Мы используем обязательные cookie для авторизации (payload-token). Для аналитики используются cookie Google Analytics и Яндекс Метрики. Вы можете управлять cookie в настройках браузера; отключение обязательных cookie влияет на вход в аккаунт.',
      },
      {
        h: '7. Применимое право',
        body: 'Настоящая политика разработана в соответствии с законодательством Турции (KVKK) и требованиями GDPR. Споры рассматриваются в судах Стамбула.',
      },
      {
        h: '8. Контакт',
        body: 'По вопросам конфиденциальности: support@mycakealeks.com.tr',
      },
    ],
  },
  en: {
    title: 'MyCakeAleks Privacy Policy',
    date: 'May 1, 2026',
    sections: [
      {
        h: '1. Data We Collect',
        body: 'First and last name, email address; payment information (processed via Stripe — we do not store card numbers); course viewing history and progress; IP address and device information.',
      },
      {
        h: '2. How We Use Your Data',
        body: 'To provide access to purchased courses; to send email notifications and platform updates (you may unsubscribe at any time); to improve the platform and user experience; to collect anonymous usage statistics via Google Analytics 4 and Yandex Metrica.',
      },
      {
        h: '3. Data Storage',
        body: 'Your data is hosted on servers in Europe (Hetzner, Germany) and protected with industry-standard encryption. Data is retained while your account is active. Upon account deletion request, personal data is removed within 30 days.',
      },
      {
        h: '4. Sharing with Third Parties',
        body: 'We share data only with service partners necessary to operate the platform: Stripe (payment processing), Bunny.net (video delivery), Resend (email delivery), Google Analytics (anonymous statistics). We never sell your data.',
      },
      {
        h: '5. Your Rights (GDPR)',
        body: 'Under GDPR, you have the right to: access a copy of your data, correct inaccurate data, request deletion of your account and all related data, unsubscribe from any communications. To exercise your rights: support@mycakealeks.com.tr',
      },
      {
        h: '6. Cookies',
        body: 'We use essential cookies for authentication (payload-token). Analytics cookies from Google Analytics and Yandex Metrica are also used. You can manage cookies through your browser settings; disabling essential cookies may affect login functionality.',
      },
      {
        h: '7. Governing Law',
        body: 'This policy is governed by Turkish law (KVKK) and EU GDPR regulations. Disputes shall be subject to the jurisdiction of Istanbul courts.',
      },
      {
        h: '8. Contact',
        body: 'For privacy-related inquiries: support@mycakealeks.com.tr',
      },
    ],
  },
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  const c = content[locale] ?? content.tr
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`
  const breadcrumbHome = locale === 'ru' ? 'Главная' : locale === 'en' ? 'Home' : 'Ana Sayfa'
  const breadcrumbSelf = locale === 'ru' ? 'Политика конфиденциальности' : locale === 'en' ? 'Privacy Policy' : 'Gizlilik Politikası'

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

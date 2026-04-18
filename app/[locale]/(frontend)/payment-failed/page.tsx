import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default async function PaymentFailedPage() {
  const t = await getTranslations('payment')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <LanguageSwitcher />
      </nav>

      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">😞</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('failed')}</h1>
        <p className="text-gray-500 mb-8">{t('failedDesc')}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/courses"
            className="inline-block border border-pink-600 text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition"
          >
            {t('backToCourses')}
          </Link>
          <Link
            href="/checkout"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            {t('tryAgain')}
          </Link>
        </div>
      </div>
    </main>
  )
}

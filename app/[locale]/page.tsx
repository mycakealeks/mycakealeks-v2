import Link from 'next/link'
import { useTranslations } from 'next-intl'
import AiChat from './components/AiChat'

export default function HomePage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-2xl font-bold text-pink-600">MyCakeAleks</h1>
        <div className="flex gap-4">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">
            {t('nav.courses')}
          </Link>
          <Link href="/recipes" className="text-gray-600 hover:text-pink-600">
            {t('nav.recipes')}
          </Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
            {t('nav.login')}
          </Link>
        </div>
      </nav>

      <section className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          {t('home.title')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('home.subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/courses" className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-pink-700">
            {t('nav.courses')}
          </Link>
          <Link href="/recipes" className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg text-lg hover:bg-pink-50">
            {t('nav.recipes')}
          </Link>
        </div>
      </section>

      <AiChat />
    </main>
  )
}

import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'

export default async function RecipesPage() {
  const t = await getTranslations()

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">{t('nav.courses')}</Link>
          <Link href="/recipes" className="text-pink-600 font-semibold">{t('nav.recipes')}</Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">{t('nav.login')}</Link>
          <LanguageSwitcher />
        </div>
      </nav>
      <section className="py-12 px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('recipes.title')}</h1>
        <p className="text-gray-600 text-lg">{t('recipes.comingSoon')}</p>
      </section>
    </main>
  )
}

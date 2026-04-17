import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
  const t = await getTranslations()

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4 items-center">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">{t('nav.courses')}</Link>
          <Link href="/recipes" className="text-gray-600 hover:text-pink-600">{t('nav.recipes')}</Link>
          <button className="border border-pink-600 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50">
            {t('nav.logout')}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mb-8">{t('dashboard.welcome')}</p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">🎂</div>
            <h3 className="font-bold text-lg">{t('dashboard.myCourses')}</h3>
            <p className="text-gray-500 text-sm">{t('dashboard.noCoursesCount')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-bold text-lg">{t('dashboard.myRecipes')}</h3>
            <p className="text-gray-500 text-sm">{t('dashboard.noRecipesCount')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-lg">{t('dashboard.aiAssistant')}</h3>
            <p className="text-gray-500 text-sm">{t('dashboard.aiAsk')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.myCourses')}</h2>
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎂</div>
            <p>{t('dashboard.noCoursesText')}</p>
            <Link href="/courses" className="text-pink-600 font-semibold hover:underline mt-2 block">
              {t('dashboard.goToCourses')}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.aiAssistant')}</h2>
          <div className="border rounded-lg p-4 h-48 bg-gray-50 flex items-center justify-center text-gray-400">
            {t('dashboard.aiLocked')}
          </div>
        </div>
      </div>
    </main>
  )
}

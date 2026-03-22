import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Навигация */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-2xl font-bold text-pink-600">MyCakeAleks</h1>
        <div className="flex gap-4">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">Курсы</Link>
          <Link href="/recipes" className="text-gray-600 hover:text-pink-600">Рецепты</Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Войти</Link>
        </div>
      </nav>

      {/* Hero секция */}
      <section className="text-center py-20 px-8">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Научись создавать<br />идеальные торты
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Профессиональные курсы и рецепты кондитерского искусства для турецкого рынка
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/courses" className="bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-700">
            Смотреть курсы
          </Link>
          <Link href="/recipes" className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-50">
            Рецепты
          </Link>
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🎂</div>
            <h3 className="text-xl font-bold mb-2">Профессиональные курсы</h3>
            <p className="text-gray-600">Видео уроки от опытных кондитеров</p>
          </div>
          <div>
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-2">Рецепты с PDF</h3>
            <p className="text-gray-600">Скачивай и готовь в любое время</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-помощник</h3>
            <p className="text-gray-600">Ответы на вопросы по рецептам</p>
          </div>
        </div>
      </section>
    </main>
  )
}

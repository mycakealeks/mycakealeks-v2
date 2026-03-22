import Link from 'next/link'

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4">
          <Link href="/courses" className="text-gray-600 hover:text-pink-600">Курсы</Link>
          <Link href="/recipes" className="text-pink-600 font-semibold">Рецепты</Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Войти</Link>
        </div>
      </nav>
      <section className="py-12 px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Рецепты</h1>
        <p className="text-gray-600 text-lg">Скоро здесь появятся рецепты</p>
      </section>
    </main>
  )
}

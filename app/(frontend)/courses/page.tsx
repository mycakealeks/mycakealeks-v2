import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function CoursesPage() {
  const payload = await getPayload({ config })

  const { docs: courses } = await payload.find({
    collection: 'courses',
    limit: 12,
  })

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <Link href="/" className="text-2xl font-bold text-pink-600">MyCakeAleks</Link>
        <div className="flex gap-4">
          <Link href="/courses" className="text-pink-600 font-semibold">Курсы</Link>
          <Link href="/recipes" className="text-gray-600 hover:text-pink-600">Рецепты</Link>
          <Link href="/login" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Войти</Link>
        </div>
      </nav>

      <section className="py-12 px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Курсы</h1>
        <p className="text-gray-600 text-lg">Профессиональные курсы кондитерского искусства</p>
      </section>

      <section className="px-8 pb-16">
        {courses.length === 0 ? (
          <p className="text-gray-500 text-lg">Курсы пока не добавлены</p>
        ) : (
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {courses.map((course: any) => (
              <div key={course.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-pink-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">🎂</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {typeof course.description === 'string'
                      ? course.description
                      : 'Профессиональный курс'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600 font-bold text-xl">
                      ${course.price || '49'}
                    </span>
                    <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm">
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

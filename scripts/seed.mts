import { getPayload } from 'payload'
import config from '../payload.config.js'

const COURSES = [
  {
    title: 'Temel Pasta Teknikleri',
    slug: 'temel-pasta-teknikleri',
    description: 'Pastacılığa yeni başlayanlar için temel teknikler: hamur hazırlama, krema yapımı, kek katmanlama ve basit süsleme yöntemleri. Sıfırdan başlayıp güzel pastalar yapmayı öğrenin.',
    price: 490,
    oldPrice: 890,
    level: 'beginner',
    emoji: '🎂',
    status: 'published',
    lessons: [
      { title: 'Giriş: Pastacılığa Hoş Geldiniz', order: 1, isFree: true, videoDuration: 8 },
      { title: 'Temel Ekipmanlar ve Malzemeler', order: 2, isFree: true, videoDuration: 12 },
      { title: 'Bisküvi Hamuru Hazırlama', order: 3, isFree: false, videoDuration: 20 },
    ],
  },
  {
    title: 'Fransız Pastacılık Sanatı',
    slug: 'fransiz-pastaciligi',
    description: 'Fransız pastacılığının inceliklerini keşfedin: choux hamuru, mousse kekler, ganache yapımı ve profesyonel süsleme teknikleri. Orta seviye için tasarlanmış kapsamlı bir program.',
    price: 790,
    oldPrice: 1290,
    level: 'intermediate',
    emoji: '🥐',
    status: 'published',
    lessons: [
      { title: 'Fransız Pastacılığına Giriş', order: 1, isFree: true, videoDuration: 10 },
      { title: 'Choux Hamuru ve Profiterol', order: 2, isFree: false, videoDuration: 25 },
      { title: 'Çikolatalı Mousse Cake', order: 3, isFree: false, videoDuration: 30 },
    ],
  },
  {
    title: 'Wedding Cake Uzmanlığı',
    slug: 'wedding-cake-uzmanlik',
    description: 'Düğün pastası yapımında uzmanlaşın: çok katmanlı pastalar, fondant kaplama, çiçek süsleme, taşıma ve kurulum teknikleri. Profesyonel düzeyde düğün pastacısı olun.',
    price: 1190,
    oldPrice: 1890,
    level: 'advanced',
    emoji: '💒',
    status: 'published',
    lessons: [
      { title: 'Düğün Pastası Tasarım Temelleri', order: 1, isFree: true, videoDuration: 15 },
      { title: 'Fondant ile Kaplama Teknikleri', order: 2, isFree: false, videoDuration: 35 },
      { title: 'Şeker Çiçek Yapımı', order: 3, isFree: false, videoDuration: 40 },
    ],
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding demo content...')

  for (const courseData of COURSES) {
    const { lessons, ...courseFields } = courseData

    // Delete existing course with this slug
    const existing = await payload.find({
      collection: 'courses',
      where: { slug: { equals: courseFields.slug } },
      limit: 1,
    })
    for (const doc of existing.docs) {
      // Delete related lessons first
      await payload.delete({ collection: 'lessons', where: { course: { equals: doc.id } } })
      await payload.delete({ collection: 'courses', id: doc.id })
    }

    const course = await payload.create({
      collection: 'courses',
      data: courseFields as any,
    })
    console.log(`  ✓ Course: ${course.title}`)

    for (const lessonData of lessons) {
      await payload.create({
        collection: 'lessons',
        data: {
          ...lessonData,
          course: course.id,
          videoId: 'demo-video-id',
          videoStatus: 'ready',
        } as any,
      })
      console.log(`    · Lesson: ${lessonData.title}`)
    }
  }

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

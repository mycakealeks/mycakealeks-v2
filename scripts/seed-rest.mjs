#!/usr/bin/env node
/**
 * REST-based seed script. Requires the Next.js server to be running.
 * Usage: node scripts/seed-rest.mjs
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@mycakealeks.com'
const ADMIN_PASS = process.env.SEED_ADMIN_PASS || 'Admin123!'

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

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`API ${path} failed: ${JSON.stringify(data)}`)
  return data
}

async function seed() {
  console.log(`🌱 Seeding via REST API at ${BASE}`)

  // Login
  let token
  try {
    const login = await api('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
    })
    token = login.token
    console.log(`  ✓ Logged in as ${ADMIN_EMAIL}`)
  } catch (e) {
    console.log(`  ✗ Login failed: ${e.message}`)
    console.log(`  → First create an admin user at ${BASE}/admin`)
    process.exit(1)
  }

  const headers = { Authorization: `JWT ${token}` }

  for (const courseData of COURSES) {
    const { lessons, ...courseFields } = courseData

    // Check if exists and delete
    const existing = await fetch(`${BASE}/api/courses?where[slug][equals]=${courseFields.slug}&limit=1`, { headers })
    const existingData = await existing.json()
    for (const doc of existingData.docs || []) {
      // Delete lessons
      const lRes = await fetch(`${BASE}/api/lessons?where[course][equals]=${doc.id}&limit=100`, { headers })
      const lData = await lRes.json()
      for (const lesson of lData.docs || []) {
        await fetch(`${BASE}/api/lessons/${lesson.id}`, { method: 'DELETE', headers })
      }
      await fetch(`${BASE}/api/courses/${doc.id}`, { method: 'DELETE', headers })
    }

    // Create course
    const course = await api('/api/courses', {
      method: 'POST',
      headers,
      body: JSON.stringify(courseFields),
    })
    const courseId = course.doc?.id
    console.log(`  ✓ Course: ${courseFields.title} (${courseId})`)

    // Create lessons
    for (const lessonData of lessons) {
      await api('/api/lessons', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...lessonData, course: courseId, videoId: 'demo-video-id', videoStatus: 'ready' }),
      })
      console.log(`    · Lesson: ${lessonData.title}`)
    }
  }

  console.log('✅ Seed complete!')
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e.message)
  process.exit(1)
})

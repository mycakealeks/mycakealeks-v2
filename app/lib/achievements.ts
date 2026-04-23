import { getPayload } from 'payload'
import config from '@payload-config'

const BADGE_META: Record<string, { emoji: string; label: Record<string, string> }> = {
  first_lesson:  { emoji: '🎯', label: { tr: 'İlk Ders', ru: 'Первый урок', en: 'First Lesson' } },
  first_course:  { emoji: '🎓', label: { tr: 'İlk Kurs', ru: 'Первый курс', en: 'First Course' } },
  streak_7days:  { emoji: '🔥', label: { tr: '7 Gün', ru: '7 дней', en: '7 Day Streak' } },
  streak_30days: { emoji: '🔥', label: { tr: '30 Gün', ru: '30 дней', en: '30 Day Streak' } },
  vip_student:   { emoji: '💎', label: { tr: 'VIP Öğrenci', ru: 'VIP Студент', en: 'VIP Student' } },
  all_courses:   { emoji: '🏆', label: { tr: 'Usta', ru: 'Мастер', en: 'Master' } },
}

export { BADGE_META }

async function hasAchievement(payload: any, userId: string | number, type: string): Promise<boolean> {
  const { totalDocs } = await payload.find({
    collection: 'achievements',
    where: { user: { equals: userId }, type: { equals: type } },
    limit: 1,
    overrideAccess: true,
  })
  return totalDocs > 0
}

async function award(payload: any, userId: string | number, type: string) {
  if (await hasAchievement(payload, userId, type)) return
  await payload.create({
    collection: 'achievements',
    data: { user: userId as any, type, earnedAt: new Date().toISOString() },
    overrideAccess: true,
  })
}

export async function checkAndAwardAchievements(userId: string | number) {
  const payload = await getPayload({ config })

  // progress records for this user
  const { docs: progressDocs } = await payload.find({
    collection: 'progress',
    where: { user: { equals: userId }, completed: { equals: true } },
    limit: 1000,
    overrideAccess: true,
  })

  const completedLessons = progressDocs.length

  // first_lesson
  if (completedLessons >= 1) await award(payload, userId, 'first_lesson')

  // get purchased courses
  const user = await payload.findByID({ collection: 'users', id: userId as any, overrideAccess: true })
  const purchasedCourses: any[] = user?.purchasedCourses || []
  const purchasedCount = purchasedCourses.length

  // vip_student — 3+ courses
  if (purchasedCount >= 3) await award(payload, userId, 'vip_student')

  // first_course — at least one course with all lessons done
  const { docs: allCourses } = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    limit: 100,
    overrideAccess: true,
  })

  let finishedCourseCount = 0
  for (const course of allCourses) {
    const { docs: lessons } = await payload.find({
      collection: 'lessons',
      where: { course: { equals: course.id } },
      limit: 100,
      overrideAccess: true,
    })
    if (lessons.length === 0) continue
    const completedForCourse = progressDocs.filter((p: any) => {
      const lessonId = typeof p.lesson === 'object' ? p.lesson.id : p.lesson
      return lessons.some((l: any) => l.id === lessonId)
    }).length
    if (completedForCourse >= lessons.length) finishedCourseCount++
  }

  if (finishedCourseCount >= 1) await award(payload, userId, 'first_course')
  if (allCourses.length > 0 && finishedCourseCount >= allCourses.length) await award(payload, userId, 'all_courses')
}

export async function getUserAchievements(userId: string | number) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'achievements',
    where: { user: { equals: userId } },
    sort: '-earnedAt',
    overrideAccess: true,
  })
  return docs
}

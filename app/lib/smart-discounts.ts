import { getPayload } from 'payload'
import config from '@payload-config'

export interface SmartDiscount {
  courseId: string
  courseTitle: string
  courseSlug: string
  percent: number
  reason: string
  scenario: string
  expiresAt: string
}

export async function getSmartDiscounts(userId: string): Promise<SmartDiscount[]> {
  const payload = await getPayload({ config })
  const now = new Date()
  const expiresDay = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const discounts: SmartDiscount[] = []

  try {
    const [userRes, viewRes, lastEventRes] = await Promise.all([
      (payload as any).findByID({ collection: 'users', id: userId }),
      (payload as any).find({
        collection: 'user-events',
        where: { and: [{ user: { equals: userId } }, { event: { equals: 'course_view' } }] },
        limit: 20,
        sort: '-createdAt',
      }),
      (payload as any).find({
        collection: 'user-events',
        where: { user: { equals: userId } },
        limit: 1,
        sort: '-createdAt',
      }),
    ])

    const user = userRes as any
    const purchasedIds: string[] = (user?.purchasedCourses ?? []).map((c: any) =>
      typeof c === 'object' ? String(c.id) : String(c),
    )

    const viewedIds = [
      ...new Set((viewRes.docs as any[]).map((e: any) => e.entityId).filter(Boolean)),
    ] as string[]

    // Scenario 3: return user (7+ days inactive) — boosts all discounts to 10%
    let returnUserBoost = false
    if (lastEventRes.docs.length > 0) {
      const lastDate = new Date((lastEventRes.docs[0] as any).createdAt)
      const daysSince = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince >= 7) returnUserBoost = true
    }

    // Scenario 1: viewed but not purchased → 15% discount
    for (const courseId of viewedIds) {
      if (purchasedIds.includes(courseId)) continue
      try {
        const course = await (payload as any).findByID({ collection: 'courses', id: courseId })
        if (!course?.title) continue
        discounts.push({
          courseId: String(course.id),
          courseTitle: course.title,
          courseSlug: course.slug ?? course.id,
          percent: returnUserBoost ? Math.max(15, 10) : 15,
          reason: 'viewed_not_purchased',
          scenario: returnUserBoost ? '1+3' : '1',
          expiresAt: expiresDay.toISOString(),
        })
      } catch { /* skip missing courses */ }
    }

    // Deduplicate by courseId
    const seen = new Set<string>()
    return discounts.filter((d) => {
      if (seen.has(d.courseId)) return false
      seen.add(d.courseId)
      return true
    }).slice(0, 5)
  } catch (err) {
    console.error('smart-discounts error:', err)
    return []
  }
}

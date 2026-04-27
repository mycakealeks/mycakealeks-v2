import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Link } from '@/i18n/navigation'

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
    return JSON.parse(Buffer.from(padded, 'base64').toString())
  } catch { return null }
}

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Auth: admin only
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const jwtPayload = token ? decodeJwt(token) : null

  if (!jwtPayload) {
    redirect(`/${locale}/login`)
  }

  const payload = await getPayload({ config })
  const userRes = await (payload as any).findByID({ collection: 'users', id: jwtPayload.id as string })
  if (userRes?.role !== 'admin') {
    redirect(`/${locale}/dashboard`)
  }

  // Fetch analytics data
  const now = new Date()
  const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    allEvents,
    recentEvents,
    allCourses,
    allOrders,
  ] = await Promise.all([
    (payload as any).find({ collection: 'user-events', limit: 1000, sort: '-createdAt' }),
    (payload as any).find({
      collection: 'user-events',
      where: { createdAt: { greater_than: day7.toISOString() } },
      limit: 1000,
      sort: '-createdAt',
    }),
    payload.find({ collection: 'courses', limit: 50 }),
    payload.find({ collection: 'orders', limit: 200, sort: '-createdAt' }),
  ])

  const events: any[] = allEvents.docs ?? []
  const recent: any[] = recentEvents.docs ?? []
  const courses: any[] = (allCourses.docs ?? []) as any[]
  const orders: any[] = (allOrders.docs ?? []) as any[]

  // Top viewed courses
  const viewCounts: Record<string, number> = {}
  events.filter((e) => e.event === 'course_view').forEach((e) => {
    if (e.entityId) viewCounts[e.entityId] = (viewCounts[e.entityId] ?? 0) + 1
  })

  // Cart counts
  const cartCounts: Record<string, number> = {}
  events.filter((e) => e.event === 'add_to_cart').forEach((e) => {
    if (e.entityId) cartCounts[e.entityId] = (cartCounts[e.entityId] ?? 0) + 1
  })

  // Purchase counts from orders
  const purchaseCounts: Record<string, number> = {}
  orders.forEach((order) => {
    (order.items ?? []).forEach((item: any) => {
      const cId = typeof item.course === 'object' ? String(item.course?.id) : String(item.course ?? '')
      if (cId) purchaseCounts[cId] = (purchaseCounts[cId] ?? 0) + 1
    })
  })

  const topCourses = courses
    .map((c) => ({
      id: String(c.id),
      title: c.title,
      views: viewCounts[String(c.id)] ?? 0,
      carts: cartCounts[String(c.id)] ?? 0,
      purchases: purchaseCounts[String(c.id)] ?? 0,
    }))
    .filter((c) => c.views > 0 || c.purchases > 0)
    .sort((a, b) => b.views - a.views)

  // Activity by day (last 7 days)
  const dayLabels: string[] = []
  const dayCounts: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const label = d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
    dayLabels.push(label)
    const count = recent.filter((e) => {
      const ed = new Date(e.createdAt)
      return ed.toDateString() === d.toDateString()
    }).length
    dayCounts.push(count)
  }

  const maxDayCount = Math.max(...dayCounts, 1)

  // Funnel
  const totalVisits = events.filter((e) => e.event === 'page_view').length
  const totalCourseViews = events.filter((e) => e.event === 'course_view').length
  const totalCarts = events.filter((e) => e.event === 'add_to_cart').length
  const totalPurchases = orders.length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold" style={{ color: '#d4537e' }}>
            MyCakeAleks <span className="text-xs text-gray-400 font-normal">Admin Analytics</span>
          </Link>
          <Link href={`/${locale}/dashboard` as any} className="text-sm text-gray-500 hover:text-gray-800">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Funnel */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">📊 Conversion Funnel</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Page Views', value: totalVisits, icon: '👁' },
              { label: 'Course Views', value: totalCourseViews, icon: '📚' },
              { label: 'Add to Cart', value: totalCarts, icon: '🛒' },
              { label: 'Purchases', value: totalPurchases, icon: '💳' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activity chart */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">📈 Activity — last 7 days</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-end gap-3 h-40">
              {dayCounts.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{count}</span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max((count / maxDayCount) * 120, 4)}px`,
                      background: '#d4537e',
                      opacity: 0.8,
                    }}
                  />
                  <span className="text-xs text-gray-400 text-center leading-tight" style={{ fontSize: 10 }}>
                    {dayLabels[i].split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top courses */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">🎂 Course Performance</h2>
          {topCourses.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-gray-400">No tracking data yet. Events will appear as users browse.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-500">Course</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">Views</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">Carts</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">Purchases</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((c) => {
                    const cvr = c.views > 0 ? ((c.purchases / c.views) * 100).toFixed(1) : '0.0'
                    return (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-800 truncate max-w-xs">{c.title}</td>
                        <td className="text-center px-4 py-3 text-gray-600">{c.views}</td>
                        <td className="text-center px-4 py-3 text-gray-600">{c.carts}</td>
                        <td className="text-center px-4 py-3 text-gray-600">{c.purchases}</td>
                        <td className="text-center px-4 py-3 font-semibold" style={{ color: parseFloat(cvr) > 2 ? '#16a34a' : '#d4537e' }}>
                          {cvr}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

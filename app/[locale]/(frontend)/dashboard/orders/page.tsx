'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Sidebar from '@/app/[locale]/components/Sidebar'
import BottomNav from '@/app/[locale]/components/BottomNav'
import AuthGuard from '@/app/[locale]/components/AuthGuard'
import { formatPrice } from '@/app/lib/currency'

interface OrderItem {
  itemType: 'course' | 'recipe'
  course?: { id: string; title: string; slug: string }
  recipe?: { id: string; title: string }
  price?: number
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  currency: string
  paymentMethod?: string
  createdAt: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  paid:      { bg: '#f0fdf4', color: '#16a34a', label: '✓' },
  pending:   { bg: '#fefce8', color: '#ca8a04', label: '⏳' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', label: '✗' },
}

function OrdersContent({ user }: { user: any }) {
  const t = useTranslations()
  const locale = useLocale()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  useEffect(() => {
    fetch('/api/orders/my')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function downloadReceipt(order: Order) {
    const courseName = order.items?.[0]?.course?.title
      ?? order.items?.[0]?.recipe?.title
      ?? '—'
    const date = new Date(order.createdAt).toLocaleDateString('tr-TR')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Sipariş ${order.id}</title>
<style>body{font-family:sans-serif;max-width:400px;margin:40px auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;}
h1{color:#d4537e;font-size:20px;}table{width:100%;border-collapse:collapse;margin-top:16px;}
td{padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;}.total{font-weight:700;font-size:18px;color:#d4537e;}
.footer{margin-top:24px;font-size:11px;color:#9ca3af;text-align:center;}</style></head>
<body>
<h1>🎂 MyCakeAleks</h1>
<p style="color:#6b7280;font-size:13px;">${date}</p>
<table>
<tr><td style="color:#9ca3af">Sipariş No</td><td><b>${order.id.slice(0, 8).toUpperCase()}</b></td></tr>
<tr><td style="color:#9ca3af">Ürün</td><td>${courseName}</td></tr>
<tr><td style="color:#9ca3af">Ödeme</td><td>${order.paymentMethod ?? '—'}</td></tr>
<tr><td style="color:#9ca3af">Durum</td><td>${order.status}</td></tr>
<tr><td style="color:#9ca3af">Toplam</td><td class="total">${order.total} ${order.currency || 'TRY'}</td></tr>
</table>
<div class="footer">mycakealeks.com.tr</div>
</body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${order.id.slice(0, 8)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} userEmail={user.email} />
      <BottomNav />

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
              ← {t('dashboard.title')}
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('orders.title')}</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-5xl mb-3">🧾</p>
              <p className="text-gray-500 mb-5">{t('orders.empty')}</p>
              <Link href="/courses" className="btn-primary px-6 py-2.5 text-sm">
                {t('dashboard.noCoursesBuy')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending
                const courseName =
                  order.items?.[0]?.course?.title ??
                  order.items?.[0]?.recipe?.title ??
                  '—'
                const date = new Date(order.createdAt).toLocaleDateString()

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: '#fbeaf0' }}
                    >
                      🎂
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{courseName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-gray-900">
                        {formatPrice(order.total, locale)}
                      </p>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label} {t(`orders.status_${order.status}`)}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadReceipt(order)}
                      className="ml-2 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex-shrink-0"
                      title={t('orders.receipt')}
                    >
                      ↓
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function OrdersPage() {
  return <AuthGuard>{(user) => <OrdersContent user={user} />}</AuthGuard>
}

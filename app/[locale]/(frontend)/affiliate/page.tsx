'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'

const SITE = 'https://mycakealeks.com.tr'

const TEXT: Record<string, any> = {
  tr: {
    title: 'Ortak Programı',
    subtitle: 'MyCakeAleks kurslarını tanıtın ve her satıştan %20 komisyon kazanın.',
    howTitle: 'Nasıl çalışır?',
    steps: ['Başvurun ve onay alın', 'Benzersiz bağlantınızı alın', 'Paylaşın ve satış yapın', 'Komisyonunuzu alın'],
    statsTitle: 'İstatistikleriniz',
    applyTitle: 'Başvur',
    applyBtn: 'Başvuruyu Gönder',
    notesLabel: 'Sosyal medya hesapları / blog linkiniz',
    payoutLabel: 'Ödeme bilgileri (IBAN / PayPal)',
    pending: 'Başvurunuz inceleniyor',
    active: 'Aktif ortak',
    suspended: 'Hesap askıya alındı',
    copied: 'Kopyalandı!',
    copyLink: 'Linki Kopyala',
    earned: 'Toplam kazanç',
    payout: 'Bekleyen ödeme',
    clicks: 'Tıklamalar',
    sales: 'Satışlar',
    commission: 'komisyon',
    loginRequired: 'Bu sayfayı görmek için giriş yapmanız gerekiyor.',
    loginBtn: 'Giriş Yap',
    features: [
      { emoji: '💰', title: '%20 Komisyon', desc: 'Her satıştan anında kazanç' },
      { emoji: '🔗', title: 'Benzersiz Link', desc: 'Kişisel takip bağlantısı' },
      { emoji: '📊', title: 'Gerçek Zamanlı', desc: 'Canlı istatistikler' },
      { emoji: '💳', title: 'Hızlı Ödeme', desc: 'Aylık otomatik ödeme' },
    ],
  },
  ru: {
    title: 'Партнёрская программа',
    subtitle: 'Рекомендуйте курсы MyCakeAleks и получайте 20% с каждой продажи.',
    howTitle: 'Как это работает?',
    steps: ['Подайте заявку и получите одобрение', 'Получите уникальную ссылку', 'Делитесь и продавайте', 'Получайте комиссию'],
    statsTitle: 'Ваша статистика',
    applyTitle: 'Подать заявку',
    applyBtn: 'Отправить заявку',
    notesLabel: 'Ссылки на соцсети / блог',
    payoutLabel: 'Реквизиты для выплат (IBAN / PayPal)',
    pending: 'Заявка на рассмотрении',
    active: 'Активный партнёр',
    suspended: 'Аккаунт приостановлен',
    copied: 'Скопировано!',
    copyLink: 'Скопировать ссылку',
    earned: 'Всего заработано',
    payout: 'Ожидает выплаты',
    clicks: 'Переходы',
    sales: 'Продажи',
    commission: 'комиссия',
    loginRequired: 'Для доступа к этой странице необходимо войти.',
    loginBtn: 'Войти',
    features: [
      { emoji: '💰', title: '20% комиссия', desc: 'С каждой продажи' },
      { emoji: '🔗', title: 'Уникальная ссылка', desc: 'Персональный трекинг' },
      { emoji: '📊', title: 'В реальном времени', desc: 'Живая статистика' },
      { emoji: '💳', title: 'Быстрая выплата', desc: 'Ежемесячная оплата' },
    ],
  },
  en: {
    title: 'Affiliate Program',
    subtitle: 'Promote MyCakeAleks courses and earn 20% commission on every sale.',
    howTitle: 'How it works',
    steps: ['Apply and get approved', 'Get your unique link', 'Share and sell', 'Earn commission'],
    statsTitle: 'Your stats',
    applyTitle: 'Apply now',
    applyBtn: 'Submit Application',
    notesLabel: 'Social media / blog links',
    payoutLabel: 'Payout details (IBAN / PayPal)',
    pending: 'Application under review',
    active: 'Active affiliate',
    suspended: 'Account suspended',
    copied: 'Copied!',
    copyLink: 'Copy Link',
    earned: 'Total earned',
    payout: 'Pending payout',
    clicks: 'Clicks',
    sales: 'Sales',
    commission: 'commission',
    loginRequired: 'You need to log in to access this page.',
    loginBtn: 'Log In',
    features: [
      { emoji: '💰', title: '20% Commission', desc: 'On every sale' },
      { emoji: '🔗', title: 'Unique Link', desc: 'Personal tracking' },
      { emoji: '📊', title: 'Real-time', desc: 'Live statistics' },
      { emoji: '💳', title: 'Fast Payout', desc: 'Monthly payments' },
    ],
  },
}

export default function AffiliatePage() {
  const locale = useLocale()
  const t = TEXT[locale] ?? TEXT.tr
  const [user, setUser] = useState<any>(null)
  const [affiliate, setAffiliate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('')
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setUser(d?.user ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    fetch('/api/affiliate?action=stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setAffiliate(d.affiliate ?? null))
      .catch(() => {})
  }, [user])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    try {
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes, payoutMethod }),
      })
      const data = await res.json()
      if (data.ok) setAffiliate(data.affiliate)
    } finally {
      setApplying(false)
    }
  }

  const affiliateLink = affiliate ? `${SITE}?ref=${affiliate.code}` : ''

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    active: '#16a34a',
    suspended: '#dc2626',
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-4">
              <Link href="/courses" className="nav-link text-sm">
                {locale === 'ru' ? 'Курсы' : locale === 'en' ? 'Courses' : 'Kurslar'}
              </Link>
            </div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-14 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#f9f9fb 100%)' }}>
        <p className="text-4xl mb-4">🤝</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#d4537e' }}>{t.title}</h1>
        <p className="text-gray-600 max-w-xl mx-auto">{t.subtitle}</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {t.features.map((f: any) => (
          <div key={f.title} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <p className="text-3xl mb-2">{f.emoji}</p>
            <p className="font-bold text-gray-900 text-sm">{f.title}</p>
            <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">{t.howTitle}</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {t.steps.map((step: string, i: number) => (
            <div key={i} className="flex md:flex-col items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: '#d4537e' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-600 md:text-center">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard / Apply */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="h-40 bg-white rounded-2xl animate-pulse" />
        ) : !user ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600 mb-4">{t.loginRequired}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: '#d4537e' }}
            >
              {t.loginBtn}
            </Link>
          </div>
        ) : affiliate ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            {/* Status badge */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t.statsTitle}</h2>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ background: statusColors[affiliate.status] ?? '#6b7280' }}
              >
                {t[affiliate.status] ?? affiliate.status}
              </span>
            </div>

            {/* Affiliate link */}
            {affiliate.status === 'active' && (
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {locale === 'ru' ? 'Ваша партнёрская ссылка' : locale === 'en' ? 'Your affiliate link' : 'Ortak linkiniz'}
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={affiliateLink}
                    className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-mono"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                    style={{ background: '#d4537e' }}
                  >
                    {copied ? t.copied : t.copyLink}
                  </button>
                </div>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: t.clicks, value: affiliate.clicks ?? 0, emoji: '👁' },
                { label: t.sales, value: affiliate.conversions ?? 0, emoji: '🛒' },
                { label: t.earned, value: `₺${affiliate.totalEarned ?? 0}`, emoji: '💰' },
                { label: t.payout, value: `₺${affiliate.pendingPayout ?? 0}`, emoji: '💳' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#fbeaf0' }}>
                  <p className="text-xl">{s.emoji}</p>
                  <p className="text-lg font-extrabold" style={{ color: '#d4537e' }}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center">
              {affiliate.commissionRate}% {t.commission}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.applyTitle}</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.notesLabel}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.payoutLabel}</label>
                <input
                  type="text"
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-60"
                style={{ background: '#d4537e' }}
              >
                {applying ? '...' : t.applyBtn}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  )
}

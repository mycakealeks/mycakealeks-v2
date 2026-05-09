'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import NavUserWidget from '@/app/[locale]/components/NavUserWidget'

const BENEFITS = [
  { emoji: '💰', key: 'benefit1' },
  { emoji: '📦', key: 'benefit2' },
  { emoji: '📊', key: 'benefit3' },
  { emoji: '🌍', key: 'benefit4' },
]

const FAQ = [
  { key: 'faq1' },
  { key: 'faq2' },
  { key: 'faq3' },
  { key: 'faq4' },
]

export default function VendorPage() {
  const t = useTranslations()
  const locale = useLocale()

  const [form, setForm] = useState({ name: '', email: '', businessName: '', website: '', description: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.businessName) {
      setError(t('vendor.formRequired'))
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (res.ok) setSent(true)
      else setError(t('vendor.formError'))
    } catch {
      setError(t('vendor.formError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="nav-link">{t('nav.shop')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <NavUserWidget />
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-16 md:py-20 px-4 text-center"
        style={{ background: 'linear-gradient(180deg, #fbeaf0 0%, #fff 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t('vendor.title')}</h1>
          <p className="text-gray-500 text-base md:text-lg mb-8">{t('vendor.subtitle')}</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white"
            style={{ background: '#d4537e' }}>
            {t('vendor.commission')}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">{t('vendor.benefitsTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.key} className="border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{b.emoji}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t(`vendor.${b.key}Title` as any)}</h3>
                <p className="text-gray-500 text-sm">{t(`vendor.${b.key}Desc` as any)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="max-w-xl mx-auto px-4 md:px-6 py-12">
        <div className="border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">{t('vendor.applyTitle')}</h2>

          {sent ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✅</p>
              <p className="font-bold text-gray-900 text-lg mb-2">{t('vendor.applySuccess')}</p>
              <p className="text-gray-500 text-sm">{t('vendor.applySuccessDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor.fieldName')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  placeholder="Ayşe Kaya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor.fieldEmail')} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input-field"
                  placeholder="ayse@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor.fieldBusiness')} *</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  className="input-field"
                  placeholder="Ayşe'nin Çikolataları"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor.fieldWebsite')}</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor.fieldDescription')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={4}
                  placeholder={t('vendor.descPlaceholder')}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl font-bold text-white transition-opacity disabled:opacity-60"
                style={{ background: '#d4537e' }}
              >
                {sending ? '...' : t('vendor.applyBtn')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 md:px-6 pb-20">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">{t('vendor.faqTitle')}</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <details key={f.key} className="border border-gray-100 rounded-xl overflow-hidden group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 select-none">
                {t(`vendor.${f.key}Q` as any)}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">
                {t(`vendor.${f.key}A` as any)}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

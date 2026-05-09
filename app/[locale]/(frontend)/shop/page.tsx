'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import NavUserWidget from '@/app/[locale]/components/NavUserWidget'
import { formatPrice } from '@/app/lib/currency'

const CATEGORIES = [
  { key: 'all', emoji: '🛍️' },
  { key: 'chocolate', emoji: '🍫' },
  { key: 'molds', emoji: '🎂' },
  { key: 'tools', emoji: '🔧' },
  { key: 'ingredients', emoji: '🌿' },
  { key: 'packaging', emoji: '📦' },
  { key: 'decoration', emoji: '🌸' },
]

type CartItem = { id: string; name: string; slug: string; price: number; quantity: number }

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('mca_cart') || '[]') } catch { return [] }
}
function saveCart(items: CartItem[]) {
  localStorage.setItem('mca_cart', JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export default function ShopPage() {
  const t = useTranslations()
  const locale = useLocale()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [addedId, setAddedId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort, limit: '24' })
      if (category !== 'all') params.set('category', category)
      if (search.trim()) params.set('q', search.trim())
      const res = await fetch(`/api/shop/products?${params}`)
      const data = await res.json()
      setProducts(data.docs || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, sort, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function addToCart(product: any) {
    const cart = getCart()
    const idx = cart.findIndex((i) => i.id === product.id)
    if (idx >= 0) { cart[idx].quantity++ } else {
      cart.push({ id: product.id, name: product.name, slug: product.slug, price: product.price, quantity: 1 })
    }
    saveCart(cart)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const categoryLabel = (key: string) => {
    if (key === 'all') return t('shop.categories.all')
    return t(`shop.categories.${key}` as any)
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
            <Link href="/courses" className="nav-link">{t('nav.courses')}</Link>
            <Link href="/recipes" className="nav-link">{t('nav.recipes')}</Link>
            <Link href="/shop" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.shop')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/shop/cart" className="relative text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </Link>
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <NavUserWidget />
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="py-12 md:py-16 px-4 md:px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #fbeaf0 0%, #fff 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ background: '#fbeaf0', color: '#d4537e' }}>
            🛍️ {t('shop.badge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('shop.title')}</h1>
          <p className="text-gray-500 mb-7 text-sm md:text-base">{t('shop.subtitle')}</p>
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('shop.searchPlaceholder')}
              className="input-field pl-10 pr-4 py-3 shadow-sm text-base"
            />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-6xl mx-auto py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border transition-colors min-h-[40px]"
                style={
                  category === cat.key
                    ? { background: '#d4537e', color: 'white', borderColor: '#d4537e' }
                    : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                }
              >
                {cat.emoji} {categoryLabel(cat.key)}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 min-h-[40px]"
            style={{ focusRingColor: '#d4537e' } as any}
          >
            <option value="newest">{t('shop.sort.newest')}</option>
            <option value="featured">{t('shop.sort.featured')}</option>
            <option value="price_asc">{t('shop.sort.priceAsc')}</option>
            <option value="price_desc">{t('shop.sort.priceDesc')}</option>
          </select>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-gray-400 text-base">{t('shop.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                t={t}
                onAddToCart={() => addToCart(product)}
                added={addedId === product.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function ProductCard({
  product, locale, t, onAddToCart, added,
}: {
  product: any; locale: string; t: any; onAddToCart: () => void; added: boolean
}) {
  const vendorName = typeof product.vendor === 'object' ? product.vendor?.name : null
  const thumb = product.images?.[0]?.image
  const thumbUrl = typeof thumb === 'object' ? thumb?.url : null

  return (
    <div className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <Link href={`/shop/${product.slug}`}>
        <div
          className="h-44 flex items-center justify-center overflow-hidden"
          style={{ background: '#fbeaf0' }}
        >
          {thumbUrl ? (
            <img src={thumbUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🛍️</span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 self-start"
            style={{ background: '#fbeaf0', color: '#d4537e' }}>
            {t(`shop.categories.${product.category}` as any)}
          </span>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {vendorName && (
          <p className="text-xs text-gray-400 mb-2">{vendorName}</p>
        )}
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <span className="font-extrabold text-lg" style={{ color: '#d4537e' }}>
              {formatPrice(product.price, locale)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {formatPrice(product.oldPrice, locale)}
              </span>
            )}
          </div>
          <button
            onClick={onAddToCart}
            className="text-sm font-semibold px-3 py-2 rounded-xl transition-all min-h-[40px]"
            style={
              added
                ? { background: '#16a34a', color: 'white' }
                : { background: '#d4537e', color: 'white' }
            }
          >
            {added ? '✓' : t('shop.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

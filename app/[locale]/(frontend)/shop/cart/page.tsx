'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import NavUserWidget from '@/app/[locale]/components/NavUserWidget'
import { formatPrice } from '@/app/lib/currency'

type CartItem = { id: string; name: string; slug: string; price: number; quantity: number }

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('mca_cart') || '[]') } catch { return [] }
}
function saveCart(items: CartItem[]) {
  localStorage.setItem('mca_cart', JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export default function CartPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCart(getCart())
    const handleUpdate = () => setCart(getCart())
    window.addEventListener('cart-updated', handleUpdate)
    return () => window.removeEventListener('cart-updated', handleUpdate)
  }, [])

  function updateQty(id: string, delta: number) {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    )
    setCart(updated)
    saveCart(updated)
  }

  function removeItem(id: string) {
    const updated = cart.filter((item) => item.id !== id)
    setCart(updated)
    saveCart(updated)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckout() {
    setCheckingOut(true)
    try {
      const res = await fetch('/api/shop/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      })
      if (res.ok) {
        saveCart([])
        setCart([])
        setSuccess(true)
      } else {
        const err = await res.json()
        if (err.error === 'Unauthorized') {
          window.location.href = locale === 'tr' ? '/login' : `/${locale}/login`
        }
      }
    } catch {
      // keep items in cart
    } finally {
      setCheckingOut(false)
    }
  }

  if (!mounted) return null

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">{t('shop.orderSuccess')}</h1>
          <p className="text-gray-500 mb-8">{t('shop.orderSuccessDesc')}</p>
          <Link href="/shop" className="btn-primary inline-block">{t('shop.continueShopping')}</Link>
        </div>
      </main>
    )
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
            <Link href="/shop" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.shop')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <NavUserWidget />
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 pb-20">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{t('shop.cart')}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 mb-6">{t('shop.cartEmpty')}</p>
            <Link href="/shop" className="btn-primary inline-block">{t('shop.backToShop')}</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#fbeaf0' }}
                  >
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-pink-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="font-bold text-sm mt-0.5" style={{ color: '#d4537e' }}>
                      {formatPrice(item.price * item.quantity, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">{t('shop.total')}</span>
                <span className="text-2xl font-extrabold" style={{ color: '#d4537e' }}>
                  {formatPrice(total, locale)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-3.5 rounded-xl font-bold text-base transition-opacity disabled:opacity-60"
                style={{ background: '#d4537e', color: 'white' }}
              >
                {checkingOut ? '...' : t('shop.checkout')}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">{t('shop.checkoutNote')}</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

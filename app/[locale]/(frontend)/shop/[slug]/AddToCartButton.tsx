'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type CartItem = { id: string; name: string; slug: string; price: number; quantity: number }

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('mca_cart') || '[]') } catch { return [] }
}
function saveCart(items: CartItem[]) {
  localStorage.setItem('mca_cart', JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export default function AddToCartButton({
  product, locale,
}: { product: any; locale: string }) {
  const t = useTranslations()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    const cart = getCart()
    const idx = cart.findIndex((i) => i.id === product.id)
    if (idx >= 0) { cart[idx].quantity++ } else {
      cart.push({ id: product.id, name: product.name, slug: product.slug, price: product.price, quantity: 1 })
    }
    saveCart(cart)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product.inStock) {
    return (
      <button disabled
        className="w-full py-3 rounded-xl font-semibold text-base bg-gray-100 text-gray-400 cursor-not-allowed">
        {t('shop.outOfStock')}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAdd}
        className="w-full py-3 rounded-xl font-semibold text-base transition-all"
        style={added ? { background: '#16a34a', color: 'white' } : { background: '#d4537e', color: 'white' }}
      >
        {added ? `✓ ${t('shop.addedToCart')}` : t('shop.addToCart')}
      </button>
      {added && (
        <Link href="/shop/cart"
          className="w-full py-3 rounded-xl font-semibold text-base text-center border transition-colors"
          style={{ borderColor: '#d4537e', color: '#d4537e' }}>
          {t('shop.goToCart')}
        </Link>
      )}
    </div>
  )
}

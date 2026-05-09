import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import NavUserWidget from '@/app/[locale]/components/NavUserWidget'
import { formatPrice } from '@/app/lib/currency'
import AddToCartButton from './AddToCartButton'

const SITE = 'https://mycakealeks.com.tr'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const product = data.docs?.[0]
    if (!product) return {}
    const base = locale === 'tr' ? SITE : `${SITE}/${locale}`
    return {
      title: `${product.name} | MyCakeAleks Shop`,
      description: product.description || product.name,
      openGraph: { title: product.name, url: `${base}/shop/${slug}` },
    }
  } catch { return {} }
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations()
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`

  let product: any = null
  let relatedProducts: any[] = []

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?where[slug][equals]=${slug}&where[status][equals]=published&limit=1&depth=2`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    product = data.docs?.[0] ?? null

    if (product?.category) {
      const relRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?where[status][equals]=published&where[category][equals]=${product.category}&limit=4&depth=1`,
        { cache: 'no-store' }
      )
      const relData = await relRes.json()
      relatedProducts = (relData.docs || []).filter((p: any) => p.id !== product?.id).slice(0, 3)
    }
  } catch { /* not found */ }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500">{t('shop.notFound')}</p>
          <Link href="/shop" className="btn-primary mt-4 inline-block">{t('shop.backToShop')}</Link>
        </div>
      </main>
    )
  }

  const vendorName = typeof product.vendor === 'object' ? product.vendor?.name : null
  const vendorSlug = typeof product.vendor === 'object' ? product.vendor?.slug : null
  const thumb = product.images?.[0]?.image
  const thumbUrl = typeof thumb === 'object' ? thumb?.url : null

  const relatedCourses: any[] = Array.isArray(product.relatedCourses)
    ? product.relatedCourses.filter((c: any) => typeof c === 'object')
    : []

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
            <Link href="/shop" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.shop')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/shop/cart" className="text-gray-600 hover:text-gray-900 transition-colors">
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

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600">MyCakeAleks</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-600">{t('nav.shop')}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center h-72 md:h-96"
            style={{ background: '#fbeaf0' }}
          >
            {thumbUrl ? (
              <img src={thumbUrl} alt={product.name} className="w-full h-full object-contain p-4" />
            ) : (
              <span className="text-8xl">🛍️</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full self-start mb-3"
                style={{ background: '#fbeaf0', color: '#d4537e' }}>
                {t(`shop.categories.${product.category}` as any)}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>

            {vendorName && (
              <p className="text-sm text-gray-500 mb-4">
                {t('shop.soldBy')}{' '}
                {vendorSlug
                  ? <Link href={`/vendor`} className="font-medium" style={{ color: '#d4537e' }}>{vendorName}</Link>
                  : <span className="font-medium">{vendorName}</span>}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-extrabold" style={{ color: '#d4537e' }}>
                {formatPrice(product.price, locale)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice, locale)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {product.inStock ? t('shop.inStock') : t('shop.outOfStock')}
              </span>
              {product.stock > 0 && (
                <span className="text-xs text-gray-400">{t('shop.stockLeft', { count: product.stock })}</span>
              )}
            </div>

            <AddToCartButton product={product} locale={locale} />
          </div>
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t('shop.recommendedForCourses')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedCourses.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.slug || course.id}`}
                  className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <span className="text-3xl">{course.emoji || '🎂'}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{course.title}</p>
                    <p className="text-xs text-gray-400">{formatPrice(course.price, locale)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t('shop.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedProducts.map((p: any) => {
                const img = p.images?.[0]?.image
                const imgUrl = typeof img === 'object' ? img?.url : null
                return (
                  <Link key={p.id} href={`/shop/${p.slug}`}
                    className="block border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-36 flex items-center justify-center" style={{ background: '#fbeaf0' }}>
                      {imgUrl
                        ? <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="text-4xl">🛍️</span>}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{p.name}</p>
                      <p className="font-semibold text-sm" style={{ color: '#d4537e' }}>{formatPrice(p.price, locale)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

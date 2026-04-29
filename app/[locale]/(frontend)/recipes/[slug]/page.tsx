import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'
import PaymentButton from '@/app/[locale]/components/PaymentButton'
import TrackEvent from '@/app/[locale]/components/TrackEvent'
import { formatPrice } from '@/app/lib/currency'

const SITE = 'https://mycakealeks.com.tr'

const DIFF: Record<string, { label: Record<string, string>; bg: string; color: string }> = {
  easy:   { label: { tr: 'Kolay', ru: 'Лёгкий', en: 'Easy' }, bg: '#f0fdf4', color: '#16a34a' },
  medium: { label: { tr: 'Orta', ru: 'Средний', en: 'Medium' }, bg: '#fefce8', color: '#ca8a04' },
  hard:   { label: { tr: 'Zor', ru: 'Сложный', en: 'Hard' }, bg: '#fef2f2', color: '#dc2626' },
}

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes?where[slug][equals]=${slug}&limit=1`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    const r = data.docs?.[0]
    if (!r) return { title: 'MyCakeAleks' }
    return { title: `${r.title} | MyCakeAleks`, description: r.description }
  } catch { return { title: 'MyCakeAleks' } }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations()
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`

  let recipe: any = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes?where[slug][equals]=${slug}&limit=1`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    recipe = data.docs?.[0] ?? null
  } catch { /* empty */ }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🎂</p>
          <p className="text-gray-500 mb-4">{t('recipes.notFound')}</p>
          <Link href="/recipes" className="btn-primary px-6 py-2.5 text-sm">{t('nav.recipes')}</Link>
        </div>
      </main>
    )
  }

  const diff = recipe.difficulty ? DIFF[recipe.difficulty] : null
  const isFree = recipe.isFree || !recipe.price || recipe.price === 0
  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.recipes'), url: `${base}/recipes` },
    { name: recipe.title, url: `${base}/recipes/${slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackEvent event="recipe_view" entityId={String(recipe.id)} entityType="recipe" />
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold" style={{ color: '#d4537e' }}>MyCakeAleks</Link>
          <div className="hidden md:flex items-center gap-5">
            <Link href="/recipes" className="nav-link text-sm">{t('nav.recipes')}</Link>
            <LanguageSwitcher />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/recipes" className="hover:text-pink-600">{t('nav.recipes')}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{recipe.title}</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div
            className="h-48 md:h-56 flex items-center justify-center text-9xl"
            style={{ background: 'linear-gradient(135deg,#fbeaf0 0%,#fff 100%)' }}
          >
            {recipe.coverEmoji || '🎂'}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {diff && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: diff.bg, color: diff.color }}>
                  {diff.label[locale] ?? diff.label.en}
                </span>
              )}
              {recipe.prepTime && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fbeaf0', color: '#d4537e' }}>
                  ⏱ {recipe.prepTime} {t('recipes.min')}
                </span>
              )}
              {isFree && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  ✓ {t('recipes.free')}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{recipe.title}</h1>
            {recipe.description && <p className="text-gray-600 leading-relaxed">{recipe.description}</p>}
          </div>
        </div>

        {/* If paid and not free — paywall */}
        {!isFree ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm mb-6">
            <p className="text-4xl mb-3">🔒</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('recipes.premiumRecipe')}</h2>
            <p className="text-gray-500 mb-6 text-sm">{t('recipes.purchaseToUnlock')}</p>
            <div className="flex items-baseline justify-center gap-2 mb-5">
              <span className="text-3xl font-extrabold" style={{ color: '#d4537e' }}>{formatPrice(recipe.price, locale)}</span>
            </div>
            <PaymentButton courseId={String(recipe.id)} amount={recipe.price} />
          </div>
        ) : (
          <>
            {/* Ingredients */}
            {recipe.ingredients?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
                <h2 className="font-bold text-gray-900 text-lg mb-4">🧂 {t('recipes.ingredients')}</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing: any, i: number) => (
                    <li key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{ing.name}</span>
                      {ing.amount && (
                        <span className="text-sm font-semibold" style={{ color: '#d4537e' }}>{ing.amount}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {recipe.content && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
                <h2 className="font-bold text-gray-900 text-lg mb-4">📝 {t('recipes.steps')}</h2>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="text-gray-500 text-sm">{t('recipes.stepsAvailable')}</p>
                </div>
              </div>
            )}

            {/* PDF Download */}
            {recipe.pdfFile && (
              <div className="mt-4 text-center">
                <a
                  href={typeof recipe.pdfFile === 'object' ? recipe.pdfFile.url : '#'}
                  download
                  className="btn-primary px-6 py-3 inline-flex items-center gap-2"
                >
                  ⬇ {t('recipes.downloadPdf')}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

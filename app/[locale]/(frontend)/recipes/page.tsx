import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import RecipesClient from './RecipesClient'
import { formatPrice } from '@/app/lib/currency'

const SITE = 'https://mycakealeks.com.tr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    tr: 'Tarifler | MyCakeAleks',
    ru: 'Рецепты | MyCakeAleks',
    en: 'Recipes | MyCakeAleks',
  }
  return { title: titles[locale] ?? titles.tr }
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()

  let recipes: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes?where[status][equals]=published&limit=50&sort=createdAt`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    recipes = data.docs ?? []
  } catch { /* empty */ }

  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/recipes" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-12 md:py-16 px-4 text-center" style={{ background: 'linear-gradient(180deg,#fbeaf0 0%,#fff 100%)' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('recipes.title')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('recipes.subtitle')}</p>
      </section>

      <RecipesClient recipes={recipes} locale={locale} t={{
        filterAll: t('recipes.filterAll'),
        free: t('recipes.free'),
        paid: t('recipes.paid'),
        buy: t('courses.buy'),
        diffEasy: t('recipes.diffEasy'),
        diffMedium: t('recipes.diffMedium'),
        diffHard: t('recipes.diffHard'),
        min: t('recipes.min'),
        empty: t('recipes.empty'),
        catAll: t('recipes.catAll'),
        catCake: t('recipes.catCake'),
        catCream: t('recipes.catCream'),
        catDecoration: t('recipes.catDecoration'),
        catDough: t('recipes.catDough'),
        catOther: t('recipes.catOther'),
      }} />
    </main>
  )
}

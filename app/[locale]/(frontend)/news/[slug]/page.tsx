import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import MobileMenu from '@/app/[locale]/components/MobileMenu'
import LanguageSwitcher from '@/app/[locale]/components/LanguageSwitcher'
import BreadcrumbJsonLd from '@/app/components/BreadcrumbJsonLd'

const SITE = 'https://mycakealeks.com.tr'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    const article = data.docs?.[0]
    if (!article) return { title: 'MyCakeAleks' }
    const title = `${article.title} | MyCakeAleks`
    const description = article.excerpt || article.title
    const url = `${locale === 'tr' ? SITE : `${SITE}/${locale}`}/news/${slug}`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: article.publishedAt,
      },
    }
  } catch {
    return { title: 'MyCakeAleks' }
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function LexicalContent({ content }: { content: any }) {
  if (!content?.root?.children) return null
  return (
    <div className="prose max-w-none">
      {content.root.children.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          const text = (node.children || []).map((c: any) => c.text || '').join('')
          if (!text.trim()) return null
          return (
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-base">
              {text}
            </p>
          )
        }
        if (node.type === 'heading') {
          const text = (node.children || []).map((c: any) => c.text || '').join('')
          return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{text}</h2>
        }
        return null
      })}
    </div>
  )
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations()
  const locale = await getLocale()

  let news: any = null
  let related: any[] = []

  try {
    const [newsRes, relatedRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/news?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/news?where[status][equals]=published&where[locale][equals]=${locale}&sort=-publishedAt&limit=4`, { cache: 'no-store' }),
    ])
    const newsData = await newsRes.json()
    news = newsData.docs?.[0] ?? null
    const relatedData = await relatedRes.json()
    related = (relatedData.docs || []).filter((n: any) => n.slug !== slug).slice(0, 3)
  } catch {
    // keep null
  }

  if (!news) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 mb-4">{t('news.noNews')}</p>
          <Link href="/news" className="btn-primary px-6 py-2.5 text-sm">{t('news.title')}</Link>
        </div>
      </main>
    )
  }

  const SITE = 'https://mycakealeks.com.tr'
  const base = locale === 'tr' ? SITE : `${SITE}/${locale}`
  const breadcrumbs = [
    { name: 'MyCakeAleks', url: base },
    { name: t('nav.news'), url: `${base}/news` },
    { name: news.title, url: `${base}/news/${slug}` },
  ]

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            My<span style={{ color: '#d4537e' }}>Cake</span>Aleks
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="nav-link text-sm">{t('nav.courses')}</Link>
            <Link href="/news" style={{ color: '#d4537e' }} className="font-semibold text-sm">{t('nav.news')}</Link>
            <Link href="/recipes" className="nav-link text-sm">{t('nav.recipes')}</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher /></div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/news" className="hover:text-pink-600 transition-colors">{t('news.title')}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{news.title}</span>
        </div>

        {/* Article */}
        <article>
          {/* Cover emoji */}
          <div
            className="w-full rounded-2xl flex items-center justify-center text-8xl mb-8"
            style={{ height: '220px', background: 'linear-gradient(135deg,#fbeaf0 0%,#fff5f8 100%)' }}
          >
            {news.coverEmoji || '🎂'}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: '#fbeaf0', color: '#d4537e' }}
            >
              {t(`news.cat_${news.category}` as any)}
            </span>
            <span className="text-sm text-gray-400">{formatDate(news.publishedAt)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{news.title}</h1>

          {news.excerpt && (
            <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">{news.excerpt}</p>
          )}

          <div className="border-t border-gray-100 pt-6">
            <LexicalContent content={news.content} />
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t('news.otherNews')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group border border-gray-100 rounded-xl p-4 hover:border-pink-200 hover:bg-pink-50 transition-colors"
                >
                  <div className="text-3xl mb-2">{item.coverEmoji || '🎂'}</div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

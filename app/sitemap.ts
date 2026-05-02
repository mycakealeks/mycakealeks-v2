import type { MetadataRoute } from 'next'

const SITE = 'https://mycakealeks.com.tr'
const LOCALES = ['tr', 'ru', 'en'] as const

function localeUrl(path: string, locale: string) {
  const prefix = locale === 'tr' ? '' : `/${locale}`
  return `${SITE}${prefix}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages — all locales
  for (const locale of LOCALES) {
    entries.push({
      url: localeUrl('/', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
    entries.push({
      url: localeUrl('/courses', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    entries.push({
      url: localeUrl('/news', locale),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
    entries.push({
      url: localeUrl('/privacy', locale),
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    })
    entries.push({
      url: localeUrl('/terms', locale),
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    })
  }

  // Dynamic course pages
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses?where[status][equals]=published&limit=100`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    for (const course of data.docs || []) {
      for (const locale of LOCALES) {
        entries.push({
          url: localeUrl(`/courses/${course.slug}`, locale),
          lastModified: new Date(course.updatedAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // skip on error
  }

  // Dynamic news pages
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news?where[status][equals]=published&limit=200&sort=-publishedAt`,
      { cache: 'no-store' },
    )
    const data = await res.json()
    for (const article of data.docs || []) {
      entries.push({
        url: localeUrl(`/news/${article.slug}`, article.locale || 'tr'),
        lastModified: new Date(article.updatedAt || new Date()),
        changeFrequency: 'daily',
        priority: 0.7,
      })
    }
  } catch {
    // skip on error
  }

  return entries
}

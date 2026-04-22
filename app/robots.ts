import type { MetadataRoute } from 'next'

const DISALLOW = ['/admin', '/api/', '/dashboard', '/profile', '/my-courses', '/checkout']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: 'GPTBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Claude-Web', allow: '/', disallow: DISALLOW },
      { userAgent: 'anthropic-ai', allow: '/', disallow: DISALLOW },
      { userAgent: 'PerplexityBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'YandexBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Bingbot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Googlebot', allow: '/', disallow: DISALLOW },
      { userAgent: 'DeepSeekBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'MoonshotBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Applebot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Amazonbot', allow: '/', disallow: DISALLOW },
      { userAgent: 'FacebookBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'LinkedInBot', allow: '/', disallow: DISALLOW },
    ],
    sitemap: 'https://mycakealeks.com.tr/sitemap.xml',
  }
}

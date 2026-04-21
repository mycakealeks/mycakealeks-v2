import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/dashboard', '/profile', '/my-courses', '/checkout'],
      },
    ],
    sitemap: 'https://mycakealeks.com.tr/sitemap.xml',
  }
}

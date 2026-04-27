import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED = ['/dashboard', '/profile', '/my-courses']
const LESSON_RE = /^\/courses\/[^/]+\/lessons\//
const VERIFY_SKIP = ['/verify-email', '/verify-email-notice', '/logout', '/profile']

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 365 days

function extractLocaleAndPath(pathname: string): { locale: string; path: string } {
  for (const locale of routing.locales as string[]) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return { locale, path: pathname.slice(locale.length + 1) || '/' }
    }
  }
  return { locale: routing.defaultLocale, path: pathname }
}

function getTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function detectLocaleFromHeader(acceptLanguage: string): string {
  const lower = acceptLanguage.toLowerCase()
  // Check in priority order — first match wins
  const tags = lower.split(',').map((s) => s.split(';')[0].trim())
  for (const tag of tags) {
    if (tag.startsWith('ru')) return 'ru'
    if (tag.startsWith('tr')) return 'tr'
    if (tag.startsWith('en')) return 'en'
  }
  return routing.defaultLocale
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const { locale, path } = extractLocaleAndPath(pathname)

  // Auth check
  const needsAuth =
    PROTECTED.some((r) => path === r || path.startsWith(r + '/')) ||
    LESSON_RE.test(path)

  if (needsAuth) {
    const token = req.cookies.get('payload-token')?.value
    if (!token) {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
      const loginUrl = new URL(`${prefix}/login`, req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const shouldCheckVerification = !VERIFY_SKIP.some((p) => path === p || path.startsWith(p + '/'))
    if (shouldCheckVerification) {
      const payload = getTokenPayload(token)
      if (payload && payload.isEmailVerified === false) {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
        return NextResponse.redirect(new URL(`${prefix}/verify-email-notice`, req.url))
      }
    }
  }

  // Auto language detection — only on first visit, skip if user chose a language
  const hasPreferred = !!req.cookies.get('preferred-locale')?.value
  const hasVisited = !!req.cookies.get('locale-set')?.value

  if (!hasPreferred && !hasVisited) {
    const acceptLanguage = req.headers.get('accept-language') ?? ''
    const detectedLocale = detectLocaleFromHeader(acceptLanguage)

    const currentLocalePrefix = locale
    const targetLocalePrefix = detectedLocale === routing.defaultLocale ? routing.defaultLocale : detectedLocale

    if (currentLocalePrefix !== targetLocalePrefix) {
      const pathSuffix = path === '/' ? '' : path
      const targetPrefix = targetLocalePrefix === routing.defaultLocale ? '' : `/${targetLocalePrefix}`
      const redirectUrl = new URL(`${targetPrefix}${pathSuffix}`, req.url)
      const response = NextResponse.redirect(redirectUrl)
      response.cookies.set('locale-set', 'true', {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
      })
      return response
    }

    // Same locale — let request through but stamp the cookie
    const response = intlMiddleware(req)
    response.cookies.set('locale-set', 'true', {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return response
  }

  return intlMiddleware(req)
}

export const config = {
  // admin(?:/|$) excludes /admin and /admin/... but NOT /admin-analytics
  matcher: ['/((?!api|_next|_vercel|admin(?:/|$)|.*\\..*).*)',],
}

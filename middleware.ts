import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED = ['/dashboard', '/profile', '/my-courses']
const LESSON_RE = /^\/courses\/[^/]+\/lessons\//
const VERIFY_SKIP = ['/verify-email', '/verify-email-notice', '/logout', '/profile']

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 365 days

// ── Admin rate limiting ────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const adminLoginAttempts = new Map<string, { count: number; firstAt: number }>()

function isAdminLoginRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = adminLoginAttempts.get(ip)
  if (!record || now - record.firstAt > RATE_LIMIT_WINDOW_MS) {
    adminLoginAttempts.set(ip, { count: 1, firstAt: now })
    return false
  }
  if (record.count >= RATE_LIMIT_MAX) return true
  record.count++
  return false
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

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

  // ── /admin routes — handled separately from intl middleware ───────────────
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')

    // Rate limit: block IPs that hammer /admin/login
    if (isLoginPage) {
      const ip = getClientIp(req)
      if (isAdminLoginRateLimited(ip)) {
        return new NextResponse(
          'Too many login attempts. Please try again in 15 minutes.',
          {
            status: 429,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Retry-After': '900',
            },
          },
        )
      }
      return NextResponse.next()
    }

    // All other /admin/* — require valid payload-token with role=admin
    const token = req.cookies.get('payload-token')?.value
    if (token) {
      const jwtPayload = getTokenPayload(token)
      if (jwtPayload && jwtPayload.role === 'admin') {
        return NextResponse.next()
      }
    }
    // No token or not admin → Payload's own login page
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

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
  // /admin is now handled by this middleware (rate limit + role check)
  // api, _next, _vercel and static files (.*\\..*) are still excluded
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}

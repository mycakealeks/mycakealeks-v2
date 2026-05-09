import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const PROTECTED = ['/dashboard', '/profile', '/my-courses']
const LESSON_RE = /^\/courses\/[^/]+\/lessons\//
const VERIFY_SKIP = ['/verify-email', '/verify-email-notice', '/logout', '/profile']

const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const adminAttempts = new Map<string, { count: number; firstAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = adminAttempts.get(ip)
  if (!rec || now - rec.firstAt > RATE_LIMIT_WINDOW_MS) {
    adminAttempts.set(ip, { count: 1, firstAt: now })
    return false
  }
  if (rec.count >= RATE_LIMIT_MAX) return true
  rec.count++
  return false
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── 1. Admin ───────────────────────────────────────────────────────────────
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname.startsWith('/admin/login')) {
      if (isRateLimited(clientIp(req))) {
        return new NextResponse('Too many login attempts. Try again in 15 minutes.', {
          status: 429,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '900' },
        })
      }
      return NextResponse.next()
    }
    const token = req.cookies.get('payload-token')?.value
    const jwt = token ? parseJwt(token) : null
    if (!jwt || jwt.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // ── 2. Locale-root rewrite ─────────────────────────────────────────────────
  // nginx strips trailing slashes → /ru and /en need rewrite to /ru/ and /en/
  if (pathname === '/ru' || pathname === '/en') {
    const url = req.nextUrl.clone()
    url.pathname = `${pathname}/`
    return NextResponse.rewrite(url)
  }

  // ── 3. Auth check ──────────────────────────────────────────────────────────
  const locale = pathname.startsWith('/ru') ? 'ru'
    : pathname.startsWith('/en') ? 'en'
    : 'tr'
  const localePrefix = locale === 'tr' ? '' : `/${locale}`
  const strippedPath = pathname.replace(/^\/(ru|en)/, '') || '/'

  const needsAuth =
    PROTECTED.some((r) => strippedPath === r || strippedPath.startsWith(`${r}/`)) ||
    LESSON_RE.test(strippedPath)

  if (needsAuth) {
    const token = req.cookies.get('payload-token')?.value

    if (!token) {
      const loginUrl = new URL(`${localePrefix}/login`, req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const jwt = parseJwt(token)
    if (!jwt || (jwt.exp && Date.now() / 1000 > (jwt.exp as number))) {
      const loginUrl = new URL(`${localePrefix}/login`, req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const skipVerify = VERIFY_SKIP.some(
      (p) => strippedPath === p || strippedPath.startsWith(`${p}/`)
    )
    if (!skipVerify && jwt.isEmailVerified === false) {
      return NextResponse.redirect(new URL(`${localePrefix}/verify-email-notice`, req.url))
    }
  }

  // ── 4. Hand off to next-intl ───────────────────────────────────────────────
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}

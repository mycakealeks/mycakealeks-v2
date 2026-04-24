import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED = ['/dashboard', '/profile', '/my-courses']
const LESSON_RE = /^\/courses\/[^/]+\/lessons\//
// These paths are exempt from the "must verify email" redirect
const VERIFY_SKIP = ['/verify-email', '/verify-email-notice', '/logout', '/profile']

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

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const { locale, path } = extractLocaleAndPath(pathname)

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

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)',],
}

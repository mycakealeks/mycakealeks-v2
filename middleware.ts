import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Routes that require authentication (matched against path WITHOUT locale prefix)
const PROTECTED = ['/dashboard', '/profile', '/my-courses']
const LESSON_RE = /^\/courses\/[^/]+\/lessons\//

function extractLocaleAndPath(pathname: string): { locale: string; path: string } {
  for (const locale of routing.locales as string[]) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return { locale, path: pathname.slice(locale.length + 1) || '/' }
    }
  }
  return { locale: routing.defaultLocale, path: pathname }
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
      const loginUrl = new URL(`/${locale}/login`, req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*) '],
}

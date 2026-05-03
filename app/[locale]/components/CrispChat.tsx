'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'

const DASHBOARD_PATHS = [
  '/dashboard',
  '/profile',
  '/my-courses',
  '/dashboard/orders',
  '/dashboard/points',
  '/dashboard/support',
]

function isDashboardPath(pathname: string): boolean {
  if (DASHBOARD_PATHS.includes(pathname)) return true
  // lesson pages: /courses/[slug]/lessons/[lessonId]
  if (/^\/courses\/[^/]+\/lessons\/[^/]+/.test(pathname)) return true
  return false
}

interface Props {
  locale?: string
}

export default function CrispChat({ locale = 'tr' }: Props) {
  const pathname = usePathname()
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

  useEffect(() => {
    const crisp = (window as any).$crisp
    if (!crisp) return

    // Locale
    crisp.push(['config', 'locale', locale])

    // Show/hide based on route
    if (isDashboardPath(pathname)) {
      crisp.push(['do', 'chat:show'])
    } else {
      crisp.push(['do', 'chat:hide'])
    }
  }, [pathname, locale])

  // Also set user data when available — called from dashboard pages via window
  useEffect(() => {
    const crisp = (window as any).$crisp
    if (!crisp) return

    // Try to read cached user from /api/users/me
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const user = data?.user
        if (!user?.email) return
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
        crisp.push(['set', 'user:email', [user.email]])
        crisp.push(['set', 'user:nickname', [name]])
      })
      .catch(() => {})
  }, [])

  if (!websiteId) return null

  return (
    <Script
      id="crisp-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="${websiteId}";
          (function(){
            var d=document;
            var s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";
            s.async=1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
        `,
      }}
    />
  )
}

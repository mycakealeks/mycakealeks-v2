'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'

interface Props {
  user?: { email?: string; firstName?: string; lastName?: string } | null
}

export default function CrispChat({ user }: Props) {
  const locale = useLocale()
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).$crisp) return

    // Set locale
    const langMap: Record<string, string> = { tr: 'tr', ru: 'ru', en: 'en' }
    ;(window as any).$crisp.push(['config', 'locale', langMap[locale] || 'tr'])

    // Set user data if logged in
    if (user?.email) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
      ;(window as any).$crisp.push(['set', 'user:email', [user.email]])
      ;(window as any).$crisp.push(['set', 'user:nickname', [name]])
    }
  }, [locale, user])

  if (!websiteId) return null

  return (
    <>
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
    </>
  )
}

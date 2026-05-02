import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import YandexMetrika from '@/app/components/YandexMetrika'
import GoogleAnalytics from '@/app/components/GoogleAnalytics'
import CrispChat from './components/CrispChat'
import './styles.css'

const SITE = 'https://mycakealeks.com.tr'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    metadataBase: new URL(SITE),
    alternates: {
      canonical: locale === 'tr' ? SITE : `${SITE}/${locale}`,
      languages: {
        tr: SITE,
        ru: `${SITE}/ru`,
        en: `${SITE}/en`,
      },
    },
    openGraph: {
      siteName: 'MyCakeAleks',
      images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.svg'],
    },
    verification: {
      other: {
        'msvalidate.01': 'E9110B5F43309068CDD97BC070157F7A',
        'yandex-verification': 'b316fca111f6c421',
      },
    },
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#d4537e',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocales = ['tr', 'ru', 'en']
  const safeLocale = validLocales.includes(locale) ? locale : 'tr'
  const messages = (await import(`../../messages/${safeLocale}.json`)).default

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyCakeAleks" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://vz-92cbb18d-f79.b-cdn.net" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <YandexMetrika />
        <GoogleAnalytics />
        <CrispChat />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(){});
            });
          }
        `}} />
      </body>
    </html>
  )
}

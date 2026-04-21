import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
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
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

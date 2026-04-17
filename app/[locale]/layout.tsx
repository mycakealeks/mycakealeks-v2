import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import './styles.css'

export const metadata: Metadata = {
  title: 'MyCakeAleks',
  description: 'Профессиональные курсы и рецепты',
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

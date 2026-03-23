import type { Metadata } from 'next'
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

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}

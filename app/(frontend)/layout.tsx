import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'MyCakeAleks',
  description: 'Профессиональные курсы и рецепты кондитерского искусства',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

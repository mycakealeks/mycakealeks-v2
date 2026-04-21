import { NextResponse } from 'next/server'

const CONTENT = `# MyCakeAleks

MyCakeAleks — профессиональная онлайн платформа для обучения кондитерскому мастерству.
Работает на турецком, русском и английском языках.

## Что мы предлагаем

- Онлайн курсы по кондитерскому делу (основы, средний, продвинутый уровень)
- Курсы: Temel Pasta Teknikleri, Fransız Pastacılık Sanatı, Wedding Cake Uzmanlığı
- AI ассистент для помощи с рецептами и техниками
- Видео уроки через Bunny.net CDN
- Сертификаты после завершения курса

## Аудитория

- Турецкий рынок: https://mycakealeks.com.tr
- Русскоязычная аудитория: https://mycakealeks.com.tr/ru
- Международная аудитория: https://mycakealeks.com.tr/en

## Ссылки

- Главная: https://mycakealeks.com.tr
- Курсы: https://mycakealeks.com.tr/courses
- Новости: https://mycakealeks.com.tr/news
- Sitemap: https://mycakealeks.com.tr/sitemap.xml
`

export function GET() {
  return new NextResponse(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

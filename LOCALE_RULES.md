# Правила локализации MyCakeAleks

## Как работает система локализации

- Локали: `tr` (дефолтная, без префикса), `ru`, `en`
- Турецкий: `/courses`, `/shop` — без префикса
- Русский: `/ru/courses`, `/ru/shop`
- Английский: `/en/courses`, `/en/shop`

## Алгоритм middleware (middleware.ts)

1. `/admin/*` → rate limiting + проверка роли
2. `/ru` или `/en` (без слеша) → server-side rewrite на `/ru/` (обход nginx)
3. Если в URL есть `/ru/` или `/en/` → уважаем выбор, НЕ редиректим
4. Если cookie `preferred-locale` установлен → уважаем выбор, НЕ редиректим
5. Если cookie `preferred-locale` = ru/en → редиректим на `/{locale}{path}` (даже если URL без префикса)
   Если cookie не задан → определяем язык из Accept-Language, редиректим и ставим cookie
6. Передаём в next-intl

## Правила при добавлении новых СТРАНИЦ

### Обязательно:
```tsx
// ✅ Правильно
import { Link } from '@/i18n/navigation'        // НЕ из 'next/link'
import { useTranslations } from 'next-intl'     // клиентские компоненты
import { getTranslations } from 'next-intl/server' // серверные компоненты

// ❌ Запрещено
import Link from 'next/link'                    // ломает локализацию ссылок
const text = 'Sepete Ekle'                     // хардкод текста
```

### Добавить переводы во все три файла:
- `messages/tr.json` — турецкий
- `messages/ru.json` — русский
- `messages/en.json` — английский

### Шаблон серверного компонента:
```tsx
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function MyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  return <Link href="/shop">{t('nav.shop')}</Link>
}
```

### Шаблон клиентского компонента:
```tsx
'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function MyComponent() {
  const t = useTranslations()
  return <Link href="/shop">{t('nav.shop')}</Link>
}
```

## Правила при добавлении API роутов

- `/api/*` — автоматически **исключены** из middleware (не нуждаются в локализации)
- Не добавляй локаль в API пути: `/api/shop/products` (не `/api/ru/shop/products`)

## Правила для серверных → клиентских компонентов

```tsx
// ❌ Нельзя — функцию t() нельзя передавать как prop
<ClientComponent t={t} />

// ✅ Правильно — клиент сам вызывает useTranslations()
// В клиентском компоненте:
const t = useTranslations()
```

## LanguageSwitcher

Работает через:
1. Синхронная установка cookie `preferred-locale` (через `document.cookie`)
2. Навигация на `/${locale}${currentPath}`

Cookie `preferred-locale` живёт 365 дней. Удали его через DevTools → Application → Cookies
для тестирования авто-детекта.

## Диагностика проблем с локалью

```bash
# Проверить что страница отдаёт 200 для всех локалей
curl -s https://mycakealeks.com.tr/ru/courses -o /dev/null -w "%{http_code}"
curl -s https://mycakealeks.com.tr/en/courses -o /dev/null -w "%{http_code}"

# Проверить что редиректов нет
curl -sI https://mycakealeks.com.tr/ru/courses | grep -E "HTTP|location"

# Валидация JSON переводов
python3 -c "
import json
for lang in ['tr', 'ru', 'en']:
    try:
        with open(f'messages/{lang}.json') as f: json.load(f)
        print(f'{lang}.json: OK')
    except Exception as e:
        print(f'{lang}.json: ERROR - {e}')
"
```

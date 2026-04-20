import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getPayload } from 'payload'
import config from '@payload-config'

const client = new Anthropic()

function textToLexical(text: string) {
  const paragraphs = text.split('\n\n').filter((p) => p.trim())
  return {
    root: {
      type: 'root',
      children: paragraphs.map((para) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: para.trim(), version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

const PROMPTS: Record<string, string> = {
  tr: `Sen bir pastacılık ve kek dünyası dergisinin editörüsün. Türk pasta ve tatlı sektörüne yönelik 5 özgün haber yaz. Türkçe yaz.

Türkiye'deki trendler, yerel tatlar, Türk pastacılar, bayram tatlıları (baklava, künefe, lokum), yerel malzemeler, İstanbul/Ankara pastane kültürü hakkında olsun.

Kategoriler: trends, recipes, techniques, business, inspiration — Her kategoriden en az bir haber olsun.

Her haberin şu alanları olmalı:
- title: ilgi çekici başlık
- excerpt: 2 cümlelik kısa özet
- content: 3-4 paragraf tam metin (paragrafları \\n\\n ile ayır)
- category: trends | recipes | techniques | business | inspiration
- emoji: konuya uygun bir emoji

SADECE geçerli bir JSON dizisi döndür, başka hiçbir şey yazma, markdown kullanma:
[{"title":"...","excerpt":"...","content":"...","category":"...","emoji":"..."}]`,

  ru: `Ты редактор кондитерского журнала. Напиши 5 новостей о кондитерском деле для русскоязычной аудитории. Пиши на русском языке.

Темы: тренды в России и СНГ, популярные рецепты (наполеон, медовик, птичье молоко), советские классические торты, современные техники, бизнес кондитера, московские и петербургские кондитерские.

Категории: trends, recipes, techniques, business, inspiration — минимум по одной новости в каждой категории.

Каждая новость должна содержать:
- title: привлекательный заголовок
- excerpt: краткое описание в 2 предложения
- content: 3-4 абзаца полного текста (абзацы разделяй \\n\\n)
- category: trends | recipes | techniques | business | inspiration
- emoji: подходящий эмодзи

Верни ТОЛЬКО валидный JSON-массив, без пояснений и markdown:
[{"title":"...","excerpt":"...","content":"...","category":"...","emoji":"..."}]`,

  en: `You are an editor of a professional pastry and cake magazine. Write 5 original news articles for an international audience. Write in English.

Topics: global pastry trends, French/Italian/Japanese techniques, international cake competitions, celebrity cakes, business tips for pastry chefs, innovative ingredients, award-winning bakeries worldwide.

Categories: trends, recipes, techniques, business, inspiration — at least one article per category.

Each article must have:
- title: compelling headline
- excerpt: 2-sentence summary
- content: 3-4 paragraphs of full text (separate paragraphs with \\n\\n)
- category: trends | recipes | techniques | business | inspiration
- emoji: relevant emoji

Return ONLY a valid JSON array, no explanation, no markdown:
[{"title":"...","excerpt":"...","content":"...","category":"...","emoji":"..."}]`,
}

type NewsItem = { title: string; excerpt: string; content: string; category: string; emoji: string }

async function generateForLocale(locale: string): Promise<NewsItem[]> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: PROMPTS[locale] }],
  })
  const raw = (message.content[0] as any).text as string
  const jsonStart = raw.indexOf('[')
  const jsonEnd = raw.lastIndexOf(']') + 1
  return JSON.parse(raw.slice(jsonStart, jsonEnd))
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Generate all three locales in parallel
    const [trItems, ruItems, enItems] = await Promise.all([
      generateForLocale('tr'),
      generateForLocale('ru'),
      generateForLocale('en'),
    ])

    const payload = await getPayload({ config })
    const today = new Date().toISOString().slice(0, 10)
    const created: Record<string, string[]> = { tr: [], ru: [], en: [] }

    for (const [locale, items] of [['tr', trItems], ['ru', ruItems], ['en', enItems]] as const) {
      for (const item of items) {
        const baseSlug = slugify(item.title)
        const slug = `${locale}-${baseSlug}-${Date.now().toString(36)}`
        await payload.create({
          collection: 'news',
          data: {
            title: item.title,
            slug,
            excerpt: item.excerpt,
            content: textToLexical(item.content),
            category: item.category as any,
            coverEmoji: item.emoji || '🎂',
            publishedAt: today,
            locale,
            status: 'draft',
            featured: false,
          },
          overrideAccess: true,
        })
        created[locale].push(item.title)
      }
    }

    return NextResponse.json({ ok: true, created, total: 15 })
  } catch (err: any) {
    console.error('News generate error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

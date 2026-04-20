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

const PROMPT = `Sen bir pastacılık ve kek dünyası dergisinin editörüsün. Bugün için 5 adet özgün haber taslağı yaz. Türkçe yaz.

Kategoriler: trends (trendler), recipes (tarifler), techniques (teknikler), business (iş dünyası), inspiration (ilham)
Her kategoriden en az bir haber olsun.

Her haberin şu alanları olmalı:
- title: ilgi çekici başlık
- excerpt: 2 cümlelik kısa özet
- content: 3-4 paragraf tam metin (paragrafları \\n\\n ile ayır)
- category: trends | recipes | techniques | business | inspiration
- emoji: konuya uygun bir emoji

SADECE geçerli bir JSON dizisi döndür, başka hiçbir şey yazma, markdown kullanma:
[{"title":"...","excerpt":"...","content":"...","category":"...","emoji":"..."}]`

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: PROMPT }],
    })

    const raw = (message.content[0] as any).text as string
    const jsonStart = raw.indexOf('[')
    const jsonEnd = raw.lastIndexOf(']') + 1
    const jsonStr = raw.slice(jsonStart, jsonEnd)
    const items: Array<{
      title: string
      excerpt: string
      content: string
      category: string
      emoji: string
    }> = JSON.parse(jsonStr)

    const payload = await getPayload({ config })
    const today = new Date().toISOString().slice(0, 10)
    const created: string[] = []

    for (const item of items) {
      const baseSlug = slugify(item.title)
      const slug = `${baseSlug}-${Date.now().toString(36)}`
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
          status: 'draft',
          featured: false,
        },
        overrideAccess: true,
      })
      created.push(item.title)
    }

    return NextResponse.json({ ok: true, created })
  } catch (err: any) {
    console.error('News generate error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

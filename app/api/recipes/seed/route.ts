import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const DEMO_RECIPES = [
  {
    title: 'Temel Kek Hamuru',
    slug: 'temel-kek-hamuru',
    description: 'Her kek tarifinin temelini oluşturan klasik kek hamuru. Yumuşak, kabarık ve lezzetli.',
    difficulty: 'easy',
    prepTime: 30,
    category: 'dough',
    coverEmoji: '🎂',
    price: 0,
    isFree: true,
    status: 'published',
    ingredients: [
      { name: 'Un', amount: '200g' },
      { name: 'Şeker', amount: '150g' },
      { name: 'Tereyağı', amount: '100g' },
      { name: 'Yumurta', amount: '3 adet' },
      { name: 'Süt', amount: '100ml' },
      { name: 'Kabartma tozu', amount: '1 tatlı kaşığı' },
      { name: 'Vanilin', amount: '1 paket' },
    ],
  },
  {
    title: 'Çikolatalı Ganaj',
    slug: 'cikolatali-ganaj',
    description: 'Pastalar için mükemmel çikolatalı ganaj. Hem kaplama hem de dolgu olarak kullanılabilir.',
    difficulty: 'medium',
    prepTime: 20,
    category: 'cream',
    coverEmoji: '🍫',
    price: 0,
    isFree: true,
    status: 'published',
    ingredients: [
      { name: 'Bitter çikolata', amount: '200g' },
      { name: 'Krema', amount: '200ml' },
      { name: 'Tereyağı', amount: '30g' },
      { name: 'Glikoz şurubu', amount: '1 yemek kaşığı' },
    ],
  },
  {
    title: 'Fondant Kaplama',
    slug: 'fondant-kaplama',
    description: 'Profesyonel düğün pastası görünümü için kullanılan fondant kaplama tekniği. Tüm sırlar bu tarifte.',
    difficulty: 'hard',
    prepTime: 90,
    category: 'decoration',
    coverEmoji: '🎀',
    price: 99,
    isFree: false,
    status: 'published',
    ingredients: [
      { name: 'Şeker fondanı', amount: '500g' },
      { name: 'Pudra şekeri', amount: '200g' },
      { name: 'Glikoz', amount: '2 yemek kaşığı' },
      { name: 'Su', amount: '3 yemek kaşığı' },
      { name: 'Jelatin', amount: '10g' },
    ],
  },
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })
    const created = []

    for (const recipe of DEMO_RECIPES) {
      const existing = await payload.find({
        collection: 'recipes',
        where: { slug: { equals: recipe.slug } },
        limit: 1,
      })
      if (existing.totalDocs > 0) continue

      const doc = await payload.create({ collection: 'recipes', data: recipe as any })
      created.push(doc.id)
    }

    return NextResponse.json({ ok: true, created: created.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

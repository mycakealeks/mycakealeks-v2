#!/usr/bin/env node
/**
 * Shop seed script — creates demo vendor + 6 demo products.
 * Usage: NEXT_PUBLIC_SERVER_URL=https://mycakealeks.com.tr node scripts/seed-shop.mjs
 * Requires admin credentials in env or defaults.
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@mycakealeks.com'
const ADMIN_PASS = process.env.SEED_ADMIN_PASS || 'Admin123!'

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  if (!res.ok) throw new Error('Login failed: ' + (await res.text()))
  const data = await res.json()
  return data.token
}

async function post(token, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`POST ${path} failed: ${JSON.stringify(data)}`)
  return data.doc ?? data
}

const PRODUCTS = [
  {
    name: 'Callebaut Bitter Çikolata 1kg',
    slug: 'callebaut-bitter-cikolata-1kg',
    description: 'Belçika\'nın ünlü Callebaut markasının %54.5 kakao içerikli bitter çikolatası. Ganache, mousse ve kaplama için idealdir.',
    category: 'chocolate',
    price: 450,
    oldPrice: 580,
    stock: 50,
    inStock: true,
    isFeatured: true,
    status: 'published',
  },
  {
    name: 'Silikon Pasta Kalıbı Seti',
    slug: 'silikon-pasta-kalibi-seti',
    description: '6 farklı şekil içeren profesyonel silikon kalıp seti. Yuvarlak, kare, kalp, yıldız, çiçek ve oval formlar. Gıda güvenli silikon.',
    category: 'molds',
    price: 280,
    oldPrice: null,
    stock: 30,
    inStock: true,
    isFeatured: false,
    status: 'published',
  },
  {
    name: 'Pasta Spatula Seti',
    slug: 'pasta-spatula-seti',
    description: 'Paslanmaz çelik 5\'li spatula seti: düz, açılı ve dişli spatulalar. Krem yayma ve kenar düzeltme için profesyonel kalite.',
    category: 'tools',
    price: 180,
    oldPrice: 240,
    stock: 25,
    inStock: true,
    isFeatured: false,
    status: 'published',
  },
  {
    name: 'Gül Şeker Çiçek Kalıpları',
    slug: 'gul-seker-cicek-kaliplari',
    description: '12 parçalık gül ve çiçek yapımı için silikon kalıp seti. Şeker hamuru, fondant ve gum paste ile kullanım için uygundur.',
    category: 'decoration',
    price: 120,
    oldPrice: null,
    stock: 40,
    inStock: true,
    isFeatured: true,
    status: 'published',
  },
  {
    name: 'Pasta Kutuları 10\'lu Set',
    slug: 'pasta-kutulari-10lu-set',
    description: 'Beyaz karton pasta kutuları 10\'lu set. 25x25x10 cm ölçüsünde, pencereli kapak. Teslimat ve hediye sunumu için idealdir.',
    category: 'packaging',
    price: 95,
    oldPrice: null,
    stock: 100,
    inStock: true,
    isFeatured: false,
    status: 'published',
  },
  {
    name: 'Gıda Boyası Seti 12 Renk',
    slug: 'gida-boyasi-seti-12-renk',
    description: '12 renk jel gıda boyası seti. Yoğun pigment, az miktarda çarpıcı renkler elde edilir. Krema, fondant ve hamur boyama için.',
    category: 'decoration',
    price: 220,
    oldPrice: 290,
    stock: 35,
    inStock: true,
    isFeatured: false,
    status: 'published',
  },
]

async function main() {
  console.log('🛍️  Seeding shop...')
  const token = await login()
  console.log('✅ Logged in')

  // Create demo vendor
  let vendor
  try {
    vendor = await post(token, '/api/vendors', {
      name: 'MyCakeAleks Store',
      slug: 'mycakealeks-store',
      description: 'MyCakeAleks platformunun resmi malzeme mağazası',
      commissionRate: 0,
      status: 'active',
      contactEmail: 'store@mycakealeks.com.tr',
    })
    console.log('✅ Vendor created:', vendor.name)
  } catch (e) {
    console.warn('⚠️  Vendor may already exist:', e.message)
    // Try to fetch existing
    const res = await fetch(`${BASE}/api/vendors?where[slug][equals]=mycakealeks-store`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const data = await res.json()
    vendor = data.docs?.[0]
    if (!vendor) throw new Error('Cannot find or create vendor')
  }

  // Create products
  for (const product of PRODUCTS) {
    try {
      const created = await post(token, '/api/products', {
        ...product,
        vendor: vendor.id,
      })
      console.log(`✅ Product: ${created.name} — ${created.price} TRY`)
    } catch (e) {
      console.warn(`⚠️  Skipped ${product.name}:`, e.message)
    }
  }

  console.log('\n🎉 Shop seed complete!')
  console.log(`   Visit: ${BASE}/shop`)
}

main().catch((e) => { console.error('❌ Seed error:', e.message); process.exit(1) })

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

function makeSvg(size) {
  const r = Math.round(size * 0.22)
  const fontSize = Math.round(size * 0.52)
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#d4537e"/>
  <text x="50%" y="54%" font-size="${fontSize}" font-family="Georgia,serif" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">M</text>
</svg>`)
}

await sharp(makeSvg(192)).png().toFile(join(publicDir, 'icon-192.png'))
console.log('✓ icon-192.png')
await sharp(makeSvg(512)).png().toFile(join(publicDir, 'icon-512.png'))
console.log('✓ icon-512.png')

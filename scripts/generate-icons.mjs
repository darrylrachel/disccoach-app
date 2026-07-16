// One-off generator for PWA icon assets from the brand-mark SVG.
// Run with `node scripts/generate-icons.mjs` whenever public/icons/icon.svg changes.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + '/..'
const iconsDir = path.join(rootDir, 'public', 'icons')
const svgPath = path.join(iconsDir, 'icon.svg')
const svg = readFileSync(svgPath)

const BRAND_BG = '#0A0A0A'

// Maskable icons need ~20% padding on each side so the safe zone (the
// center ~80%) isn't clipped when platforms crop to a circle/squircle.
async function generateMaskable(size, outFile) {
  const artworkSize = Math.round(size * 0.6)
  const artwork = await sharp(svg).resize(artworkSize, artworkSize).toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 4, background: BRAND_BG },
  })
    .composite([{ input: artwork, gravity: 'center' }])
    .png()
    .toFile(outFile)
}

async function generateAny(size, outFile) {
  await sharp(svg).resize(size, size).png().toFile(outFile)
}

async function generateAppleTouchIcon(outFile) {
  // Apple ignores alpha and shows black where it's transparent, so flatten
  // onto the brand background instead of leaving it transparent.
  await sharp(svg).resize(180, 180).flatten({ background: BRAND_BG }).png().toFile(outFile)
}

await Promise.all([
  generateAny(192, path.join(iconsDir, 'icon-192.png')),
  generateAny(512, path.join(iconsDir, 'icon-512.png')),
  generateMaskable(192, path.join(iconsDir, 'icon-maskable-192.png')),
  generateMaskable(512, path.join(iconsDir, 'icon-maskable-512.png')),
  generateAppleTouchIcon(path.join(iconsDir, 'apple-touch-icon.png')),
])

console.log('Generated icon-192.png, icon-512.png, icon-maskable-192.png, icon-maskable-512.png, apple-touch-icon.png')

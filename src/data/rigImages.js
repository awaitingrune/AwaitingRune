import pcShowcase from '../assets/pc-showcase.webp'

// Real photos are picked up automatically by filename: drop an image into
// src/assets/rigs/ named after the prebuilt id (e.g. fehu.webp, starter.jpg)
// or a case id (e.g. case-tower.webp) and it replaces the illustration for
// that rig / that case in the custom-build preview. No code changes needed.
const dropIns = import.meta.glob('../assets/rigs/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byName = Object.fromEntries(
  Object.entries(dropIns).map(([path, url]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), url])
)

export const RIG_IMAGES = {
  sowilo: pcShowcase,
  ...byName,
}

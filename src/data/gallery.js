import purpleVeil from '../assets/gallery/purple-veil.webp'
import frost from '../assets/gallery/frost.webp'
import shadow from '../assets/gallery/shadow.webp'
import onyx from '../assets/gallery/onyx.webp'
import eclipse from '../assets/gallery/eclipse.webp'
import voidBuild from '../assets/gallery/void.webp'

export { default as galleryHero } from '../assets/gallery/hero.webp'

export const GALLERY_FILTERS = [
  { key: 'all', label: 'All Builds' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'white', label: 'White' },
  { key: 'purple', label: 'Purple' },
  { key: 'blackout', label: 'Blackout' },
  { key: 'rgb', label: 'RGB' },
]

// Showcase builds, newest first. Swap `image` for a photo of a real build
// (drop it in src/assets/gallery and import it above) as you finish new ones.
export const GALLERY = [
  {
    id: 'purple-veil',
    name: 'Rune // Purple Veil',
    tagline: 'Power meets aesthetics',
    image: purpleVeil,
    price: 1899,
    filters: ['gaming', 'purple', 'rgb'],
    tags: ['1440p Gaming', 'High FPS', 'Custom Aesthetic'],
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 5070 Ti',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe SSD',
      motherboard: 'MSI B650 Gaming Plus WiFi',
    },
  },
  {
    id: 'frost',
    name: 'Rune // Frost',
    tagline: 'Clean. Powerful. Timeless.',
    image: frost,
    price: 1599,
    filters: ['gaming', 'white', 'rgb'],
    tags: ['1440p Gaming', 'Streaming', 'Clean Build'],
    specs: {
      cpu: 'AMD Ryzen 7 7700X',
      gpu: 'NVIDIA RTX 4070 Super',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe SSD',
      motherboard: 'ASUS TUF B650-Plus WiFi',
    },
  },
  {
    id: 'shadow',
    name: 'Rune // Shadow',
    tagline: 'Stealth performance',
    image: shadow,
    price: 2499,
    filters: ['gaming', 'blackout', 'purple', 'rgb'],
    tags: ['4K Gaming', 'High FPS', 'Premium Build'],
    specs: {
      cpu: 'Intel Core i7-14700K',
      gpu: 'NVIDIA RTX 4080 Super',
      ram: '32GB DDR5 7200MHz',
      storage: '2TB NVMe SSD',
      motherboard: 'MSI Z790 Gaming Plus WiFi',
    },
  },
  {
    id: 'onyx',
    name: 'Rune // Onyx',
    tagline: 'Simple. Clean. Deadly.',
    image: onyx,
    price: 999,
    filters: ['gaming', 'blackout'],
    tags: ['1080p Gaming', 'Great Value', 'Compact'],
    specs: {
      cpu: 'AMD Ryzen 5 7600',
      gpu: 'NVIDIA RTX 4060 Ti',
      ram: '16GB DDR5 5600MHz',
      storage: '1TB NVMe SSD',
      motherboard: 'ASUS Prime B650M-A WiFi',
    },
  },
  {
    id: 'eclipse',
    name: 'Rune // Eclipse',
    tagline: 'Built for more',
    image: eclipse,
    price: 3499,
    filters: ['gaming', 'purple', 'rgb'],
    tags: ['4K Gaming', 'Content Creation', 'No Compromises'],
    specs: {
      cpu: 'AMD Ryzen 9 7950X3D',
      gpu: 'NVIDIA RTX 4090',
      ram: '64GB DDR5 6000MHz',
      storage: '4TB NVMe SSD',
      motherboard: 'ASUS ROG Crosshair X670E',
    },
  },
  {
    id: 'void',
    name: 'Rune // Void',
    tagline: 'Darkness has purpose',
    image: voidBuild,
    price: 1749,
    filters: ['gaming', 'purple', 'blackout'],
    tags: ['1440p Gaming', 'Stylish', 'Custom Design'],
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 5070',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe SSD',
      motherboard: 'MSI B650 Gaming Plus WiFi',
    },
  },
]

export const SPEC_LABELS = {
  cpu: 'Processor',
  gpu: 'Graphics',
  ram: 'Memory',
  storage: 'Storage',
  motherboard: 'Motherboard',
}

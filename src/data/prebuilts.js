import { CATEGORIES, findPart } from './parts.js'

export function resolveBuild(partIds) {
  return Object.fromEntries(CATEGORIES.map((c) => [c.key, findPart(c.key, partIds[c.key])]))
}

export const PREBUILT_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'workstation', label: 'Workstations' },
]

export const PREBUILTS = [
  {
    id: 'starter',
    category: 'gaming',
    tier: 'Starter',
    name: 'Wayfarer Rig',
    blurb: '1080p gaming and everyday work without the premium price tag.',
    partIds: {
      cpu: 'cpu-iron6',
      motherboard: 'mb-ward-b760m',
      ram: 'ram-32-ddr4',
      gpu: 'gpu-ember700',
      storage: 'sto-nvme-1tb',
      cooler: 'cool-air',
      psu: 'psu-650',
      case: 'case-tower',
    },
  },
  {
    id: 'performance',
    category: 'gaming',
    tier: 'Performance',
    name: 'Sigilstrike Rig',
    blurb: 'High refresh 1440p gaming and heavier creative workloads.',
    partIds: {
      cpu: 'cpu-neb8',
      motherboard: 'mb-glyph-b650',
      ram: 'ram-32-ddr5',
      gpu: 'gpu-void90',
      storage: 'sto-nvme-2tb',
      cooler: 'cool-aio240',
      psu: 'psu-650',
      case: 'case-tower',
    },
    featured: true,
  },
  {
    id: 'elite',
    category: 'gaming',
    tier: 'Elite',
    name: 'Runeforged Rig',
    blurb: '4K gaming and full-throttle rendering, no compromises.',
    partIds: {
      cpu: 'cpu-rune12',
      motherboard: 'mb-glyph-x670',
      ram: 'ram-64-ddr5',
      gpu: 'gpu-void90ti',
      storage: 'sto-nvme-2tb',
      cooler: 'cool-aio360',
      psu: 'psu-1000',
      case: 'case-elite',
    },
  },
  {
    id: 'creator',
    category: 'workstation',
    tier: 'Creator',
    name: 'Forgehand Rig',
    blurb: 'Editing, compiling, and multitasking with RAM to spare.',
    partIds: {
      cpu: 'cpu-iron10',
      motherboard: 'mb-ward-z790',
      ram: 'ram-64-ddr5',
      gpu: 'gpu-void90',
      storage: 'sto-nvme-2tb',
      cooler: 'cool-aio240',
      psu: 'psu-850',
      case: 'case-tower',
    },
  },
  {
    id: 'studio-pro',
    category: 'workstation',
    tier: 'Studio Pro',
    name: 'Anvilcore Rig',
    blurb: 'Serious render and export times for full-time creative work.',
    partIds: {
      cpu: 'cpu-rune12',
      motherboard: 'mb-glyph-x670',
      ram: 'ram-64-ddr5',
      gpu: 'gpu-ember800',
      storage: 'sto-nvme-2tb',
      cooler: 'cool-aio360',
      psu: 'psu-1000',
      case: 'case-elite',
    },
  },
]

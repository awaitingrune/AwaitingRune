// Real product names and technical specs (socket, wattage, form factor, etc.)
// drive the compatibility engine. Each part has a `retail` price: what the part
// costs at a UK retailer including VAT. The price a customer pays is worked out
// from it below (retail + a small markup), and a build & test fee is added once
// per PC.
//
// RETAIL PRICES: taken from Scan (scan.co.uk) on 7 Oct 2026, cheapest reputable
// in-stock model of each part. Prices move daily, and GPU, memory and SSD
// prices have been especially volatile, so re-check them before you sell.
// Parts marked "unverified" could not be confirmed at that date.
//
// This lives outside src/ so both the frontend (Vite) and the Netlify
// Function that creates Stripe Checkout sessions can import the same
// source of truth — the server never trusts a price sent by the client.

// Added on top of the retail price of every part (10%). It covers delivery of
// parts to the workshop, payment fees, returns and price movement between order
// and purchase. Change this one number to move every price on the site.
export const MARKUP = 0.1

// Charged once per PC. Roughly three hours of hands-on work at about £33/hour.
export const LABOUR = {
  id: 'labour',
  name: 'Build & test',
  price: 99,
  hours: 3,
  includes: [
    'Hand assembly of every part',
    'Tidy cable management',
    'Stress test under load before it ships',
    'Careful packing for insured delivery',
  ],
}

export const CATEGORIES = [
  { key: 'cpu', label: 'Processor (CPU)' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'gpu', label: 'Graphics Card (GPU)' },
  { key: 'storage', label: 'Storage' },
  { key: 'cooler', label: 'CPU Cooler' },
  { key: 'psu', label: 'Power Supply' },
  { key: 'case', label: 'Case' },
]

export const PARTS = {
  cpu: [
    { id: 'cpu-neb6', name: 'AMD Ryzen 5 7600', socket: 'AM5', tdp: 65, cores: 6, retail: 169.99 },
    { id: 'cpu-neb8', name: 'AMD Ryzen 7 7700X', socket: 'AM5', tdp: 105, cores: 8, retail: 251.99 },
    { id: 'cpu-rune12', name: 'AMD Ryzen 9 7900X', socket: 'AM5', tdp: 170, cores: 12, retail: 329.99 },
    { id: 'cpu-iron6', name: 'Intel Core i5-14400F', socket: 'LGA1700', tdp: 65, cores: 10, retail: 155.99 },
    { id: 'cpu-iron10', name: 'Intel Core i7-14700K', socket: 'LGA1700', tdp: 125, cores: 20, retail: 359.99 },
    { id: 'cpu-x3d8', name: 'AMD Ryzen 7 7800X3D', socket: 'AM5', tdp: 120, cores: 8, retail: 338.99 },
    { id: 'cpu-9600x', name: 'AMD Ryzen 5 9600X', socket: 'AM5', tdp: 65, cores: 6, retail: 189.98 },
    { id: 'cpu-9700x', name: 'AMD Ryzen 7 9700X', socket: 'AM5', tdp: 65, cores: 8, retail: 274.99 },
    { id: 'cpu-9800x3d', name: 'AMD Ryzen 7 9800X3D', socket: 'AM5', tdp: 120, cores: 8, retail: 384.98 },
    { id: 'cpu-9900x', name: 'AMD Ryzen 9 9900X', socket: 'AM5', tdp: 120, cores: 12, retail: 359.99 },
    { id: 'cpu-9950x', name: 'AMD Ryzen 9 9950X', socket: 'AM5', tdp: 170, cores: 16, retail: 499.99 },
    { id: 'cpu-9950x3d', name: 'AMD Ryzen 9 9950X3D', socket: 'AM5', tdp: 170, cores: 16, retail: 569.99 },
  ],
  // The ids below keep their old names so existing builds still resolve; the
  // products are the current equivalents of the boards that were discontinued.
  motherboard: [
    { id: 'mb-glyph-b650', name: 'ASUS ROG Strix B650-A Gaming WiFi', socket: 'AM5', ramType: 'DDR5', maxRamGB: 128, formFactor: 'ATX', retail: 169.99 },
    { id: 'mb-glyph-x670', name: 'ASUS ROG Crosshair X870E Hero', socket: 'AM5', ramType: 'DDR5', maxRamGB: 192, formFactor: 'ATX', retail: 414.98 },
    { id: 'mb-sigil-b650m', name: 'MSI MAG B850M Mortar WiFi', socket: 'AM5', ramType: 'DDR5', maxRamGB: 192, formFactor: 'mATX', retail: 199.99 },
    { id: 'mb-ward-z790', name: 'ASUS PRIME Z790-P WIFI', socket: 'LGA1700', ramType: 'DDR5', maxRamGB: 128, formFactor: 'ATX', retail: 169.98 },
    { id: 'mb-ward-b760m', name: 'MSI PRO B760M-P DDR4', socket: 'LGA1700', ramType: 'DDR4', maxRamGB: 64, formFactor: 'mATX', retail: 89.99 },
    { id: 'mb-pro-b650', name: 'MSI PRO B850-S EVO WiFi', socket: 'AM5', ramType: 'DDR5', maxRamGB: 192, formFactor: 'ATX', retail: 149.99, quiet: true },
  ],
  ram: [
    { id: 'ram-16-ddr5', name: 'Corsair Vengeance 16GB (2x8GB) DDR5-6000', type: 'DDR5', capacityGB: 16, speedMTs: 6000, retail: 239.99 },
    { id: 'ram-32-ddr5', name: 'Corsair Vengeance 32GB (2x16GB) DDR5-6000', type: 'DDR5', capacityGB: 32, speedMTs: 6000, retail: 459.98 },
    { id: 'ram-64-ddr5', name: 'Corsair Vengeance 64GB (2x32GB) DDR5-6000', type: 'DDR5', capacityGB: 64, speedMTs: 6000, retail: 879.98 },
    { id: 'ram-32-ddr4', name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200', type: 'DDR4', capacityGB: 32, speedMTs: 3200, retail: 280.99 },
  ],
  // Current-generation NVIDIA cards only. The RTX 40 series and Radeon 7000
  // cards were no longer on sale at UK retailers on the date above.
  gpu: [
    { id: 'gpu-5060', name: 'NVIDIA GeForce RTX 5060 8GB', tdp: 145, lengthMm: 240, vramGB: 8, psuW: 550, retail: 369.98 },
    { id: 'gpu-5060ti', name: 'NVIDIA GeForce RTX 5060 Ti 16GB', tdp: 180, lengthMm: 240, vramGB: 16, psuW: 600, retail: 659.99 },
    { id: 'gpu-5070', name: 'NVIDIA GeForce RTX 5070 12GB', tdp: 250, lengthMm: 242, vramGB: 12, psuW: 650, retail: 769.99 },
    { id: 'gpu-5070ti', name: 'NVIDIA GeForce RTX 5070 Ti 16GB', tdp: 300, lengthMm: 300, vramGB: 16, psuW: 750, retail: 1099.99 },
    { id: 'gpu-5080', name: 'NVIDIA GeForce RTX 5080 16GB', tdp: 360, lengthMm: 304, vramGB: 16, psuW: 850, retail: 1309.99 },
    { id: 'gpu-5090', name: 'NVIDIA GeForce RTX 5090 32GB', tdp: 575, lengthMm: 304, vramGB: 32, psuW: 1000, retail: 4439.99 },
  ],
  storage: [
    { id: 'sto-sata-1tb', name: 'PNY CS900 1TB SATA SSD', capacityGB: 1000, retail: 119.99 },
    { id: 'sto-nvme-1tb', name: 'WD Black SN7100 1TB NVMe SSD', capacityGB: 1000, retail: 159.98 },
    { id: 'sto-nvme-2tb', name: 'Samsung 990 Pro 2TB NVMe SSD (heatsink)', capacityGB: 2000, retail: 359.99 },
    { id: 'sto-nvme-4tb', name: 'WD Black SN850X 4TB NVMe SSD', capacityGB: 4000, retail: 469.98 },
  ],
  cooler: [
    { id: 'cool-air', name: 'Cooler Master Hyper 212 Black', sockets: ['AM5', 'LGA1700'], tdpRatingW: 150, rgb: false, retail: 20.99 },
    // unverified: not listed at Scan on the check date
    { id: 'cool-air-pro', name: 'Thermalright Peerless Assassin 120 SE', sockets: ['AM5', 'LGA1700'], tdpRatingW: 245, rgb: false, retail: 34.99 },
    { id: 'cool-noctua', name: 'Noctua NH-D15 chromax.black', sockets: ['AM5', 'LGA1700'], tdpRatingW: 250, rgb: false, retail: 109.99, quiet: true },
    { id: 'cool-aio240', name: 'Arctic Liquid Freezer III Pro 240 A-RGB (240mm AIO)', sockets: ['AM5', 'LGA1700'], tdpRatingW: 250, rgb: true, retail: 69.98 },
    { id: 'cool-aio360', name: 'Corsair Nautilus 360 RS ARGB (360mm AIO)', sockets: ['AM5', 'LGA1700'], tdpRatingW: 350, rgb: true, retail: 99.98 },
  ],
  psu: [
    { id: 'psu-550', name: 'Corsair CX550 550W 80+ Bronze', wattage: 550, retail: 49.99 },
    { id: 'psu-650', name: 'Corsair RM650e 650W 80+ Gold', wattage: 650, retail: 79.99 },
    { id: 'psu-750', name: 'Corsair RM750x 750W 80+ Gold', wattage: 750, retail: 124.99 },
    { id: 'psu-850', name: 'Corsair RM850x 850W 80+ Gold', wattage: 850, retail: 139.99 },
    { id: 'psu-1000', name: 'Corsair HX1000i SHIFT 1000W 80+ Platinum', wattage: 1000, retail: 219.98 },
    { id: 'psu-1200', name: 'Corsair HX1200i 1200W 80+ Platinum', wattage: 1200, retail: 244.99 },
    { id: 'psu-quiet-750', name: 'be quiet! Pure Power 13 M 750W 80+ Gold', wattage: 750, retail: 99.98, quiet: true },
  ],
  case: [
    { id: 'case-mini', name: 'Fractal Design Pop Mini Air RGB', formFactors: ['mATX'], maxGpuLengthMm: 335, retail: 89.99 },
    { id: 'case-tower', name: 'NZXT H5 Flow', formFactors: ['ATX', 'mATX'], maxGpuLengthMm: 365, retail: 59.99 },
    { id: 'case-elite', name: 'Lian Li O11 Dynamic EVO XL', formFactors: ['ATX', 'mATX'], maxGpuLengthMm: 420, retail: 195.98 },
    { id: 'case-silent', name: 'Fractal Design Define 7', formFactors: ['ATX', 'mATX'], maxGpuLengthMm: 315, retail: 154.99, quiet: true },
  ],
}

// The price a customer pays for each part: retail plus the markup, rounded up
// to the next pound.
for (const list of Object.values(PARTS)) {
  for (const part of list) {
    part.price = Math.ceil(part.retail * (1 + MARKUP))
  }
}

export function findPart(category, id) {
  return PARTS[category]?.find((p) => p.id === id) ?? null
}

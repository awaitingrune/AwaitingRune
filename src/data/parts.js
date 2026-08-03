// Real product names and technical specs (socket, wattage, form factor, etc.)
// drive the compatibility engine below. Prices are ballpark estimates, not
// live pricing — check current retail prices before quoting a customer.

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
    { id: 'cpu-neb6', name: 'AMD Ryzen 5 7600', socket: 'AM5', tdp: 65, cores: 6, price: 229 },
    { id: 'cpu-neb8', name: 'AMD Ryzen 7 7700X', socket: 'AM5', tdp: 105, cores: 8, price: 329 },
    { id: 'cpu-rune12', name: 'AMD Ryzen 9 7900X', socket: 'AM5', tdp: 170, cores: 12, price: 429 },
    { id: 'cpu-iron6', name: 'Intel Core i5-13400F', socket: 'LGA1700', tdp: 65, cores: 10, price: 199 },
    { id: 'cpu-iron10', name: 'Intel Core i7-14700K', socket: 'LGA1700', tdp: 125, cores: 20, price: 409 },
  ],
  motherboard: [
    { id: 'mb-glyph-b650', name: 'ASUS ROG Strix B650-A Gaming WiFi', socket: 'AM5', ramType: 'DDR5', maxRamGB: 128, formFactor: 'ATX', price: 219 },
    { id: 'mb-glyph-x670', name: 'ASUS ROG Crosshair X670E Hero', socket: 'AM5', ramType: 'DDR5', maxRamGB: 128, formFactor: 'ATX', price: 479 },
    { id: 'mb-sigil-b650m', name: 'MSI B650M Mortar WiFi', socket: 'AM5', ramType: 'DDR5', maxRamGB: 96, formFactor: 'mATX', price: 189 },
    { id: 'mb-ward-z790', name: 'ASUS ROG Strix Z790-E Gaming WiFi', socket: 'LGA1700', ramType: 'DDR5', maxRamGB: 128, formFactor: 'ATX', price: 329 },
    { id: 'mb-ward-b760m', name: 'MSI PRO B760M-A WiFi DDR4', socket: 'LGA1700', ramType: 'DDR4', maxRamGB: 64, formFactor: 'mATX', price: 139 },
  ],
  ram: [
    { id: 'ram-16-ddr5', name: 'Corsair Vengeance 16GB (2x8GB) DDR5-6000', type: 'DDR5', capacityGB: 16, price: 54 },
    { id: 'ram-32-ddr5', name: 'Corsair Vengeance 32GB (2x16GB) DDR5-6000', type: 'DDR5', capacityGB: 32, price: 94 },
    { id: 'ram-64-ddr5', name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6000', type: 'DDR5', capacityGB: 64, price: 189 },
    { id: 'ram-32-ddr4', name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3600', type: 'DDR4', capacityGB: 32, price: 79 },
  ],
  gpu: [
    { id: 'gpu-ember700', name: 'AMD Radeon RX 7600 8GB', tdp: 165, lengthMm: 224, vramGB: 8, price: 269 },
    { id: 'gpu-void90', name: 'NVIDIA GeForce RTX 4070 12GB', tdp: 200, lengthMm: 244, vramGB: 12, price: 549 },
    { id: 'gpu-ember800', name: 'AMD Radeon RX 7800 XT 16GB', tdp: 263, lengthMm: 280, vramGB: 16, price: 499 },
    { id: 'gpu-void90ti', name: 'NVIDIA GeForce RTX 4080 Super 16GB', tdp: 320, lengthMm: 304, vramGB: 16, price: 999 },
  ],
  storage: [
    { id: 'sto-sata-1tb', name: 'Crucial MX500 1TB SATA SSD', capacityGB: 1000, price: 59 },
    { id: 'sto-nvme-1tb', name: 'Samsung 980 Pro 1TB NVMe SSD', capacityGB: 1000, price: 79 },
    { id: 'sto-nvme-2tb', name: 'Samsung 980 Pro 2TB NVMe SSD', capacityGB: 2000, price: 149 },
  ],
  cooler: [
    { id: 'cool-air', name: 'Cooler Master Hyper 212 Black Edition', sockets: ['AM5', 'LGA1700'], tdpRatingW: 150, price: 35 },
    { id: 'cool-air-pro', name: 'Thermalright Peerless Assassin 120 SE', sockets: ['AM5', 'LGA1700'], tdpRatingW: 245, price: 45 },
    { id: 'cool-aio240', name: 'Corsair iCUE H100i Elite Capellix (240mm AIO)', sockets: ['AM5', 'LGA1700'], tdpRatingW: 250, price: 130 },
    { id: 'cool-aio360', name: 'Corsair iCUE H150i Elite Capellix (360mm AIO)', sockets: ['AM5', 'LGA1700'], tdpRatingW: 350, price: 179 },
  ],
  psu: [
    { id: 'psu-550', name: 'Corsair CV550 550W 80+ Bronze', wattage: 550, price: 55 },
    { id: 'psu-650', name: 'Corsair RM650x 650W 80+ Gold', wattage: 650, price: 99 },
    { id: 'psu-850', name: 'Corsair RM850x 850W 80+ Gold', wattage: 850, price: 139 },
    { id: 'psu-1000', name: 'Corsair HX1000 1000W 80+ Platinum', wattage: 1000, price: 219 },
  ],
  case: [
    { id: 'case-mini', name: 'Cooler Master MasterBox Q300L', formFactors: ['mATX'], maxGpuLengthMm: 320, price: 49 },
    { id: 'case-tower', name: 'NZXT H510 Flow', formFactors: ['ATX', 'mATX'], maxGpuLengthMm: 360, price: 94 },
    { id: 'case-elite', name: 'Lian Li O11 Dynamic EVO', formFactors: ['ATX', 'mATX'], maxGpuLengthMm: 420, price: 169 },
  ],
}

export function findPart(category, id) {
  return PARTS[category]?.find((p) => p.id === id) ?? null
}

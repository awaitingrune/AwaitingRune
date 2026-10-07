// Optional extras sold on top of a PC: the operating system, extended warranty
// and the one-click storage offer shown just before checkout.
//
// Like the parts in parts.js, the client and the Netlify Function both price
// extras from here, so the server never trusts a price sent by the browser.
//
// RETAIL PRICES: Scan (scan.co.uk), 7 Oct 2026: Windows 11 Home OEM £119.99,
// Windows 11 Pro OEM £139.99, WD Black SN7100 1TB £159.98. The same markup as
// the parts is added.
import { MARKUP } from './parts.js'

const withMarkup = (retail) => Math.ceil(retail * (1 + MARKUP))

export const OS_OPTIONS = [
  {
    id: 'os-none',
    name: 'No operating system',
    short: 'None',
    price: 0,
    blurb: 'Bring your own licence, or use Linux.',
  },
  {
    id: 'os-home',
    name: 'Windows 11 Home',
    short: 'Windows 11 Home',
    retail: 119.99,
    price: withMarkup(119.99),
    blurb: 'Installed, updated and activated, ready to use.',
  },
  {
    id: 'os-pro',
    name: 'Windows 11 Pro',
    short: 'Windows 11 Pro',
    retail: 139.99,
    price: withMarkup(139.99),
    blurb: 'Everything in Home, plus BitLocker, Remote Desktop and more.',
  },
]

// Prebuilt PCs come with Windows 11 Home unless the buyer changes it.
export const DEFAULT_OS = 'os-home'

// Every PC has a 12 month warranty. These extend it. The price scales with the
// PC (a £2,500 PC costs more to cover than a £1,400 one), with a floor and a
// ceiling so it stays sensible at either end.
//
// For comparison, Direct Computers charge £150 to extend a 3 year warranty to
// 5 years, and UK Gaming Computers charge £60 to £100 for a long extension.
export const WARRANTY_OPTIONS = [
  { id: 'war-std', name: '12 month warranty', short: 'Included', years: 1, extraYears: 0 },
  { id: 'war-2y', name: '2 year warranty', short: '+1 year', years: 2, extraYears: 1, rate: 0.015, min: 29, max: 89 },
  { id: 'war-3y', name: '3 year warranty', short: '+2 years', years: 3, extraYears: 2, rate: 0.025, min: 49, max: 149 },
]

// The offer shown in the pop-up just before checkout.
export const UPSELL = {
  id: 'extra-1tb',
  name: 'Extra 1TB NVMe SSD',
  product: 'WD Black SN7100 1TB',
  retail: 159.98,
  discount: 0.05,
  fullPrice: withMarkup(159.98),
  price: Math.ceil(withMarkup(159.98) * 0.95),
}

export function findOs(id) {
  return OS_OPTIONS.find((o) => o.id === id) ?? null
}

export function findWarranty(id) {
  return WARRANTY_OPTIONS.find((w) => w.id === id) ?? null
}

// `buildTotal` is the PC's price before extras (parts plus build & test).
export function warrantyPrice(option, buildTotal) {
  if (!option || !option.extraYears) return 0
  return Math.min(option.max, Math.max(option.min, Math.ceil(buildTotal * option.rate)))
}

// Everything the customer pays on top of the PC. Unknown ids come back as
// null so the server can refuse the order.
export function priceExtras({ buildTotal, osId = 'os-none', warrantyId = 'war-std', upsell = false }) {
  const os = findOs(osId)
  const warranty = findWarranty(warrantyId)
  if (!os || !warranty) return null

  const osPrice = os.price
  const warrantyCost = warrantyPrice(warranty, buildTotal)
  const upsellPrice = upsell ? UPSELL.price : 0

  return {
    os,
    warranty,
    osPrice,
    warrantyPrice: warrantyCost,
    upsellPrice,
    extrasTotal: osPrice + warrantyCost + upsellPrice,
    total: buildTotal + osPrice + warrantyCost + upsellPrice,
  }
}

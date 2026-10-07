import { PARTS } from '../data/parts.js'
import { evaluateBuild } from './compatibility.js'

// The power supply is the one part the Forge flow still picks for people.
// Everything else (including the motherboard) is their choice.

// Headroom rule: the supply should sit at roughly 50-65% of its rating at full
// load. That leaves room for power spikes (modern graphics cards spike well
// above their rating), a later GPU upgrade, and keeps the fan quiet.
// It must clear both 1.5x the estimated draw and 100W above the graphics card
// maker's own recommended wattage.
const HEADROOM_FACTOR = 1.5
const GPU_RECOMMENDED_EXTRA_W = 100

export function targetPsuWatts({ cpu, gpu }) {
  const draw = evaluateBuild({ cpu, gpu }).estimatedDrawW
  return Math.max(
    Math.ceil((draw * HEADROOM_FACTOR) / 10) * 10,
    gpu?.psuW ? gpu.psuW + GPU_RECOMMENDED_EXTRA_W : 0
  )
}

// Smallest power supply that meets the headroom rule (the quiet one when the
// case is a silent one).
export function pickPsu({ cpu, gpu, case: pcCase }) {
  if (!cpu || !gpu) return null

  const need = targetPsuWatts({ cpu, gpu })
  const sorted = [...PARTS.psu].sort((a, b) => a.wattage - b.wattage)
  const fits = sorted.filter((p) => p.wattage >= need)
  if (fits.length === 0) return sorted[sorted.length - 1]

  if (pcCase?.quiet) {
    const quiet = fits.find((p) => p.quiet)
    if (quiet) return quiet
  }
  return fits.find((p) => !p.quiet) ?? fits[0]
}

// Why `option` does not work with what has already been chosen, or null when
// it does. `chosen` is a { cpu, motherboard, ram, gpu, storage, case, cooler }
// map of parts (any of them may be null).
export function clashReason(key, option, chosen) {
  const { cpu, motherboard, ram, gpu, case: pcCase, cooler } = { ...chosen, [key]: option }

  switch (key) {
    case 'motherboard':
      if (cpu && option.socket !== cpu.socket) return `Your CPU uses ${cpu.socket}, this board is ${option.socket}`
      if (ram && option.ramType !== ram.type) return `Takes ${option.ramType} memory, you chose ${ram.type}`
      if (ram && ram.capacityGB > option.maxRamGB) return `Supports up to ${option.maxRamGB}GB of memory`
      if (pcCase && !pcCase.formFactors.includes(option.formFactor)) return `${option.formFactor} board won't fit your case`
      return null
    case 'cpu':
      if (motherboard && option.socket !== motherboard.socket) return `Your board is ${motherboard.socket}, this CPU is ${option.socket}`
      if (cooler && !cooler.sockets.includes(option.socket)) return `Your cooler doesn't fit ${option.socket}`
      return null
    case 'ram':
      if (motherboard && option.type !== motherboard.ramType) return `Your board takes ${motherboard.ramType}, this is ${option.type}`
      if (motherboard && option.capacityGB > motherboard.maxRamGB) return `Your board supports up to ${motherboard.maxRamGB}GB`
      return null
    case 'gpu':
      if (pcCase && option.lengthMm > pcCase.maxGpuLengthMm) {
        return `Too long for your case (${option.lengthMm}mm, max ${pcCase.maxGpuLengthMm}mm)`
      }
      return null
    case 'case':
      if (motherboard && !option.formFactors.includes(motherboard.formFactor)) return `Doesn't fit your ${motherboard.formFactor} board`
      if (gpu && gpu.lengthMm > option.maxGpuLengthMm) return 'Your graphics card is too long for it'
      return null
    case 'cooler':
      if (cpu && !option.sockets.includes(cpu.socket)) return `Doesn't fit your CPU's ${cpu.socket} socket`
      return null
    default:
      return null
  }
}

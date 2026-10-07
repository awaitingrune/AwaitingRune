import { PARTS } from '../data/parts.js'
import { evaluateBuild } from './compatibility.js'

// The Forge flow asks about six things people care about. The motherboard and
// power supply are matched for them from those choices, and can be changed on
// the final screen.

// Every motherboard that works with whatever has been chosen so far.
export function matchingBoards({ cpu, ram, case: pcCase }) {
  return PARTS.motherboard.filter(
    (mb) =>
      (!cpu || mb.socket === cpu.socket) &&
      (!ram || (mb.ramType === ram.type && mb.maxRamGB >= ram.capacityGB)) &&
      (!pcCase || pcCase.formFactors.includes(mb.formFactor))
  )
}

// Cheapest board that fits; the best one for power-hungry CPUs (more VRM
// headroom); the quiet board when the case is a silent one.
export function pickBoard(chosen) {
  const boards = matchingBoards(chosen)
  if (boards.length === 0) return null

  const byPrice = [...boards].sort((a, b) => a.price - b.price)
  if (chosen.case?.quiet) {
    const quiet = byPrice.find((b) => b.quiet)
    if (quiet) return quiet
  }
  return chosen.cpu && chosen.cpu.tdp >= 150 ? byPrice[byPrice.length - 1] : byPrice[0]
}

// Smallest power supply that meets both our headroom rule and the graphics
// card maker's own recommendation.
export function pickPsu({ cpu, gpu, case: pcCase }) {
  if (!cpu || !gpu) return null

  const need = Math.max(evaluateBuild({ cpu, gpu }).recommendedW, gpu.psuW ?? 0)
  const sorted = [...PARTS.psu].sort((a, b) => a.wattage - b.wattage)
  const fits = sorted.filter((p) => p.wattage >= need)
  if (fits.length === 0) return sorted[sorted.length - 1]

  if (pcCase?.quiet) {
    const quiet = fits.find((p) => p.quiet)
    if (quiet) return quiet
  }
  return fits[0]
}

// True when `option` clashes with what has already been chosen in `chosen`
// (a { cpu, gpu, ram, storage, case, cooler } map of parts).
export function choiceClashes(key, option, chosen) {
  const next = { ...chosen, [key]: option }

  if (next.gpu && next.case && next.gpu.lengthMm > next.case.maxGpuLengthMm) return true
  if (next.cooler && next.cpu && !next.cooler.sockets.includes(next.cpu.socket)) return true

  // CPU, memory and case must all agree on a motherboard.
  if (key === 'cpu' || key === 'ram' || key === 'case') return matchingBoards(next).length === 0

  return false
}

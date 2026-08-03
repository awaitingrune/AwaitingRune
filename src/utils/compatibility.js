const BASELINE_DRAW_W = 90 // fans, storage, motherboard, RGB, etc.
const PSU_SAFETY_MARGIN = 1.2 // recommended headroom above estimated draw
const PSU_MIN_MARGIN = 1.0 // hard minimum before we call it insufficient

export function evaluateBuild(build) {
  const issues = []
  const { cpu, motherboard, ram, gpu, storage, cooler, psu, case: pcCase } = build

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push({
      level: 'error',
      category: 'motherboard',
      message: `CPU socket ${cpu.socket} doesn't match motherboard socket ${motherboard.socket}.`,
    })
  }

  if (ram && motherboard && ram.type !== motherboard.ramType) {
    issues.push({
      level: 'error',
      category: 'ram',
      message: `${ram.type} memory isn't supported by this motherboard (needs ${motherboard.ramType}).`,
    })
  }

  if (ram && motherboard && ram.capacityGB > motherboard.maxRamGB) {
    issues.push({
      level: 'warning',
      category: 'ram',
      message: `${ram.capacityGB}GB exceeds this motherboard's ${motherboard.maxRamGB}GB max.`,
    })
  }

  if (motherboard && pcCase && !pcCase.formFactors.includes(motherboard.formFactor)) {
    issues.push({
      level: 'error',
      category: 'case',
      message: `${motherboard.formFactor} motherboard doesn't fit this case.`,
    })
  }

  if (gpu && pcCase && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      level: 'error',
      category: 'case',
      message: `GPU is ${gpu.lengthMm}mm long, case only fits up to ${pcCase.maxGpuLengthMm}mm.`,
    })
  }

  if (cooler && cpu && !cooler.sockets.includes(cpu.socket)) {
    issues.push({
      level: 'error',
      category: 'cooler',
      message: `Cooler doesn't support the ${cpu.socket} socket.`,
    })
  }

  if (cooler && cpu && cooler.tdpRatingW < cpu.tdp) {
    issues.push({
      level: 'warning',
      category: 'cooler',
      message: `Cooler is rated for ${cooler.tdpRatingW}W, CPU can draw up to ${cpu.tdp}W.`,
    })
  }

  const estimatedDrawW = (cpu?.tdp ?? 0) + (gpu?.tdp ?? 0) + BASELINE_DRAW_W
  const recommendedW = Math.ceil((estimatedDrawW * PSU_SAFETY_MARGIN) / 10) * 10

  if (psu) {
    if (psu.wattage < estimatedDrawW * PSU_MIN_MARGIN) {
      issues.push({
        level: 'error',
        category: 'psu',
        message: `${psu.wattage}W isn't enough for an estimated ${estimatedDrawW}W draw.`,
      })
    } else if (psu.wattage < recommendedW) {
      issues.push({
        level: 'warning',
        category: 'psu',
        message: `${psu.wattage}W is cutting it close — ${recommendedW}W+ recommended for headroom.`,
      })
    }
  }

  const parts = { cpu, motherboard, ram, gpu, storage, cooler, psu, case: pcCase }
  const missing = Object.entries(parts)
    .filter(([, part]) => !part)
    .map(([key]) => key)

  const subtotal = Object.values(parts).reduce((sum, part) => sum + (part?.price ?? 0), 0)
  const errorCount = issues.filter((i) => i.level === 'error').length
  const warningCount = issues.filter((i) => i.level === 'warning').length

  return {
    issues,
    missing,
    isComplete: missing.length === 0,
    isCompatible: errorCount === 0,
    errorCount,
    warningCount,
    estimatedDrawW,
    recommendedW,
    subtotal,
  }
}

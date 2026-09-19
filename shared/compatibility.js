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

// One row per thing a builder wants to know is fine. Each row is 'pending'
// until the parts it depends on have been picked, then 'pass', 'warn' or 'fail'.
export function getCompatibilityChecks(build) {
  const { cpu, motherboard, ram, gpu, cooler, psu, case: pcCase } = build
  const pending = (id, label, detail) => ({ id, label, status: 'pending', detail })

  const checks = []

  checks.push(
    cpu && motherboard
      ? cpu.socket === motherboard.socket
        ? { id: 'socket', label: 'CPU socket', status: 'pass', detail: `${cpu.socket} CPU on a ${motherboard.socket} board.` }
        : { id: 'socket', label: 'CPU socket', status: 'fail', detail: `${cpu.socket} CPU can't fit a ${motherboard.socket} board.` }
      : pending('socket', 'CPU socket', 'Pick a CPU and a motherboard.')
  )

  if (ram && motherboard) {
    if (ram.type !== motherboard.ramType) {
      checks.push({ id: 'memory', label: 'Memory', status: 'fail', detail: `Board needs ${motherboard.ramType}, this kit is ${ram.type}.` })
    } else if (ram.capacityGB > motherboard.maxRamGB) {
      checks.push({ id: 'memory', label: 'Memory', status: 'warn', detail: `${ram.capacityGB}GB is over the board's ${motherboard.maxRamGB}GB limit.` })
    } else {
      checks.push({ id: 'memory', label: 'Memory', status: 'pass', detail: `${ram.type}, ${ram.capacityGB}GB (board supports up to ${motherboard.maxRamGB}GB).` })
    }
  } else {
    checks.push(pending('memory', 'Memory', 'Pick memory and a motherboard.'))
  }

  checks.push(
    motherboard && pcCase
      ? pcCase.formFactors.includes(motherboard.formFactor)
        ? { id: 'board-fit', label: 'Board fits case', status: 'pass', detail: `${motherboard.formFactor} board in a ${pcCase.formFactors.join(' / ')} case.` }
        : { id: 'board-fit', label: 'Board fits case', status: 'fail', detail: `${motherboard.formFactor} board won't fit this case.` }
      : pending('board-fit', 'Board fits case', 'Pick a motherboard and a case.')
  )

  checks.push(
    gpu && pcCase
      ? gpu.lengthMm <= pcCase.maxGpuLengthMm
        ? { id: 'gpu-fit', label: 'Graphics card clearance', status: 'pass', detail: `${gpu.lengthMm}mm card, case fits up to ${pcCase.maxGpuLengthMm}mm.` }
        : { id: 'gpu-fit', label: 'Graphics card clearance', status: 'fail', detail: `${gpu.lengthMm}mm card is too long for a ${pcCase.maxGpuLengthMm}mm case.` }
      : pending('gpu-fit', 'Graphics card clearance', 'Pick a graphics card and a case.')
  )

  if (cooler && cpu) {
    if (!cooler.sockets.includes(cpu.socket)) {
      checks.push({ id: 'cooler', label: 'CPU cooler', status: 'fail', detail: `This cooler doesn't mount on ${cpu.socket}.` })
    } else if (cooler.tdpRatingW < cpu.tdp) {
      checks.push({ id: 'cooler', label: 'CPU cooler', status: 'warn', detail: `Rated ${cooler.tdpRatingW}W, the CPU can draw ${cpu.tdp}W.` })
    } else {
      checks.push({ id: 'cooler', label: 'CPU cooler', status: 'pass', detail: `Fits ${cpu.socket}, rated ${cooler.tdpRatingW}W for a ${cpu.tdp}W CPU.` })
    }
  } else {
    checks.push(pending('cooler', 'CPU cooler', 'Pick a CPU and a cooler.'))
  }

  if (psu && (cpu || gpu)) {
    const drawW = (cpu?.tdp ?? 0) + (gpu?.tdp ?? 0) + BASELINE_DRAW_W
    const recommendedW = Math.ceil((drawW * PSU_SAFETY_MARGIN) / 10) * 10
    if (psu.wattage < drawW * PSU_MIN_MARGIN) {
      checks.push({ id: 'power', label: 'Power supply', status: 'fail', detail: `${psu.wattage}W is under the estimated ${drawW}W draw.` })
    } else if (psu.wattage < recommendedW) {
      checks.push({ id: 'power', label: 'Power supply', status: 'warn', detail: `${psu.wattage}W will run it, but ${recommendedW}W+ leaves proper headroom.` })
    } else {
      checks.push({ id: 'power', label: 'Power supply', status: 'pass', detail: `${psu.wattage}W for an estimated ${drawW}W draw.` })
    }
  } else {
    checks.push(pending('power', 'Power supply', 'Pick a power supply, plus a CPU or graphics card.'))
  }

  return checks
}

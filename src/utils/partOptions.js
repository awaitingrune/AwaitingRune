// Helpers shared by the full custom builder page and the prebuilt customiser.

export function shortName(name) {
  return name.replace(/^(NVIDIA GeForce |AMD Radeon |AMD |Intel )/, '')
}

export function specLine(key, part) {
  switch (key) {
    case 'cpu':
      return `${part.socket} · ${part.cores}-core · ${part.tdp}W TDP`
    case 'motherboard':
      return `${part.socket} · ${part.ramType} · ${part.formFactor} · up to ${part.maxRamGB}GB`
    case 'ram':
      return `${part.type}${part.speedMTs ? '-' + part.speedMTs : ''} · ${part.capacityGB}GB`
    case 'gpu':
      return `${part.vramGB}GB VRAM · ${part.tdp}W · ${part.lengthMm}mm long`
    case 'storage':
      return part.capacityGB >= 1000 ? `${part.capacityGB / 1000}TB` : `${part.capacityGB}GB`
    case 'cooler':
      return `${part.sockets.join(' / ')} · rated to ${part.tdpRatingW}W`
    case 'psu':
      return `${part.wattage}W`
    case 'case':
      return `${part.formFactors.join(' / ')} · GPU up to ${part.maxGpuLengthMm}mm`
    default:
      return ''
  }
}

// True when `option` would clash with something already in `build`.
export function isOptionIncompatible(key, option, build) {
  switch (key) {
    case 'cpu':
      return Boolean(build.motherboard && option.socket !== build.motherboard.socket)
    case 'motherboard':
      return Boolean(
        (build.cpu && option.socket !== build.cpu.socket) ||
          (build.ram && option.ramType !== build.ram.type) ||
          (build.case && !build.case.formFactors.includes(option.formFactor))
      )
    case 'ram':
      return Boolean(build.motherboard && option.type !== build.motherboard.ramType)
    case 'gpu':
      return Boolean(build.case && option.lengthMm > build.case.maxGpuLengthMm)
    case 'cooler':
      return Boolean(build.cpu && !option.sockets.includes(build.cpu.socket))
    case 'case':
      return Boolean(
        (build.motherboard && !option.formFactors.includes(build.motherboard.formFactor)) ||
          (build.gpu && build.gpu.lengthMm > option.maxGpuLengthMm)
      )
    default:
      return false
  }
}

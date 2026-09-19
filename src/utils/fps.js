import { CPU_PERF, GPU_PERF } from '../data/performance.js'

const SOFT_MIN_K = 8
const VRAM_SHORTFALL_PENALTY = 0.72

// A soft minimum instead of a hard one: when the GPU and CPU limits are
// close, real frame rates land a little under both.
function softMin(a, b) {
  return Math.pow(Math.pow(a, -SOFT_MIN_K) + Math.pow(b, -SOFT_MIN_K), -1 / SOFT_MIN_K)
}

function roundFps(fps) {
  return fps >= 100 ? Math.round(fps / 5) * 5 : Math.round(fps)
}

// Estimated average FPS for a game at a resolution ('1080' | '1440' | '2160').
// Returns null when we have no performance data for the GPU or CPU.
export function estimateFps(game, resKey, { gpu, cpu }) {
  const gpuIdx = GPU_PERF[gpu?.id]?.[resKey]
  const cpuIdx = CPU_PERF[cpu?.id]
  const base = game.gpuFps[resKey]
  if (!gpuIdx || !cpuIdx || !base) return null

  let gpuFps = base * gpuIdx
  const vramNeed = game.vramGB?.[resKey]
  if (vramNeed && gpu.vramGB < vramNeed) gpuFps *= VRAM_SHORTFALL_PENALTY

  let fps = softMin(gpuFps, game.cpuFps * cpuIdx)
  if (game.cap) fps = Math.min(fps, game.cap)
  return roundFps(fps)
}

export const RATINGS = {
  excellent: { label: 'Excellent', tone: 'good' },
  great: { label: 'Great', tone: 'good' },
  playable: { label: 'Playable', tone: 'warn' },
  struggles: { label: 'Struggles', tone: 'bad' },
}

export function rateFps(fps, target) {
  if (fps >= target * 1.25) return 'excellent'
  if (fps >= target) return 'great'
  if (fps >= target * 0.75) return 'playable'
  return 'struggles'
}

// Estimated FPS at all three resolutions for one rig, with ratings.
export function performanceFor(game, build) {
  const parts = { gpu: build.gpu, cpu: build.cpu }
  return Object.fromEntries(
    ['1080', '1440', '2160'].map((res) => {
      const fps = estimateFps(game, res, parts)
      return [res, fps === null ? null : { fps, rating: rateFps(fps, game.target) }]
    })
  )
}

// Orders rigs for a chosen game + resolution: rigs that hit the target
// first (cheapest first), then the rest by FPS. Also names the best-value pick.
export function rankForGame(rigs, game, resKey) {
  const scored = rigs.map((rig) => {
    const fps = estimateFps(game, resKey, { gpu: rig.build.gpu, cpu: rig.build.cpu })
    return { rig, fps, meets: fps !== null && fps >= game.target }
  })

  const meeting = scored.filter((s) => s.meets).sort((a, b) => a.rig.evaluation.subtotal - b.rig.evaluation.subtotal)
  const rest = scored.filter((s) => !s.meets).sort((a, b) => (b.fps ?? 0) - (a.fps ?? 0))

  return {
    ordered: [...meeting, ...rest].map((s) => s.rig),
    bestValueId: meeting[0]?.rig.preset.id ?? null,
  }
}

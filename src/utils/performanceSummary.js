import { GAMES, RESOLUTIONS } from '../data/games.js'
import { estimateFps } from './fps.js'

// The highest resolution where most of our test games reach their target.
export function sweetSpot(build) {
  const parts = { gpu: build.gpu, cpu: build.cpu }
  const summary = RESOLUTIONS.map((r) => {
    const hits = GAMES.filter((g) => {
      const fps = estimateFps(g, r.key, parts)
      return fps !== null && fps >= g.target
    })
    return { ...r, share: hits.length / GAMES.length }
  })
  const good = [...summary].reverse().find((s) => s.share >= 0.75)
  if (good) return { key: good.key, label: good.label, text: `Comfortable at ${good.label}: most games reach their target frame rate.` }
  const ok = [...summary].reverse().find((s) => s.share >= 0.4)
  if (ok) return { key: ok.key, label: ok.label, text: `Best at ${ok.label}. Heavier games will want lower settings above that.` }
  return { key: '1080', label: '1080p', text: 'Best at 1080p, with some settings turned down in the heavier games.' }
}

// One to five stars for how much headroom the build has at its sweet-spot
// resolution: the average of (estimated FPS / target FPS) across our games,
// with each game capped so esports titles do not inflate the score.
export function performanceSummary(build) {
  const spot = sweetSpot(build)
  const parts = { gpu: build.gpu, cpu: build.cpu }
  const ratios = GAMES.map((g) => {
    const fps = estimateFps(g, spot.key, parts)
    return fps === null ? 0 : Math.min(fps / g.target, 2)
  })
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length

  const stars = mean >= 1.65 ? 5 : mean >= 1.35 ? 4 : mean >= 1.1 ? 3 : mean >= 0.9 ? 2 : 1
  return { ...spot, mean, stars }
}

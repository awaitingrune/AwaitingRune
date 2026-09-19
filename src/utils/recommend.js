import { findGame, RESOLUTIONS } from '../data/games.js'
import { GPU_PERF } from '../data/performance.js'
import { PREBUILTS, resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from './compatibility.js'
import { estimateFps } from './fps.js'
import { formatPrice } from './format.js'

export const USES = [
  { key: 'gaming', label: 'Gaming', desc: 'Playing games is what this PC is for.' },
  { key: 'stream', label: 'Gaming and streaming', desc: 'I play and broadcast or record at the same time.' },
  { key: 'create', label: 'Creating', desc: 'Video editing, 3D, music, design or coding.' },
  { key: 'work', label: 'Work and everyday use', desc: 'Browsing, office work, study, light gaming.' },
  { key: 'mix', label: 'A bit of everything', desc: 'Gaming and serious creative work.' },
]

export const BUDGETS = [
  { key: '1000', label: 'Up to £1,000', max: 1000 },
  { key: '1500', label: 'Up to £1,500', max: 1500 },
  { key: '2000', label: 'Up to £2,000', max: 2000 },
  { key: '3000', label: 'Up to £3,000', max: 3000 },
  { key: 'any', label: 'No real limit', max: Infinity },
]

export const SCREENS = [
  { key: '1080', label: '1080p', desc: 'Full HD monitor, often 144Hz or higher.' },
  { key: '1440', label: '1440p', desc: 'The sweet spot for most gamers.' },
  { key: '2160', label: '4K', desc: 'Sharp, demanding and gorgeous.' },
]

export const PREFS = [
  { key: 'quiet', label: 'Quiet, no RGB', desc: 'Near silent and no lights.' },
  { key: 'compact', label: 'Compact size', desc: 'Small case, smaller footprint.' },
  { key: 'upgrade', label: 'Room to upgrade', desc: 'Full-size board and power to spare.' },
]

const GAMING_USES = ['gaming', 'stream', 'mix']

// If someone is unsure which games they play, judge on a spread of both kinds.
const DEFAULT_GAMES = ['cs2', 'fortnite', 'cyberpunk', 'rdr2']

const clamp = (n, max) => Math.min(n, max)
const mean = (list) => list.reduce((a, b) => a + b, 0) / list.length

export function usesGaming(use) {
  return GAMING_USES.includes(use)
}

export function gamesFor(answers) {
  const ids = answers.games?.length ? answers.games : DEFAULT_GAMES
  return ids.map(findGame).filter(Boolean)
}

function gamingScore(build, games, resKey) {
  const rows = games.map((game) => {
    const fps = estimateFps(game, resKey, { gpu: build.gpu, cpu: build.cpu })
    return { game, fps, ratio: fps === null ? 0 : fps / game.target }
  })
  const avg = mean(rows.map((r) => clamp(r.ratio, 1.25))) / 1.25
  const worst = clamp(Math.min(...rows.map((r) => r.ratio)), 1.25) / 1.25
  const hits = rows.filter((r) => r.ratio >= 1).length
  return { rows, hits, score: 0.7 * avg + 0.3 * worst }
}

function creatorScore(build) {
  const gpuIdx = GPU_PERF[build.gpu?.id]?.['1440'] ?? 0.5
  return (
    0.5 * clamp((build.cpu?.cores ?? 0) / 20, 1) +
    0.3 * clamp((build.ram?.capacityGB ?? 0) / 64, 1) +
    0.2 * clamp(gpuIdx / 1.98, 1)
  )
}

function preferenceBonus(build, prefs) {
  let bonus = 0
  if (prefs.includes('quiet') && build.case?.quiet) bonus += 0.35
  if (prefs.includes('compact') && build.case?.id === 'case-mini') bonus += 0.25
  if (prefs.includes('upgrade')) {
    if (build.motherboard?.formFactor === 'ATX') bonus += 0.05
    if ((build.psu?.wattage ?? 0) >= 850) bonus += 0.08
  }
  return bonus
}

function scoreRig(rig, answers, games, resKey) {
  const gaming = usesGaming(answers.use) ? gamingScore(rig.build, games, resKey) : null
  const creator = creatorScore(rig.build)

  let fit
  switch (answers.use) {
    case 'gaming':
      fit = gaming.score
      break
    case 'stream':
      fit = 0.6 * gaming.score + 0.4 * clamp((rig.build.cpu?.cores ?? 0) / 16, 1)
      break
    case 'create':
      fit = creator
      break
    case 'mix':
      fit = 0.6 * gaming.score + 0.4 * creator
      break
    default:
      fit = 1 // everyday use: anything works, so the cheapest sensible rig wins
  }

  return { ...rig, gaming, fit: fit + preferenceBonus(rig.build, answers.prefs ?? []) }
}

function explain(scored, answers, resKey, budgetMax) {
  const { build, price } = scored
  const reasons = []

  if (scored.gaming) {
    const label = RESOLUTIONS.find((r) => r.key === resKey)?.label
    const { rows, hits } = scored.gaming
    reasons.push(
      hits === rows.length
        ? `Reaches its target frame rate in ${rows.length === 1 ? 'your game' : rows.length === 2 ? 'both of your games' : `all ${rows.length} of your games`} at ${label}.`
        : `Reaches its target frame rate in ${hits} of ${rows.length} of your games at ${label}.`
    )
  }

  if (['create', 'mix', 'stream'].includes(answers.use)) {
    reasons.push(`${build.cpu.cores} cores and ${build.ram.capacityGB}GB of RAM for ${answers.use === 'stream' ? 'encoding while you play' : 'editing and rendering'}.`)
  }
  if (answers.use === 'work') {
    reasons.push('Plenty of speed for everyday work, without paying for power you would not use.')
  }
  if ((answers.prefs ?? []).includes('quiet') && build.case?.quiet) {
    reasons.push('Built to be quiet: sound-damped case, quiet cooling and no RGB.')
  }
  if ((answers.prefs ?? []).includes('compact') && build.case?.id === 'case-mini') {
    reasons.push('Compact case that will not take over your desk.')
  }
  if ((answers.prefs ?? []).includes('upgrade') && build.motherboard?.formFactor === 'ATX') {
    reasons.push('Full-size ATX board with room to add RAM, storage and a bigger graphics card later.')
  }
  if (Number.isFinite(budgetMax)) {
    reasons.push(
      price <= budgetMax
        ? `${formatPrice(price)}, which is ${formatPrice(budgetMax - price)} under your budget.`
        : `${formatPrice(price)}. This is the cheapest rig we build, so it is a little over your budget.`
    )
  }
  return reasons
}

export function recommend(answers) {
  const resKey = usesGaming(answers.use) ? answers.res || '1440' : '1440'
  const games = usesGaming(answers.use) ? gamesFor(answers) : []
  const budgetMax = BUDGETS.find((b) => b.key === answers.budget)?.max ?? Infinity

  const rigs = PREBUILTS.map((preset) => {
    const build = resolveBuild(preset.partIds)
    const evaluation = evaluateBuild(build)
    return { preset, build, evaluation, price: evaluation.subtotal }
  }).map((rig) => scoreRig(rig, answers, games, resKey))

  const affordable = rigs.filter((r) => r.price <= budgetMax)
  const overBudget = affordable.length === 0
  const pool = overBudget ? [[...rigs].sort((a, b) => a.price - b.price)[0]] : affordable

  const topFit = Math.max(...pool.map((r) => r.fit))
  const pick = pool
    .filter((r) => r.fit >= topFit - 0.03)
    .sort((a, b) => a.price - b.price)[0]

  const cheaper = rigs
    .filter((r) => r.price <= pick.price * 0.9)
    .sort((a, b) => b.fit - a.fit || a.price - b.price)[0]
  const stronger = rigs
    .filter((r) => r.fit > pick.fit + 0.03 && r.price > pick.price)
    .sort((a, b) => a.price - b.price)[0]

  const alternatives = []
  if (cheaper) {
    alternatives.push({
      label: 'If you would rather spend less',
      rig: cheaper,
      note: `Saves you ${formatPrice(pick.price - cheaper.price)}.`,
    })
  }
  if (stronger) {
    alternatives.push({
      label: 'If you want more headroom',
      rig: stronger,
      note:
        stronger.price > budgetMax
          ? `${formatPrice(stronger.price - pick.price)} more, and above your budget.`
          : `${formatPrice(stronger.price - pick.price)} more.`,
    })
  }

  return {
    resKey,
    games,
    overBudget,
    pick: { ...pick, reasons: explain(pick, answers, resKey, budgetMax) },
    alternatives,
  }
}

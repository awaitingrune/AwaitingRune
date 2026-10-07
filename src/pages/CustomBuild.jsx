import { useEffect, useMemo, useRef, useState } from 'react'
import usePageMeta from '../utils/usePageMeta.js'
import { CATEGORIES, PARTS, findPart } from '../data/parts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import { startCheckout } from '../utils/checkout.js'
import { formatPrice } from '../utils/format.js'
import { shortName, specLine } from '../utils/partOptions.js'
import { clashReason, pickPsu } from '../utils/autoMatch.js'
import { performanceSummary, sweetSpot } from '../utils/performanceSummary.js'
import PCTower from '../components/PCTower.jsx'
import RuneEmblem from '../components/RuneEmblem.jsx'
import CompatibilityChecker from '../components/CompatibilityChecker.jsx'
import BuildPerformance from '../components/BuildPerformance.jsx'
import './CustomBuild.css'
import './Forge.css'

// The six things people actually care about. Each has a branded name, but the
// plain-English part name sits right underneath so nobody has to guess what
// they are buying. Only the power supply is picked for them.
const STAGES = [
  {
    key: 'cpu',
    n: '01',
    short: 'Core',
    title: 'Choose Your Core',
    plain: 'Processor (CPU)',
    hint: 'The brain of your PC. It sets how quick everything feels.',
    awakened: 'Core awakened',
    pip: 'sowilo',
  },
  {
    key: 'gpu',
    n: '02',
    short: 'Power',
    title: 'Choose Your Power',
    plain: 'Graphics card (GPU)',
    hint: 'Draws every frame you see. This is what decides how well games run.',
    awakened: 'Power awakened',
    pip: 'uruz',
  },
  {
    key: 'motherboard',
    n: '03',
    short: 'Heart',
    title: 'Choose Your Heartrune',
    plain: 'Motherboard',
    hint: 'The heart of your PC. Everything plugs into it, so it has to match your Core and the Memory and Armour you pick next.',
    awakened: 'Heart awakened',
    pip: 'fehu',
  },
  {
    key: 'ram',
    n: '04',
    short: 'Memory',
    title: 'Choose Your Memory',
    plain: 'Memory (RAM)',
    hint: 'More memory keeps games, tabs and projects running smoothly side by side.',
    awakened: 'Memory awakened',
    pip: 'ansuz',
  },
  {
    key: 'storage',
    n: '05',
    short: 'Storage',
    title: 'Choose Your Storage',
    plain: 'Storage (SSD)',
    hint: 'Where your games and files live. Bigger and faster means more room and shorter loading.',
    awakened: 'Storage awakened',
    pip: 'perthro',
  },
  {
    key: 'case',
    n: '06',
    short: 'Armour',
    title: 'Choose Your Armour',
    plain: 'Case',
    hint: 'The shell around everything. It decides how your PC looks and how much room it has.',
    awakened: 'Armour forged',
    pip: 'tiwaz',
  },
  {
    key: 'cooler',
    n: '07',
    short: 'Aura',
    title: 'Choose Your Aura',
    plain: 'Cooling & lighting',
    hint: 'Keeps the heat down and sets the look: dark and quiet, or lit up with RGB.',
    awakened: 'Aura lit',
    pip: 'kenaz',
  },
]

const LAST = STAGES.length // the reveal screen's index
const EMPTY = Object.fromEntries(STAGES.map((s) => [s.key, null]))

function storageLabel(part) {
  const size = part.capacityGB >= 1000 ? `${part.capacityGB / 1000}TB` : `${part.capacityGB}GB`
  return `${size} ${/SATA/i.test(part.name) ? 'SATA SSD' : 'NVMe SSD'}`
}

// Small plain-English labels that help someone compare options at a glance.
function optionTags(key, part, chosen) {
  const tags = []
  if (key === 'cpu') {
    if (/x3d/.test(part.id)) tags.push({ text: 'Top for gaming' })
    if (part.cores >= 12) tags.push({ text: 'Great for creating' })
  }
  if (key === 'motherboard') {
    tags.push({ text: part.formFactor === 'mATX' ? 'Compact (mATX)' : 'Full size (ATX)' })
    if (part.quiet) tags.push({ text: 'No RGB' })
  }
  if (key === 'ram' && /RGB/.test(part.name)) tags.push({ text: 'RGB lighting' })
  if (key === 'case' && part.quiet) tags.push({ text: 'Sound-damped' })
  if (key === 'cooler') {
    tags.push({ text: /AIO/.test(part.name) ? 'Liquid cooled' : 'Air cooled' })
    tags.push({ text: part.rgb ? 'RGB lighting' : 'No RGB' })
    if (part.quiet) tags.push({ text: 'Quiet' })
    if (chosen.cpu && part.tdpRatingW < chosen.cpu.tdp) tags.push({ text: 'Weak for this CPU', warn: true })
  }
  return tags
}

function Stars({ count }) {
  return (
    <span className="stars" role="img" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? 'is-on' : ''}>
          ★
        </span>
      ))}
    </span>
  )
}

function PerformanceLine({ build }) {
  const perf = performanceSummary(build)
  return (
    <div className="reveal__perf">
      <span className="reveal__perf-label">Estimated performance</span>
      <strong>{perf.label} Gaming</strong>
      <Stars count={perf.stars} />
    </div>
  )
}

export default function CustomBuild() {
  usePageMeta({
    title: "Forge Your Rune | Build Your Own Custom PC | AwaitingRune",
    description: "Choose your Core, Power, Heart, Memory, Storage, Armour and Aura. Live compatibility checks, live pricing and FPS estimates, then awaken your build.",
  })
  const [choices, setChoices] = useState(EMPTY)
  const [psuChoice, setPsuChoice] = useState(null)
  const [stageIndex, setStageIndex] = useState(0)
  const [lastKey, setLastKey] = useState(null)
  const [checkout, setCheckout] = useState({ status: 'idle', error: null })
  const topRef = useRef(null)

  const chosen = useMemo(
    () => Object.fromEntries(STAGES.map((s) => [s.key, findPart(s.key, choices[s.key])])),
    [choices]
  )

  // The power supply is sized from the CPU and graphics card, with headroom.
  const autoPsu = useMemo(() => (chosen.cpu && chosen.gpu ? pickPsu(chosen) : null), [chosen])

  const build = useMemo(
    () => ({ ...chosen, psu: findPart('psu', psuChoice) ?? autoPsu ?? null }),
    [chosen, autoPsu, psuChoice]
  )

  const evaluation = useMemo(() => evaluateBuild(build), [build])

  const doneCount = STAGES.filter((s) => chosen[s.key]).length
  const allChosen = doneCount === STAGES.length
  const canReveal = allChosen && evaluation.isComplete && evaluation.isCompatible
  const progress = doneCount / STAGES.length
  const onReveal = stageIndex === LAST
  const stage = STAGES[stageIndex]

  const lastStage = STAGES.find((s) => s.key === lastKey)
  const status = onReveal
    ? 'The Rune is complete'
    : allChosen
      ? 'Ready to complete your Rune'
      : (lastStage?.awakened ?? 'A Rune awaits…')

  // Anything chosen earlier that no longer works with a later choice.
  const clashes = STAGES.filter((st) => chosen[st.key])
    .map((st) => ({ stage: st, reason: clashReason(st.key, chosen[st.key], { ...chosen, [st.key]: null }) }))
    .filter((c) => c.reason)
  const clashKeys = new Set(clashes.map((c) => c.stage.key))
  const firstProblem = evaluation.issues.find((i) => i.level === 'error')
  const blockReason = clashes.length
    ? `${clashes[0].stage.short}: ${clashes[0].reason}`
    : (firstProblem?.message ?? null)

  // Bring the top of the flow back into view whenever the stage changes.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [stageIndex])

  function choose(key, id) {
    setChoices((prev) => ({ ...prev, [key]: id }))
    // A new choice can change what power supply is right, so go back to the
    // automatic pick rather than keep a stale manual one.
    setPsuChoice(null)
    setLastKey(key)
    setCheckout({ status: 'idle', error: null })
  }

  function restart() {
    setChoices(EMPTY)
    setPsuChoice(null)
    setLastKey(null)
    setStageIndex(0)
    setCheckout({ status: 'idle', error: null })
  }

  function goTo(index) {
    if (index === LAST && !canReveal) return
    setStageIndex(index)
  }

  async function awaken() {
    setCheckout({ status: 'loading', error: null })
    try {
      await startCheckout({
        selections: Object.fromEntries(CATEGORIES.map((c) => [c.key, build[c.key]?.id])),
        buildName: 'Custom Rune',
        cancelPath: '/custom-build',
      })
    } catch (err) {
      setCheckout({ status: 'error', error: err.message })
    }
  }

  // The options for the current stage, each with the reason it does not work
  // (if it does not). Compatible motherboards are listed first.
  const options = stage
    ? PARTS[stage.key]
        .map((option) => ({ option, reason: clashReason(stage.key, option, chosen) }))
        .sort((a, b) => (stage.key === 'motherboard' ? Number(Boolean(a.reason)) - Number(Boolean(b.reason)) : 0))
    : []

  const psuLoad = build.psu ? Math.round((evaluation.estimatedDrawW / build.psu.wattage) * 100) : 0

  const pips = STAGES.map((s) => ({ key: s.key, rune: s.pip, label: s.short, done: Boolean(chosen[s.key]) }))
  const spot = chosen.cpu && chosen.gpu ? sweetSpot(build) : null

  return (
    <div className="forge-page container" ref={topRef}>
      <header className="forge-head">
        <span className="eyebrow">Custom builder</span>
        <h1>Forge Your Rune</h1>
        <p>Your system. Your choices. Your Rune.</p>
      </header>

      <nav className="forge-steps" aria-label="Forge your Rune, stage by stage">
        <div className="forge-steps__bar" aria-hidden="true">
          <span style={{ width: `${onReveal ? 100 : (stageIndex / STAGES.length) * 100}%` }} />
        </div>
        <ol style={{ '--steps': STAGES.length + 1 }}>
          {STAGES.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                className={`forge-steps__btn ${i === stageIndex ? 'is-current' : ''} ${chosen[s.key] ? 'is-done' : ''} ${clashKeys.has(s.key) ? 'has-clash' : ''}`}
                aria-current={i === stageIndex ? 'step' : undefined}
                onClick={() => goTo(i)}
              >
                <span className="forge-steps__dot">{clashKeys.has(s.key) ? '!' : chosen[s.key] ? '✓' : s.n}</span>
                <span className="forge-steps__label">{s.short}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`forge-steps__btn ${onReveal ? 'is-current' : ''} ${canReveal ? 'is-done' : ''}`}
              disabled={!canReveal}
              onClick={() => goTo(LAST)}
            >
              <span className="forge-steps__dot">{canReveal ? '✓' : String(STAGES.length + 1).padStart(2, '0')}</span>
              <span className="forge-steps__label">Complete</span>
            </button>
          </li>
        </ol>
      </nav>

      {!onReveal && (
        <div className="forge-layout">
          <section className="forge-stage card" aria-labelledby="forge-stage-title">
            <header className="forge-stage__head">
              <span className="forge-stage__n">{stage.n}</span>
              <div>
                <h2 id="forge-stage-title">{stage.title}</h2>
                <p className="forge-stage__plain">{stage.plain}</p>
              </div>
            </header>
            <p className="forge-stage__hint">{stage.hint}</p>

            <div className="forge-options">
              {options.map(({ option, reason }) => {
                const isSelected = choices[stage.key] === option.id
                const clash = Boolean(reason)
                const tags = optionTags(stage.key, option, chosen)
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`part-card ${isSelected ? 'is-selected' : ''} ${clash ? 'is-incompatible' : ''}`}
                    onClick={() => choose(stage.key, option.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="part-card__name">{option.name}</span>
                    <span className="part-card__specs">{specLine(stage.key, option)}</span>
                    {clash && <span className="part-card__reason">{reason}</span>}
                    {tags.length > 0 && (
                      <span className="forge-tags">
                        {tags.map((t) => (
                          <span key={t.text} className={`forge-tag ${t.warn ? 'is-warn' : ''}`}>
                            {t.text}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="part-card__price">{formatPrice(option.price)}</span>
                    {clash ? (
                      <span className="part-card__flag">Not compatible</span>
                    ) : (
                      stage.key === 'motherboard' && <span className="part-card__flag is-ok">&#10003; Compatible</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="forge-stage__nav">
              <button type="button" className="btn" disabled={stageIndex === 0} onClick={() => setStageIndex(stageIndex - 1)}>
                &larr; Back
              </button>
              {stageIndex < LAST - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!chosen[stage.key]}
                  onClick={() => setStageIndex(stageIndex + 1)}
                >
                  Continue to {STAGES[stageIndex + 1].short} &rarr;
                </button>
              ) : (
                <button type="button" className="btn btn-primary" disabled={!canReveal} onClick={() => goTo(LAST)}>
                  Complete Your Rune &rarr;
                </button>
              )}
            </div>
            {stageIndex === LAST - 1 && blockReason && <p className="forge-stage__block">{blockReason}</p>}
            {!chosen[stage.key] && <p className="forge-stage__tip">Pick one option to continue.</p>}
          </section>

          <aside className="forge-rune card" aria-label="Your Rune so far">
            <RuneEmblem progress={progress} status={status} pips={pips} />

            <div className="forge-rune__tower">
              <PCTower build={build} />
            </div>

            <div className="forge-rune__summary">
              <div className="forge-rune__total">
                <span>Your Rune so far</span>
                <strong key={evaluation.subtotal}>{formatPrice(evaluation.subtotal)}</strong>
              </div>

              <div className="forge-rune__details">
                <div className="forge-rune__line">
                  <span>Estimated power draw</span>
                  <span>{evaluation.estimatedDrawW}W</span>
                </div>
                {spot && (
                  <div className="forge-rune__line">
                    <span>Sweet spot</span>
                    <span>{spot.label} gaming</span>
                  </div>
                )}
                {build.psu && (
                  <div className="forge-rune__matched">
                    <span className="forge-rune__matched-title">Power supply, picked for you</span>
                    <span>{build.psu.name}</span>
                    <span>About {psuLoad}% load at full tilt, so there is room to grow</span>
                  </div>
                )}
                <p className={`forge-rune__verdict ${blockReason ? 'is-bad' : ''}`}>
                  {blockReason
                    ? `Heads up: ${blockReason}`
                    : doneCount === 0
                      ? 'Pick a part and your Rune starts to take shape.'
                      : 'Everything chosen so far works together.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {onReveal && (
        <section className="reveal" aria-labelledby="reveal-title">
          <p className="reveal__kicker">Awaiting Rune // Custom</p>
          <h2 id="reveal-title" className="reveal__title">
            Your Rune is complete.
          </h2>

          <div className="reveal__stage">
            <RuneEmblem progress={1} status="The Rune is complete" complete pips={pips} size={110} />
            <div className="reveal__tower">
              <PCTower build={build} />
            </div>
            <p className="reveal__caption">Illustration of your configuration</p>
          </div>

          <ul className="reveal__specs">
            {[
              ['Core', shortName(build.cpu.name)],
              ['Power', shortName(build.gpu.name)],
              ['Heart', build.motherboard.name],
              ['Memory', `${build.ram.capacityGB}GB ${build.ram.type}`],
              ['Storage', storageLabel(build.storage)],
              ['Armour', build.case.name],
              ['Aura', build.cooler.name],
            ].map(([label, value], i) => (
              <li key={label} style={{ '--i': i }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
          </ul>

          <PerformanceLine build={build} />

          <div className="reveal__price">{formatPrice(evaluation.subtotal)}</div>

          {checkout.status === 'error' && checkout.error && <div className="issue issue--error">{checkout.error}</div>}

          <button
            type="button"
            className="btn btn-primary reveal__cta"
            disabled={!canReveal || checkout.status === 'loading'}
            onClick={awaken}
          >
            {checkout.status === 'loading' ? 'Opening checkout…' : 'Awaken your Rune →'}
          </button>
          <p className="reveal__note">Secure checkout via Stripe — test mode, no real charge.</p>

          <div className="reveal__links">
            <button type="button" className="reveal__link" onClick={() => setStageIndex(LAST - 1)}>
              &larr; Adjust your Rune
            </button>
            <button type="button" className="reveal__link" onClick={restart}>
              Start again
            </button>
          </div>

          <div className="reveal__more">
            <details className="card reveal__details">
              <summary>
                Power supply, picked for you
                <small>
                  {build.psu.wattage}W · about {psuLoad}% load at full tilt
                </small>
              </summary>
              <p>
                We size the power supply for your CPU and graphics card with plenty of headroom, so it runs at roughly
                50&ndash;65% load. That leaves room for power spikes and a future upgrade, and keeps the fan quiet. Pick
                a different one here if you prefer.
              </p>
              <label className="reveal__field">
                <span>Power supply</span>
                <select
                  value={build.psu.id}
                  onChange={(e) => {
                    setPsuChoice(e.target.value)
                    setCheckout({ status: 'idle', error: null })
                  }}
                >
                  {PARTS.psu.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} · {formatPrice(opt.price)}
                      {opt.wattage < evaluation.recommendedW ? ' · ⚠ too small' : ''}
                    </option>
                  ))}
                </select>
              </label>
              {psuChoice && (
                <button type="button" className="btn" onClick={() => setPsuChoice(null)}>
                  Go back to the picked power supply
                </button>
              )}
            </details>

            <details className="card reveal__details">
              <summary>
                Compatibility check <small>{evaluation.isCompatible ? 'All parts work together' : 'Needs attention'}</small>
              </summary>
              <CompatibilityChecker build={build} />
            </details>

            <details className="card reveal__details">
              <summary>
                Frame rates for your games <small>Estimates</small>
              </summary>
              <BuildPerformance build={build} />
            </details>
          </div>
        </section>
      )}
    </div>
  )
}

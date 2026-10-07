import { useMemo, useState } from 'react'
import usePageMeta from '../utils/usePageMeta.js'
import { CATEGORIES } from '../data/parts.js'
import { GAMES, GENRES, RESOLUTIONS, findGame } from '../data/games.js'
import { PREBUILTS, PREBUILT_CATEGORIES, presetInCategory, resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import { rankForGame, performanceFor } from '../utils/fps.js'
import { startCheckout } from '../utils/checkout.js'
import { formatPrice } from '../utils/format.js'
import { useCustomize } from '../components/CustomizeProvider.jsx'
import RigVisual from '../components/RigVisual.jsx'
import ImageDisclaimer from '../components/ImageDisclaimer.jsx'
import FpsPanel from '../components/FpsPanel.jsx'
import RuneGlyph, { RUNE_KEYS } from '../components/RuneGlyph.jsx'
import './Prebuilts.css'

const BASE_SORTS = [
  { key: 'default', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
]

export default function Prebuilts() {
  usePageMeta({
    title: "The Rune Series | Prebuilt Gaming & Creator PCs | AwaitingRune",
    description: "We have a rune for everything. Browse prebuilt gaming and workstation PCs with FPS estimates, then customise any part before you buy.",
  })
  const { openCustomize } = useCustomize()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')
  const [gameId, setGameId] = useState('')
  const [resKey, setResKey] = useState('1440')
  const [buyState, setBuyState] = useState({}) // presetId -> 'loading' | 'error'
  const [buyError, setBuyError] = useState({}) // presetId -> message

  const game = findGame(gameId)
  const activeCategory = PREBUILT_CATEGORIES.find((c) => c.key === category)
  const sorts = game ? [{ key: 'best', label: 'Best for this game' }, ...BASE_SORTS] : BASE_SORTS

  const { rigs, bestValueId } = useMemo(() => {
    const filtered = PREBUILTS.filter((preset) => presetInCategory(preset, category)).map((preset) => {
      const build = resolveBuild(preset.partIds)
      return { preset, build, evaluation: evaluateBuild(build) }
    })

    // Workstations are built for editing and rendering, so they are never
    // scored on game frame rates. They sit after the ranked gaming rigs.
    const gamingRigs = filtered.filter((r) => r.preset.category !== 'workstation')
    const workstations = filtered.filter((r) => r.preset.category === 'workstation')

    const chosenGame = findGame(gameId)
    const ranking = chosenGame ? rankForGame(gamingRigs, chosenGame, resKey) : { ordered: filtered, bestValueId: null }

    let ordered = filtered
    if (sort === 'best' && chosenGame) ordered = [...ranking.ordered, ...workstations]
    else if (sort === 'price-asc') ordered = [...filtered].sort((a, b) => a.evaluation.subtotal - b.evaluation.subtotal)
    else if (sort === 'price-desc') ordered = [...filtered].sort((a, b) => b.evaluation.subtotal - a.evaluation.subtotal)

    return { rigs: ordered, bestValueId: ranking.bestValueId }
  }, [category, sort, gameId, resKey])

  function handleGameChange(id) {
    setGameId(id)
    setSort(id ? 'best' : sort === 'best' ? 'default' : sort)
  }

  async function handleBuyNow(preset) {
    setBuyState((prev) => ({ ...prev, [preset.id]: 'loading' }))
    setBuyError((prev) => ({ ...prev, [preset.id]: null }))
    try {
      await startCheckout({
        selections: preset.partIds,
        buildName: preset.name,
        cancelPath: '/prebuilts',
      })
    } catch (err) {
      setBuyState((prev) => ({ ...prev, [preset.id]: 'error' }))
      setBuyError((prev) => ({ ...prev, [preset.id]: err.message }))
    }
  }

  return (
    <div className="prebuilts container">
      <div className="prebuilts__head">
        <span className="eyebrow">Prebuilt rigs</span>
        <h1>Hand-tuned, ready to order</h1>
        <p>Every part already checked for compatibility. Customize any of them further.</p>
      </div>

      <ImageDisclaimer />

      <section className="finder card" aria-label="Game finder">
        <div className="finder__copy">
          <span className="eyebrow">Game finder</span>
          <h2>What are you playing?</h2>
          <p>Pick a game and we&rsquo;ll estimate the frame rate on every gaming rig, then flag the best value for it.</p>
        </div>
        <div className="finder__controls">
          <label className="finder__field">
            Game
            <select value={gameId} onChange={(e) => handleGameChange(e.target.value)}>
              <option value="">Choose a game&hellip;</option>
              {GENRES.map((g) => (
                <optgroup key={g.key} label={g.label}>
                  {GAMES.filter((x) => x.genre === g.key).map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="finder__res" role="group" aria-label="Resolution">
            <span className="finder__label">Resolution</span>
            <div className="finder__pills">
              {RESOLUTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  aria-pressed={resKey === r.key}
                  className={`filter-pill ${resKey === r.key ? 'is-active' : ''}`}
                  onClick={() => setResKey(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          {game && (
            <button type="button" className="finder__clear" onClick={() => handleGameChange('')}>
              Clear game
            </button>
          )}
        </div>
      </section>

      <div className="prebuilts__controls">
        <div className="prebuilts__filters" role="tablist" aria-label="Filter by category">
          {PREBUILT_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={category === c.key}
              className={`filter-pill ${category === c.key ? 'is-active' : ''}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="prebuilts__sort">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeCategory?.subtitle && (
        <div className="series">
          <div className="series__runes" aria-hidden="true">
            {RUNE_KEYS.map((k) => (
              <RuneGlyph key={k} name={k} size={22} />
            ))}
          </div>
          <p className="series__subtitle">{activeCategory.subtitle}</p>
        </div>
      )}

      {rigs.length === 0 ? (
        <p className="prebuilts__empty">No rigs in this category yet.</p>
      ) : (
        <div className="prebuilts__grid">
          {rigs.map(({ preset, build, evaluation }) => {
            const isWorkstation = preset.category === 'workstation'
            const perf = game && !isWorkstation ? performanceFor(game, build) : null
            const belowTarget = perf?.[resKey] && perf[resKey].fps < game.target

            return (
              <div
                key={preset.id}
                className={`card prebuilt ${preset.featured ? 'is-featured' : ''} ${belowTarget ? 'is-below-target' : ''}`}
              >
                {bestValueId === preset.id && (
                  <span className="prebuilt__badge prebuilt__badge--value">Best value for {game.name}</span>
                )}
                {preset.featured && <span className="prebuilt__badge">Most popular</span>}

                <RigVisual id={preset.id} build={build} alt={`${preset.name} custom PC`} />

                <span className="tag">{preset.tier}</span>
                <div className="prebuilt__title">
                  {preset.rune && (
                    <span className="prebuilt__rune" title={`${preset.rune.label} — ${preset.rune.meaning.toLowerCase()}`}>
                      <RuneGlyph name={preset.rune.key} size={22} />
                    </span>
                  )}
                  <h2>{preset.name}</h2>
                </div>
                {preset.rune && (
                  <p className="prebuilt__meaning">
                    {preset.rune.label} &middot; {preset.rune.meaning}
                  </p>
                )}
                <p className="prebuilt__blurb">{preset.blurb}</p>

                {isWorkstation ? (
                  <div className="workload">
                    <span className="workload__title">Built for</span>
                    <ul>
                      {preset.builtFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <FpsPanel
                    build={build}
                    game={game}
                    resKey={resKey}
                    headlineGames={preset.headlineGames}
                    targetRes={preset.targetRes}
                  />
                )}

                <ul className="prebuilt__specs">
                  {CATEGORIES.map((cat) => {
                    const part = build[cat.key]
                    return (
                      <li key={cat.key}>
                        <span>{cat.label}</span>
                        <span>{part?.name}</span>
                      </li>
                    )
                  })}
                </ul>

                {buyState[preset.id] === 'error' && buyError[preset.id] && (
                  <div className="issue issue--error prebuilt__error">{buyError[preset.id]}</div>
                )}

                <div className="prebuilt__foot">
                  <span className="prebuilt__price">
                    {formatPrice(evaluation.subtotal)}
                    <small className="prebuilt__incl">includes {formatPrice(evaluation.labour)} build &amp; test</small>
                  </span>
                  <div className="prebuilt__actions">
                    <button type="button" className="btn" onClick={() => openCustomize(preset)}>
                      Customize
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={buyState[preset.id] === 'loading'}
                      onClick={() => handleBuyNow(preset)}
                    >
                      {buyState[preset.id] === 'loading' ? 'Redirecting…' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="prebuilts__footnote">
        FPS figures are estimates, not guarantees. They combine published benchmark averages for each graphics card
        and processor with per-game baselines at the settings shown (no ray tracing, no upscaling or frame
        generation). Real results vary by roughly 10&ndash;15% with drivers, game patches and the scene tested.
      </p>
    </div>
  )
}

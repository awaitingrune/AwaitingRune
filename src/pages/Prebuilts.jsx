import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/parts.js'
import { PREBUILTS, PREBUILT_CATEGORIES, resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import { startCheckout } from '../utils/checkout.js'
import PCTower from '../components/PCTower.jsx'
import './Prebuilts.css'

const SORTS = [
  { key: 'default', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
]

export default function Prebuilts() {
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')
  const [buyState, setBuyState] = useState({}) // presetId -> 'loading' | 'error'
  const [buyError, setBuyError] = useState({}) // presetId -> message

  const rigs = useMemo(() => {
    const withEvaluation = PREBUILTS.map((preset) => {
      const build = resolveBuild(preset.partIds)
      return { preset, build, evaluation: evaluateBuild(build) }
    })

    const filtered =
      category === 'all' ? withEvaluation : withEvaluation.filter((r) => r.preset.category === category)

    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => a.evaluation.subtotal - b.evaluation.subtotal)
    }
    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => b.evaluation.subtotal - a.evaluation.subtotal)
    }
    return filtered
  }, [category, sort])

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
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {rigs.length === 0 ? (
        <p className="prebuilts__empty">No rigs in this category yet.</p>
      ) : (
        <div className="prebuilts__grid">
          {rigs.map(({ preset, build, evaluation }) => (
            <div key={preset.id} className={`card prebuilt ${preset.featured ? 'is-featured' : ''}`}>
              {preset.featured && <span className="prebuilt__badge">Most popular</span>}
              <div className="prebuilt__image">
                <PCTower tier={preset.id} />
              </div>
              <span className="tag">{preset.tier}</span>
              <h2>{preset.name}</h2>
              <p className="prebuilt__blurb">{preset.blurb}</p>

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
                <span className="prebuilt__price">${evaluation.subtotal.toLocaleString()}</span>
                <div className="prebuilt__actions">
                  <Link to="/custom-build" state={{ presetIds: preset.partIds }} className="btn">
                    Customize
                  </Link>
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
          ))}
        </div>
      )}
    </div>
  )
}

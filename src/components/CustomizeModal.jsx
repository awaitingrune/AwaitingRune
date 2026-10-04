import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, PARTS, findPart } from '../data/parts.js'
import { RIG_IMAGES } from '../data/rigImages.js'
import { resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import { startCheckout } from '../utils/checkout.js'
import { formatPrice } from '../utils/format.js'
import { isOptionIncompatible, shortName, specLine } from '../utils/partOptions.js'
import PCTower from './PCTower.jsx'
import RigVisual from './RigVisual.jsx'
import RuneGlyph from './RuneGlyph.jsx'
import CompatibilityChecker from './CompatibilityChecker.jsx'
import BuildPerformance from './BuildPerformance.jsx'
import './CustomizeModal.css'

function signedPrice(amount) {
  return `${amount >= 0 ? '+' : '−'}${formatPrice(Math.abs(amount))}`
}

// A zoomed-in view of one prebuilt: swap any part and the price, power draw,
// compatibility and frame rates all update live. Checkout sends the changed
// parts, and the server re-checks compatibility and prices them again.
export default function CustomizeModal({ preset, onClose }) {
  const closeRef = useRef(null)
  const [selected, setSelected] = useState(preset.partIds)
  const [checkout, setCheckout] = useState({ status: 'idle', error: null })

  const original = useMemo(() => evaluateBuild(resolveBuild(preset.partIds)), [preset])
  const build = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.key, findPart(c.key, selected[c.key])])),
    [selected]
  )
  const evaluation = useMemo(() => evaluateBuild(build), [build])

  const changedKeys = CATEGORIES.filter((c) => selected[c.key] !== preset.partIds[c.key]).map((c) => c.key)
  const modified = changedKeys.length > 0
  const delta = evaluation.subtotal - original.subtotal
  const isWorkstation = preset.category === 'workstation'
  const hasPhoto = Boolean(RIG_IMAGES[preset.id])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function choose(key, id) {
    setSelected((prev) => ({ ...prev, [key]: id }))
    setCheckout({ status: 'idle', error: null })
  }

  function reset() {
    setSelected(preset.partIds)
    setCheckout({ status: 'idle', error: null })
  }

  async function buy() {
    setCheckout({ status: 'loading', error: null })
    try {
      await startCheckout({
        selections: selected,
        buildName: modified ? `${preset.name} (customised)` : preset.name,
        cancelPath: window.location.pathname,
      })
    } catch (err) {
      setCheckout({ status: 'error', error: err.message })
    }
  }

  const canBuy = evaluation.isComplete && evaluation.isCompatible && checkout.status !== 'loading'

  return (
    <div className="cz" role="dialog" aria-modal="true" aria-label={`Customise ${preset.name}`} onClick={onClose}>
      <div className="cz__panel card" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="cz__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        <div className="cz__layout">
          <aside className="cz__side">
            <div className="cz__visual">
              {hasPhoto && !modified ? (
                <RigVisual id={preset.id} build={build} alt={`${preset.name} custom PC`} />
              ) : (
                <div className="cz__tower">
                  <PCTower build={build} />
                </div>
              )}
              <p className="cz__caption">
                {hasPhoto && !modified
                  ? 'Swap any part on the right and this updates.'
                  : 'Live illustration of your build. It changes as you swap parts.'}
              </p>
            </div>

            <div className="cz__summary">
              <span className="tag">{preset.tier}</span>
              <div className="cz__title">
                {preset.rune && (
                  <span className="prebuilt__rune">
                    <RuneGlyph name={preset.rune.key} size={22} />
                  </span>
                )}
                <h2>{preset.name}</h2>
              </div>

              <div className="cz__price">
                <span key={evaluation.subtotal} className="cz__total">
                  {formatPrice(evaluation.subtotal)}
                </span>
                <span className={`cz__delta ${delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''}`}>
                  {modified
                    ? delta === 0
                      ? 'Same price as the original'
                      : `${signedPrice(delta)} from the original ${formatPrice(original.subtotal)}`
                    : 'Original spec'}
                </span>
              </div>

              <div className="cz__power">
                <span>Estimated power draw</span>
                <span>
                  {evaluation.estimatedDrawW}W (recommend {evaluation.recommendedW}W+ PSU)
                </span>
              </div>

              {checkout.status === 'error' && checkout.error && <div className="issue issue--error">{checkout.error}</div>}

              <div className="cz__actions">
                <button type="button" className="btn btn-primary btn-block" disabled={!canBuy} onClick={buy}>
                  {checkout.status === 'loading'
                    ? 'Redirecting…'
                    : modified
                      ? `Buy customised build · ${formatPrice(evaluation.subtotal)}`
                      : `Buy Now · ${formatPrice(evaluation.subtotal)}`}
                </button>
                {modified && (
                  <button type="button" className="btn btn-block" onClick={reset}>
                    Reset to original
                  </button>
                )}
              </div>
              {!evaluation.isCompatible && (
                <p className="cz__hint">Fix the red items in the compatibility checker to enable checkout.</p>
              )}
            </div>
          </aside>

          <div className="cz__main">
            <span className="eyebrow">Customise</span>
            <h3 className="cz__heading">Change any part</h3>
            <p className="cz__lead">
              {modified
                ? `${changedKeys.length} part${changedKeys.length > 1 ? 's' : ''} changed. The price updates as you go.`
                : 'Pick a different part from any list. The price and compatibility update as you go.'}
            </p>

            <ul className="cz__parts">
              {CATEGORIES.map((cat) => {
                const current = build[cat.key]
                const originalPart = findPart(cat.key, preset.partIds[cat.key])
                const changed = selected[cat.key] !== preset.partIds[cat.key]
                return (
                  <li key={cat.key} className={`cz-part ${changed ? 'is-changed' : ''}`}>
                    <label className="cz-part__label" htmlFor={`cz-${cat.key}`}>
                      {cat.label}
                      {changed && <span className="cz-part__flag">Changed</span>}
                    </label>
                    <select
                      id={`cz-${cat.key}`}
                      className="cz-part__select"
                      value={selected[cat.key]}
                      onChange={(e) => choose(cat.key, e.target.value)}
                    >
                      {PARTS[cat.key].map((opt) => {
                        const isCurrent = opt.id === selected[cat.key]
                        const clash = !isCurrent && isOptionIncompatible(cat.key, opt, build)
                        const diff = opt.price - current.price
                        return (
                          <option key={opt.id} value={opt.id}>
                            {opt.name} · {formatPrice(opt.price)}
                            {!isCurrent && diff !== 0 ? ` (${signedPrice(diff)})` : ''}
                            {clash ? ' · ⚠ incompatible' : ''}
                          </option>
                        )
                      })}
                    </select>
                    <div className="cz-part__meta">
                      <span>{specLine(cat.key, current)}</span>
                      <span className="cz-part__price">{formatPrice(current.price)}</span>
                    </div>
                    {changed && (
                      <span className="cz-part__was">
                        Was {shortName(originalPart.name)} · {formatPrice(originalPart.price)}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="cz__insights">
              <CompatibilityChecker build={build} />
              {isWorkstation ? (
                <section className="insight card" aria-label="What this build is for">
                  <div className="insight__head">
                    <h3>Built for</h3>
                  </div>
                  <ul className="cz__builtfor">
                    {preset.builtFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : (
                <BuildPerformance build={build} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

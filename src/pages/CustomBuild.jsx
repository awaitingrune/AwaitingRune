import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CATEGORIES, PARTS, findPart } from '../data/parts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import './CustomBuild.css'

function specLine(key, part) {
  switch (key) {
    case 'cpu':
      return `${part.socket} · ${part.cores}-core · ${part.tdp}W TDP`
    case 'motherboard':
      return `${part.socket} · ${part.ramType} · ${part.formFactor} · up to ${part.maxRamGB}GB`
    case 'ram':
      return `${part.type} · ${part.capacityGB}GB`
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

function isOptionIncompatible(key, option, build) {
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

const EMPTY_SELECTION = Object.fromEntries(CATEGORIES.map((c) => [c.key, null]))

export default function CustomBuild() {
  const location = useLocation()
  const presetIds = location.state?.presetIds

  const [selectedIds, setSelectedIds] = useState(() =>
    presetIds ? { ...EMPTY_SELECTION, ...presetIds } : EMPTY_SELECTION
  )

  const build = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.key, findPart(c.key, selectedIds[c.key])])),
    [selectedIds]
  )

  const evaluation = useMemo(() => evaluateBuild(build), [build])

  function handleSelect(key, id) {
    setSelectedIds((prev) => ({ ...prev, [key]: prev[key] === id ? null : id }))
  }

  function handleReset() {
    setSelectedIds(EMPTY_SELECTION)
  }

  return (
    <div className="build-page container">
      <div className="build-page__head">
        <span className="eyebrow">Build configurator</span>
        <h1>Design your rig</h1>
        <p>Pick a part in each category. Price and compatibility update automatically as you go.</p>
      </div>

      <div className="build-page__layout">
        <div className="build-page__categories">
          {CATEGORIES.map((cat) => {
            const selected = build[cat.key]
            return (
              <section key={cat.key} className="build-cat card">
                <div className="build-cat__head">
                  <h3>{cat.label}</h3>
                  {selected && <span className="tag">{selected.name}</span>}
                </div>
                <div className="build-cat__grid">
                  {PARTS[cat.key].map((option) => {
                    const isSelected = selectedIds[cat.key] === option.id
                    const incompatible = !isSelected && isOptionIncompatible(cat.key, option, build)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`part-card ${isSelected ? 'is-selected' : ''} ${incompatible ? 'is-incompatible' : ''}`}
                        onClick={() => handleSelect(cat.key, option.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="part-card__name">{option.name}</span>
                        <span className="part-card__specs">{specLine(cat.key, option)}</span>
                        <span className="part-card__price">${option.price}</span>
                        {incompatible && <span className="part-card__flag">Incompatible</span>}
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <aside className="build-summary card">
          <h3>Your build</h3>

          <ul className="build-summary__list">
            {CATEGORIES.map((cat) => {
              const part = build[cat.key]
              return (
                <li key={cat.key} className={part ? '' : 'is-empty'}>
                  <span className="build-summary__label">{cat.label}</span>
                  <span className="build-summary__value">{part ? part.name : 'Not selected'}</span>
                  <span className="build-summary__price">{part ? `$${part.price}` : '—'}</span>
                </li>
              )
            })}
          </ul>

          <div className="build-summary__power">
            <span>Estimated power draw</span>
            <span>{evaluation.estimatedDrawW}W (recommend {evaluation.recommendedW}W+ PSU)</span>
          </div>

          <div className="build-summary__total">
            <span>Subtotal</span>
            <span>${evaluation.subtotal.toLocaleString()}</span>
          </div>

          {evaluation.issues.length > 0 && (
            <ul className="build-summary__issues">
              {evaluation.issues.map((issue, i) => (
                <li key={i} className={`issue issue--${issue.level}`}>
                  {issue.message}
                </li>
              ))}
            </ul>
          )}

          <div className={`build-summary__status ${evaluation.isCompatible ? 'is-ok' : 'is-error'}`}>
            {!evaluation.isComplete
              ? `Select ${CATEGORIES.length - Object.values(build).filter(Boolean).length} more part(s) to finish your build.`
              : evaluation.isCompatible
                ? 'All parts are compatible.'
                : `${evaluation.errorCount} compatibility issue(s) to resolve.`}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!evaluation.isComplete || !evaluation.isCompatible}
          >
            Request This Build
          </button>
          <button type="button" className="btn btn-block build-summary__reset" onClick={handleReset}>
            Reset
          </button>
          <p className="build-summary__note">
            Demo build tool — connect this to checkout/inventory before taking real orders.
          </p>
        </aside>
      </div>
    </div>
  )
}

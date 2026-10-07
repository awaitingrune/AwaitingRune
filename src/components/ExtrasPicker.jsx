import { OS_OPTIONS, WARRANTY_OPTIONS, warrantyPrice } from '../data/extras.js'
import { formatPrice } from '../utils/format.js'
import './ExtrasPicker.css'

function Group({ legend, hint, name, options, value, onChange }) {
  return (
    <fieldset className="extras__group">
      <legend>{legend}</legend>
      {hint && <p className="extras__hint">{hint}</p>}
      <div className="extras__options">
        {options.map((o) => (
          <label key={o.id} className={`extras__option ${value === o.id ? 'is-selected' : ''}`}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span className="extras__title">{o.title}</span>
            <span className="extras__note">{o.note}</span>
            <span className="extras__price">{o.priceLabel}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// Operating system and warranty choices. `buildTotal` is the PC's price before
// extras, which the warranty price scales with.
export default function ExtrasPicker({ os, onOs, warranty, onWarranty, buildTotal, idPrefix = 'extras' }) {
  const osOptions = OS_OPTIONS.map((o) => ({
    id: o.id,
    title: o.short,
    note: o.blurb,
    priceLabel: o.price === 0 ? 'No charge' : formatPrice(o.price),
  }))

  const warrantyOptions = WARRANTY_OPTIONS.map((w) => ({
    id: w.id,
    title: w.name,
    note: w.extraYears ? 'Parts and labour, same cover as standard' : 'Parts and labour, included with every PC',
    priceLabel: w.extraYears ? `+${formatPrice(warrantyPrice(w, buildTotal))}` : 'Included',
  }))

  return (
    <div className="extras">
      <Group
        legend="Operating system"
        hint="Installed, updated and activated before it ships."
        name={`${idPrefix}-os`}
        options={osOptions}
        value={os}
        onChange={onOs}
      />
      <Group
        legend="Warranty"
        hint="Extend the standard 12 months for a small extra."
        name={`${idPrefix}-warranty`}
        options={warrantyOptions}
        value={warranty}
        onChange={onWarranty}
      />
    </div>
  )
}

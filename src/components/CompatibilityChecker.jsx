import { getCompatibilityChecks } from '../utils/compatibility.js'
import './BuildInsights.css'

const ICONS = { pass: '✓', warn: '!', fail: '✕', pending: '' }

export default function CompatibilityChecker({ build }) {
  const checks = getCompatibilityChecks(build)
  const passed = checks.filter((c) => c.status === 'pass').length
  const failed = checks.filter((c) => c.status === 'fail').length
  const warned = checks.filter((c) => c.status === 'warn').length
  const pendingCount = checks.filter((c) => c.status === 'pending').length

  let verdict = 'Pick parts and each check fills in.'
  let tone = 'idle'
  if (failed > 0) {
    verdict = `${failed} thing${failed > 1 ? 's' : ''} won't work together`
    tone = 'bad'
  } else if (warned > 0) {
    verdict = `Works, with ${warned} heads-up${warned > 1 ? 's' : ''}`
    tone = 'warn'
  } else if (pendingCount === 0) {
    verdict = 'Everything fits and works together'
    tone = 'good'
  } else if (passed > 0) {
    verdict = 'So far so good'
    tone = 'good'
  }

  return (
    <section className="insight card" aria-label="Compatibility checker">
      <div className="insight__head">
        <h3>Compatibility checker</h3>
        <span className="insight__count">
          {passed}/{checks.length} passed
        </span>
      </div>
      <p className={`insight__verdict insight__verdict--${tone}`}>{verdict}</p>
      <ul className="checks">
        {checks.map((c) => (
          <li key={c.id} className={`checks__row checks__row--${c.status}`}>
            <span className="checks__icon" aria-hidden="true">
              {ICONS[c.status]}
            </span>
            <span className="checks__body">
              <span className="checks__label">{c.label}</span>
              <span className="checks__detail">{c.detail}</span>
            </span>
            <span className="visually-hidden">{c.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

import Logo from './Logo.jsx'
import RuneGlyph from './RuneGlyph.jsx'
import './RuneEmblem.css'

function Diamond() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 4l2 2-2 2-2-2z" fill="currentColor" />
    </svg>
  )
}

// The Rune logo that "wakes up" as parts are chosen: it starts dim and grey,
// gains colour and glow with each stage, and bursts when the build is done.
//   progress - 0..1 share of stages completed
//   status   - the line shown under the logo ("Core awakened", ...)
//   pips     - [{ key, rune, label, done }] one per stage
export default function RuneEmblem({ progress, status, complete, pips, size = 150 }) {
  return (
    <div className={`rune-emblem ${complete ? 'is-complete' : ''}`} style={{ '--p': progress }}>
      <div className="rune-emblem__stage">
        <span className="rune-emblem__ring" aria-hidden="true" />
        <Logo size={size} className="rune-emblem__logo" />
      </div>

      <p className="rune-emblem__status" aria-live="polite">
        <Diamond />
        <span key={status}>{status}</span>
      </p>

      <ul className="rune-emblem__pips" aria-label="Stages awakened">
        {pips.map((p) => (
          <li key={p.key} className={p.done ? 'is-done' : ''} title={`${p.label}${p.done ? ' awakened' : ''}`}>
            <RuneGlyph name={p.rune} size={18} />
          </li>
        ))}
      </ul>
    </div>
  )
}

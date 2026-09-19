import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GAMES, GENRES } from '../data/games.js'
import { BUDGETS, PREFS, SCREENS, USES, recommend, usesGaming } from '../utils/recommend.js'
import { formatPrice } from '../utils/format.js'
import { startCheckout } from '../utils/checkout.js'
import RigVisual from '../components/RigVisual.jsx'
import FpsPanel from '../components/FpsPanel.jsx'
import RuneGlyph from '../components/RuneGlyph.jsx'
import { CATEGORIES } from '../data/parts.js'
import './QuizModal.css'

const EMPTY = { use: null, games: [], res: '1440', budget: null, prefs: [] }

function Option({ selected, onClick, title, desc, multi }) {
  return (
    <button
      type="button"
      className={`q-option ${selected ? 'is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={`q-option__mark ${multi ? 'is-multi' : ''}`} aria-hidden="true">
        {selected ? '✓' : ''}
      </span>
      <span className="q-option__text">
        <strong>{title}</strong>
        {desc && <span>{desc}</span>}
      </span>
    </button>
  )
}

function ResultCard({ rig, reasons, badge, note, games, resKey, use, big, onBuy, buying, error, onNavigate }) {
  const { preset, build, price } = rig
  const game = usesGaming(use) && games.length ? games[0] : null

  return (
    <article className={`card match ${big ? 'match--big' : ''}`}>
      {badge && <span className="match__badge">{badge}</span>}
      <div className="match__visual">
        <RigVisual id={preset.id} build={build} alt={`${preset.name} custom PC`} />
      </div>
      <div className="match__body">
        <span className="tag">{preset.tier}</span>
        <div className="prebuilt__title">
          {preset.rune && (
            <span className="prebuilt__rune">
              <RuneGlyph name={preset.rune.key} size={22} />
            </span>
          )}
          <h2>{preset.name}</h2>
        </div>
        <p className="match__blurb">{preset.blurb}</p>
        {note && <p className="match__note">{note}</p>}

        {reasons && (
          <ul className="match__reasons">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}

        {big && (
          <FpsPanel
            build={build}
            game={game}
            resKey={resKey}
            headlineGames={preset.headlineGames}
            targetRes={preset.targetRes}
          />
        )}

        {big && (
          <ul className="prebuilt__specs">
            {CATEGORIES.map((cat) => (
              <li key={cat.key}>
                <span>{cat.label}</span>
                <span>{build[cat.key]?.name}</span>
              </li>
            ))}
          </ul>
        )}

        {error && <div className="issue issue--error">{error}</div>}

        <div className="match__foot">
          <span className="prebuilt__price">{formatPrice(price)}</span>
          <div className="prebuilt__actions">
            <Link to="/custom-build" state={{ presetIds: preset.partIds }} className="btn" onClick={onNavigate}>
              Customize
            </Link>
            {onBuy && (
              <button type="button" className="btn btn-primary" disabled={buying} onClick={onBuy}>
                {buying ? 'Redirecting…' : 'Buy Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function QuizModal({ onClose }) {
  const panelRef = useRef(null)
  const [answers, setAnswers] = useState(EMPTY)
  const [stepIndex, setStepIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [buyState, setBuyState] = useState({ id: null, status: 'idle', error: null })

  const steps = useMemo(() => {
    const list = ['use']
    if (usesGaming(answers.use)) list.push('games', 'screen')
    list.push('budget', 'prefs')
    return list
  }, [answers.use])

  const step = steps[stepIndex]
  const result = useMemo(() => (finished ? recommend(answers) : null), [finished, answers])

  function set(patch) {
    setAnswers((prev) => ({ ...prev, ...patch }))
  }

  function toggle(field, key) {
    setAnswers((prev) => ({
      ...prev,
      [field]: prev[field].includes(key) ? prev[field].filter((k) => k !== key) : [...prev[field], key],
    }))
  }

  function next() {
    if (stepIndex >= steps.length - 1) setFinished(true)
    else setStepIndex((i) => i + 1)
  }

  function chooseAndAdvance(patch) {
    set(patch)
    // Let the selection show for a beat before moving on.
    setTimeout(next, 180)
  }

  function restart() {
    setAnswers(EMPTY)
    setStepIndex(0)
    setFinished(false)
    setBuyState({ id: null, status: 'idle', error: null })
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function buy(preset) {
    setBuyState({ id: preset.id, status: 'loading', error: null })
    try {
      await startCheckout({ selections: preset.partIds, buildName: preset.name, cancelPath: window.location.pathname })
    } catch (err) {
      setBuyState({ id: preset.id, status: 'error', error: err.message })
    }
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const percent = finished ? 100 : Math.round((stepIndex / steps.length) * 100)
  const canContinue = step === 'games' || step === 'prefs' || Boolean(step === 'use' && answers.use)

  return (
    <div className="qmodal" role="dialog" aria-modal="true" aria-label="Find your PC quiz" onClick={onClose}>
     <div className="qmodal__panel card" ref={panelRef} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="qmodal__close" aria-label="Close quiz" onClick={onClose}>
        &times;
      </button>
      <div className="quiz__head">
        <span className="eyebrow">Find your PC</span>
        <h2>Tell me what you need. I&rsquo;ll find the PC.</h2>
        <p>A few quick questions and you&rsquo;ll get the best match from the rigs we build, with the frame rates to back it up.</p>
      </div>

      {!finished && (
        <div className="quiz__panel">
          <div className="quiz__progress">
            <span>
              Question {stepIndex + 1} of {steps.length}
            </span>
            <div
              className="build-progress__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Quiz progress"
            >
              <div className="build-progress__fill" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {step === 'use' && (
            <fieldset className="quiz__step">
              <legend>What will you mostly use it for?</legend>
              <div className="q-grid">
                {USES.map((u) => (
                  <Option
                    key={u.key}
                    title={u.label}
                    desc={u.desc}
                    selected={answers.use === u.key}
                    onClick={() => chooseAndAdvance({ use: u.key })}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 'games' && (
            <fieldset className="quiz__step">
              <legend>Which games do you play?</legend>
              <p className="quiz__hint">Pick as many as you like. Skip it if you are not sure.</p>
              {GENRES.map((genre) => (
                <div key={genre.key} className="quiz__group">
                  <span className="quiz__group-label">{genre.label}</span>
                  <div className="q-chips">
                    {GAMES.filter((g) => g.genre === genre.key).map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={answers.games.includes(g.id)}
                        className={`q-chip ${answers.games.includes(g.id) ? 'is-selected' : ''}`}
                        onClick={() => toggle('games', g.id)}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
          )}

          {step === 'screen' && (
            <fieldset className="quiz__step">
              <legend>What screen will you play on?</legend>
              <div className="q-grid q-grid--3">
                {SCREENS.map((s) => (
                  <Option
                    key={s.key}
                    title={s.label}
                    desc={s.desc}
                    selected={answers.res === s.key}
                    onClick={() => chooseAndAdvance({ res: s.key })}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 'budget' && (
            <fieldset className="quiz__step">
              <legend>What&rsquo;s your budget?</legend>
              <div className="q-grid q-grid--3">
                {BUDGETS.map((b) => (
                  <Option
                    key={b.key}
                    title={b.label}
                    selected={answers.budget === b.key}
                    onClick={() => chooseAndAdvance({ budget: b.key })}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 'prefs' && (
            <fieldset className="quiz__step">
              <legend>Anything else that matters?</legend>
              <p className="quiz__hint">Optional. Pick any that apply.</p>
              <div className="q-grid q-grid--3">
                {PREFS.map((p) => (
                  <Option
                    key={p.key}
                    multi
                    title={p.label}
                    desc={p.desc}
                    selected={answers.prefs.includes(p.key)}
                    onClick={() => toggle('prefs', p.key)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <div className="quiz__nav">
            <button
              type="button"
              className="btn"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              Back
            </button>
            {canContinue && (
              <button type="button" className="btn btn-primary" onClick={next}>
                {stepIndex === steps.length - 1 ? 'Show my PC' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      )}

      {finished && result && (
        <div className="quiz__result">
          <div className="quiz__result-head">
            <span className="eyebrow">Your match</span>
            <h2>{result.overBudget ? 'Closest match to your budget' : 'This is the one for you'}</h2>
          </div>

          <ResultCard
            big
            rig={result.pick}
            reasons={result.pick.reasons}
            badge="Best match"
            games={result.games}
            resKey={result.resKey}
            use={answers.use}
            onNavigate={onClose}
            onBuy={() => buy(result.pick.preset)}
            buying={buyState.id === result.pick.preset.id && buyState.status === 'loading'}
            error={buyState.id === result.pick.preset.id ? buyState.error : null}
          />

          {result.alternatives.length > 0 && (
            <>
              <h3 className="quiz__alt-title">Other options worth a look</h3>
              <div className="quiz__alts">
                {result.alternatives.map((alt) => (
                  <ResultCard
                    key={alt.rig.preset.id}
                    rig={alt.rig}
                    badge={alt.label}
                    note={alt.note}
                    games={result.games}
                    resKey={result.resKey}
                    use={answers.use}

                    onNavigate={onClose}
                  />
                ))}
              </div>
            </>
          )}

          <div className="quiz__result-actions">
            <button type="button" className="btn" onClick={restart}>
              Start again
            </button>
            <Link to="/custom-build" className="btn" onClick={onClose}>
              Build your own instead
            </Link>
            <Link to="/prebuilts" className="btn" onClick={onClose}>
              See every prebuilt
            </Link>
          </div>
          <p className="quiz__footnote">
            Frame rates are estimates from published benchmark averages. Delivery, warranty and returns are covered on
            the <Link to="/support" onClick={onClose}>support page</Link>.
          </p>
        </div>
      )}
     </div>
    </div>
  )
}

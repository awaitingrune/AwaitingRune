import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import FractureLines from '../components/FractureLines.jsx'
import PCTower from '../components/PCTower.jsx'
import RigVisual from '../components/RigVisual.jsx'
import ImageDisclaimer from '../components/ImageDisclaimer.jsx'
import RuneGlyph, { RUNE_KEYS } from '../components/RuneGlyph.jsx'
import { useQuiz } from '../components/QuizProvider.jsx'
import { formatPrice } from '../utils/format.js'
import pcShowcase from '../assets/pc-showcase.webp'
import { PREBUILTS, PREBUILT_CATEGORIES, resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import './Landing.css'

const ROTATE_MS = 4500

const FEATURED = PREBUILTS.filter((p) => p.series === 'rune')
const SERIES_SUBTITLE = PREBUILT_CATEGORIES.find((c) => c.key === 'rune')?.subtitle

const STEPS = [
  { n: '01', title: 'Choose', body: 'Pick a prebuilt or design your own. Sockets, wattage and clearance are checked as you go.' },
  { n: '02', title: 'Build', body: 'Your PC is built by hand to order, with tidy cabling and every part seated properly.' },
  { n: '03', title: 'Test', body: 'It runs under load before it leaves, so it arrives stable and ready to play or work.' },
  { n: '04', title: 'Deliver', body: 'Tracked, insured UK delivery, and a 12 month warranty once it is on your desk.' },
]

const TRUST = [
  { title: 'Tested before it ships', body: 'Every PC is stress tested under load, not just powered on.' },
  { title: '12 month warranty', body: 'Parts and labour covered, plus the manufacturer warranty on each component.' },
  { title: 'A real person to ask', body: 'Questions before or after you buy go straight to me, any time of day.' },
  { title: 'Tracked UK delivery', body: 'Free, insured and tracked, with an email when it ships.' },
]

// A half-finished build for the custom builder preview: case, CPU, cooler and
// GPU are in, memory is still a dashed outline.
const SAMPLE_BUILD = (() => {
  const full = resolveBuild(PREBUILTS.find((p) => p.id === 'performance').partIds)
  return { case: full.case, cpu: full.cpu, cooler: full.cooler, gpu: full.gpu }
})()

export default function Landing() {
  const { openQuiz } = useQuiz()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FEATURED.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const active = FEATURED[activeIndex]
  const activeEvaluation = evaluateBuild(resolveBuild(active.partIds))

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__ring" aria-hidden="true">
            <Logo size={253} />
          </div>
          <span className="eyebrow">Custom PCs, built right</span>
          <h1>
            Your vision,
            <br />
            your build, your mark.
          </h1>
          <p className="hero__sub">
            AwaitingRune doesn't just build systems — we build symbols that shape themselves to
            whatever you need, whether that's gaming, editing, or everyday use.
          </p>
          <div className="hero__actions">
            <Link to="/custom-build" className="btn btn-primary">
              Build Your PC
            </Link>
            <Link to="/prebuilts" className="btn">
              Shop Prebuilts
            </Link>
          </div>
        </div>
      </section>

      <section className="stage">
        <div className="stage__glow" aria-hidden="true" />
        <FractureLines className="stage__cracks stage__cracks--left" />
        <FractureLines className="stage__cracks stage__cracks--right" />
        <div className="stage__frame">
          <img
            className="stage__img"
            src={pcShowcase}
            width="1254"
            height="1254"
            alt="A black custom gaming PC with a cracked stone-textured side panel, a glowing purple rune R, and purple RGB fans"
            decoding="async"
          />
        </div>
      </section>

      <section className="container showcase">
        <div className="showcase__head">
          <div>
            <span className="eyebrow">Featured builds</span>
            <h2>The Rune Series</h2>
            {SERIES_SUBTITLE && <p className="showcase__sub">{SERIES_SUBTITLE}</p>}
          </div>
          <Link to="/prebuilts" className="btn">
            View all prebuilts
          </Link>
        </div>

        <div className="showcase__panel card">
          <div className="showcase__image" key={`img-${active.id}`}>
            <RigVisual id={active.id} build={resolveBuild(active.partIds)} alt={`${active.name} custom PC`} />
          </div>
          <div className="showcase__info" key={`info-${active.id}`}>
            <span className="tag">{active.tier}</span>
            <div className="showcase__title">
              {active.rune && (
                <span className="prebuilt__rune">
                  <RuneGlyph name={active.rune.key} size={22} />
                </span>
              )}
              <h3>{active.name}</h3>
            </div>
            {active.rune && (
              <p className="prebuilt__meaning">
                {active.rune.label} &middot; {active.rune.meaning}
              </p>
            )}
            <p>{active.blurb}</p>
            <div className="showcase__foot">
              <span className="showcase__price">{formatPrice(activeEvaluation.subtotal)}</span>
              <Link to="/custom-build" state={{ presetIds: active.partIds }} className="btn btn-primary">
                Customize
              </Link>
            </div>
          </div>
        </div>

        <div className="showcase__dots">
          {FEATURED.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`showcase__dot ${i === activeIndex ? 'is-active' : ''}`}
              aria-label={`Show ${p.name}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <ImageDisclaimer className="image-note--center showcase__note" />
      </section>

      <section className="why">
        <div className="why__inner">
          <div className="why__copy">
            <span className="eyebrow">Why AwaitingRune</span>
            <h2>I build PCs because I love it</h2>
            <p>
              I have been building PCs for a good few years now and I still get a kick out of it. Choosing the parts,
              getting the cables tidy, pressing the power button and watching it boot first time. That never gets old.
            </p>
            <p>
              I started AwaitingRune because I kept seeing people spend a lot of money on a PC that was wrong for what
              they wanted, or end up with parts that would not work together. I wanted to be the person who sorts that
              out properly.
            </p>
            <p>
              So every build here is one I would happily put on my own desk. Not sure what you need? Just ask. You will
              get a straight answer from me, not a sales script.
            </p>
            <div className="why__actions">
              <Link to="/about" className="btn">
                Ask me anything &rarr;
              </Link>
              <Link to="/prebuilts" className="btn">
                See the builds &rarr;
              </Link>
            </div>
          </div>

          <div className="why__feature">
            <Logo size={460} className="why__watermark" />
            <div className="why__glow" aria-hidden="true" />
            <div className="card why__quiz">
              <div className="why__runes" aria-hidden="true">
                {RUNE_KEYS.map((k) => (
                  <RuneGlyph key={k} name={k} size={20} />
                ))}
              </div>
              <span className="eyebrow">Not sure what you need?</span>
              <h3>Forge Your Own Rune</h3>
              <p>Tell us what you play, what you want to spend and what matters most.</p>
              <button type="button" className="btn btn-primary" onClick={openQuiz}>
                Find my PC &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container steps">
        <span className="eyebrow">How it works</span>
        <h2>We make it simple to forge your own</h2>
        <div className="steps__grid">
          {STEPS.map((s) => (
            <div key={s.n} className="steps__item">
              <span className="steps__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container forge">
        <div className="card forge__panel">
          <div className="forge__copy">
            <span className="eyebrow">Custom builder</span>
            <h2>Build your own Rune</h2>
            <p>
              Choose every part yourself. The price adds up as you go, every socket, wattage and clearance rule is
              checked live, and you can see the frame rates you will get in the games you play.
            </p>
            <ul className="forge__points">
              <li>Live compatibility checker</li>
              <li>Running price total</li>
              <li>FPS estimates for 12 games</li>
            </ul>
            <Link to="/custom-build" className="btn btn-primary">
              Open the builder &rarr;
            </Link>
          </div>
          <div className="forge__visual" aria-hidden="true">
            <PCTower build={SAMPLE_BUILD} />
          </div>
        </div>
      </section>

      <section className="container trust">
        <div className="trust__head">
          <span className="eyebrow">Why buy from us</span>
          <h2>Built properly, backed properly</h2>
        </div>
        <div className="trust__grid">
          {TRUST.map((t) => (
            <div key={t.title} className="card trust__item">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
        <Link to="/support" className="trust__link">
          Read the delivery, warranty and returns details &rarr;
        </Link>
      </section>
    </div>
  )
}

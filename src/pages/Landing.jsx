import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import PCTower from '../components/PCTower.jsx'
import { PREBUILTS, resolveBuild } from '../data/prebuilts.js'
import { evaluateBuild } from '../utils/compatibility.js'
import './Landing.css'

const ROTATE_MS = 4500

const FEATURES = [
  {
    title: 'Forge Your Own',
    body: 'Pick every component yourself. Prices total live, and every socket, wattage, and clearance rule is checked as you go.',
    to: '/custom-build',
    cta: 'Start a build',
  },
  {
    title: 'Curated Prebuilts',
    body: 'Not sure where to start? Grab one of our hand-tuned rigs, built and tested to a known-good spec.',
    to: '/prebuilts',
    cta: 'Browse prebuilts',
  },
  {
    title: 'Real Human Help',
    body: 'Stuck with anything? Reach out any time and talk to someone live who can help.',
    to: '/about',
    cta: 'Get in touch',
  },
]

const STEPS = [
  { n: '01', title: 'Choose your parts', body: 'CPU, motherboard, RAM, GPU, storage, cooler, PSU, and case.' },
  { n: '02', title: 'We check compatibility', body: 'Sockets, RAM type, wattage, and case clearance verified automatically.' },
  { n: '03', title: 'Lock in your build', body: 'See a running total and a clean summary of exactly what you picked.' },
]

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % PREBUILTS.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const active = PREBUILTS[activeIndex]
  const activeEvaluation = evaluateBuild(resolveBuild(active.partIds))

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__ring" aria-hidden="true">
            <Logo size={220} />
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
              Start Your Build
            </Link>
            <Link to="/prebuilts" className="btn">
              View Prebuilts
            </Link>
          </div>
        </div>
      </section>

      <section className="container features">
        {FEATURES.map((f) => (
          <Link key={f.title} to={f.to} className="card feature">
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            <span className="feature__cta">{f.cta} &rarr;</span>
          </Link>
        ))}
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

      <section className="container showcase">
        <div className="showcase__head">
          <div>
            <span className="eyebrow">Prebuilt rigs</span>
            <h2>Or start from one of ours</h2>
          </div>
          <Link to="/prebuilts" className="btn">
            View all prebuilts
          </Link>
        </div>

        <div className="showcase__panel card">
          <div className="showcase__image" key={`img-${active.id}`}>
            <PCTower tier={active.id} />
          </div>
          <div className="showcase__info" key={`info-${active.id}`}>
            {active.featured && <span className="prebuilt__badge">Most popular</span>}
            <span className="tag">{active.tier}</span>
            <h3>{active.name}</h3>
            <p>{active.blurb}</p>
            <div className="showcase__foot">
              <span className="showcase__price">${activeEvaluation.subtotal.toLocaleString()}</span>
              <Link to="/custom-build" state={{ presetIds: active.partIds }} className="btn btn-primary">
                Customize
              </Link>
            </div>
          </div>
        </div>

        <div className="showcase__dots">
          {PREBUILTS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`showcase__dot ${i === activeIndex ? 'is-active' : ''}`}
              aria-label={`Show ${p.name}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

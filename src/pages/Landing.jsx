import { Link } from 'react-router-dom'
import usePageMeta from '../utils/usePageMeta.js'
import Logo from '../components/Logo.jsx'
import FractureLines from '../components/FractureLines.jsx'
import FindYourRune from '../components/home/FindYourRune.jsx'
import RuneSeries from '../components/home/RuneSeries.jsx'
import WhyAwaitingRune from '../components/home/WhyAwaitingRune.jsx'
import WhatCanItRun from '../components/home/WhatCanItRun.jsx'
import CustomerBuilds from '../components/home/CustomerBuilds.jsx'
import HomeFaq from '../components/home/HomeFaq.jsx'
import FinalCta from '../components/home/FinalCta.jsx'
import pcShowcase from '../assets/pc-showcase.webp'
import '../components/home/Home.css'
import './Landing.css'

const STEPS = [
  { n: '01', title: 'Choose', body: 'Pick a prebuilt or design your own. Sockets, wattage and clearance are checked as you go.' },
  { n: '02', title: 'Build', body: 'Your PC is built by hand to order, with tidy cabling and every part seated properly.' },
  { n: '03', title: 'Test', body: 'It runs under load before it leaves, so it arrives stable and ready to play or work.' },
  { n: '04', title: 'Deliver', body: 'Tracked, insured UK delivery, and a 12 month warranty once it is on your desk.' },
]

export default function Landing() {
  usePageMeta({
    title: "AwaitingRune | Custom Gaming & Editing PCs, Forged in the UK",
    description: "Hand-built gaming and editing PCs, forged to order in the UK. Pick a Rune from the series or forge your own, with a 12 month warranty and tracked delivery.",
  })
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


      <FindYourRune />

      <RuneSeries />

      <WhyAwaitingRune />

      <WhatCanItRun />

      <CustomerBuilds />

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

      <HomeFaq />

      <FinalCta />
    </div>
  )
}

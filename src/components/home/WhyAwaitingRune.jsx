import { Link } from 'react-router-dom'
import Logo from '../Logo.jsx'
import RuneGlyph from '../RuneGlyph.jsx'

const PILLARS = [
  { rune: 'uruz', title: 'Warranty', body: '12 months covering parts and labour, plus each manufacturer’s own warranty.' },
  { rune: 'tiwaz', title: 'Testing', body: 'Every PC runs under load before it ships, not just powered on.' },
  { rune: 'ansuz', title: 'Support', body: 'A real person to ask, any time of day. No ticket queue.' },
  { rune: 'sowilo', title: 'Quality', body: 'Branded parts, matched properly and checked for compatibility.' },
]

export default function WhyAwaitingRune() {
  return (
    <section className="why">
      <div className="why__inner">
        <div className="why__copy">
          <span className="eyebrow">Why AwaitingRune?</span>
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
            <Link to="/support" className="btn">
              Warranty &amp; returns &rarr;
            </Link>
          </div>
        </div>

        <div className="why__feature">
          <Logo size={460} className="why__watermark" />
          <div className="why__glow" aria-hidden="true" />
          <ul className="why__pillars">
            {PILLARS.map((p) => (
              <li key={p.title} className="card why__pillar">
                <span className="why__pillar-rune" aria-hidden="true">
                  <RuneGlyph name={p.rune} size={22} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

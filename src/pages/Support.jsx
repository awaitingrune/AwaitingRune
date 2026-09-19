import { Link } from 'react-router-dom'
import { CONTACT } from '../data/site.js'
import './Support.css'

const FAQ = [
  {
    q: 'How long until my PC arrives?',
    a: 'Usually 5 to 7 working days to build and test it, then 2 to 3 working days for delivery. If a part is on backorder I will email you straight away with a new date rather than leaving you guessing.',
  },
  {
    q: 'Can I change my order after paying?',
    a: 'Yes, as long as I have not started building it. Email or ring me and I will swap parts or cancel for a full refund.',
  },
  {
    q: 'What if I upgrade something myself later?',
    a: 'Go for it. Adding RAM, storage or a new graphics card does not void the warranty on the rest of the PC.',
  },
  {
    q: 'Who do I contact if something goes wrong?',
    a: `Me, directly. Email ${CONTACT.email} or ring ${CONTACT.phone}. There is no ticket queue.`,
  },
]

export default function Support() {
  return (
    <div className="support container">
      <header className="support__head">
        <span className="eyebrow">Support</span>
        <h1>Delivery, warranty and returns</h1>
        <p>
          Everything you need to know about what happens after you order. If something here is not clear, ask me and
          I will explain it.
        </p>
        <nav className="support__jump" aria-label="On this page">
          <a href="#delivery">Delivery</a>
          <a href="#warranty">Warranty</a>
          <a href="#returns">Returns</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <section id="delivery" className="card support__section">
        <h2>Delivery</h2>
        <div className="support__facts">
          <div>
            <strong>5&ndash;7 days</strong>
            <span>build and test time, in working days</span>
          </div>
          <div>
            <strong>2&ndash;3 days</strong>
            <span>courier delivery once it ships</span>
          </div>
          <div>
            <strong>Free</strong>
            <span>tracked, insured UK delivery</span>
          </div>
        </div>
        <p>
          Every PC is built to order. Once your payment goes through I order in anything I do not have, build the
          machine, then run it under load to check it is stable before it goes anywhere.
        </p>
        <ul>
          <li>You get an email when your build is finished and another with your tracking number when it ships.</li>
          <li>Delivery is by tracked, insured courier to UK mainland addresses, and someone needs to sign for it.</li>
          <li>
            Northern Ireland, the Scottish Highlands and Islands, the Channel Islands and anywhere outside the UK:
            please get in touch before ordering so I can sort out delivery properly.
          </li>
          <li>
            When it arrives, check the box for damage before signing. If it looks knocked about, note it with the
            courier, take a few photos and message me the same day.
          </li>
        </ul>
      </section>

      <section id="warranty" className="card support__section">
        <h2>Warranty</h2>
        <p>
          Every AwaitingRune PC comes with a <strong>12 month warranty</strong> covering faults with the build or any
          component in it. If something fails, I will repair or replace it at no cost to you, parts and labour.
        </p>
        <ul>
          <li>
            The individual parts also carry their own manufacturer warranties, which are often longer than 12 months.
            I will help you with any claim so you are not left chasing a manufacturer.
          </li>
          <li>Upgrading RAM, storage or the graphics card yourself does not void the warranty on the rest of the PC.</li>
          <li>
            Not covered: physical damage, liquid damage, accidents, and faults caused by modifications that were not
            done by me.
          </li>
          <li>This sits on top of your legal rights, it does not replace them.</li>
        </ul>
      </section>

      <section id="returns" className="card support__section">
        <h2>Returns and cancellations</h2>
        <p>
          <strong>Changed your mind before I start building?</strong> Tell me and I will cancel the order and refund you
          in full.
        </p>
        <p>
          Because each PC is made to your specification, the usual 14 day cancellation right for online orders does
          not apply once the build has started. That is set out in the Consumer Contracts Regulations 2013.
        </p>
        <p>
          <strong>Something wrong with it?</strong> Your rights under the Consumer Rights Act 2015 apply in full:
        </p>
        <ul>
          <li>Within 30 days of delivery you can reject a faulty PC and get a full refund.</li>
          <li>Within 6 months, a faulty PC will be repaired or replaced, and if that does not fix it you can have a refund.</li>
          <li>Returning something faulty costs you nothing. I will arrange the courier and cover it.</li>
          <li>Refunds go back to the card you paid with, normally within 14 days of me receiving the PC back.</li>
        </ul>
      </section>

      <section id="faq" className="support__faq">
        <h2>Quick answers</h2>
        {FAQ.map((item) => (
          <details key={item.q} className="card faq">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="card support__cta">
        <h2>Still not sure?</h2>
        <p>Ask me directly. You will get a proper answer from a real person, any time of day.</p>
        <div className="support__actions">
          <Link to="/about" className="btn btn-primary">
            Contact me
          </Link>
          <a href={`mailto:${CONTACT.email}`} className="btn">
            {CONTACT.email}
          </a>
        </div>
      </section>
    </div>
  )
}

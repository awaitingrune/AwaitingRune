import { Link } from 'react-router-dom'
import { FAQ } from '../../data/faq.js'

export default function HomeFaq() {
  return (
    <section className="container home-section faq-home">
      <div className="home-section__head">
        <span className="eyebrow">FAQ</span>
        <h2>Questions people ask</h2>
      </div>

      <div className="faq-home__list">
        {FAQ.map((item) => (
          <details key={item.q} className="card faq">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <Link to="/support" className="faq-home__more">
        Delivery, warranty and returns in full &rarr;
      </Link>
    </section>
  )
}

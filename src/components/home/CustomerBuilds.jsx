import { Link } from 'react-router-dom'
import { CUSTOMER_BUILDS } from '../../data/customerBuilds.js'

export default function CustomerBuilds() {
  const hasBuilds = CUSTOMER_BUILDS.length > 0

  return (
    <section className="container home-section built">
      <div className="home-section__head">
        <span className="eyebrow">Built by AwaitingRune</span>
        <h2>Real builds, real owners</h2>
        <p>Photos and specs of PCs I have built for customers, shown with their permission.</p>
      </div>

      {hasBuilds ? (
        <div className="built__grid">
          {CUSTOMER_BUILDS.map((b) => (
            <article key={b.id} className="card built__card">
              <img src={b.image} alt={`${b.name} built for ${b.owner ?? 'a customer'}`} loading="lazy" decoding="async" />
              <div className="built__body">
                <h3>{b.name}</h3>
                {b.owner && <span className="built__owner">{b.owner}</span>}
                <ul className="built__specs">
                  {b.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {b.quote && <blockquote>&ldquo;{b.quote}&rdquo;</blockquote>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card built__empty">
          <h3>The first builds are on their way</h3>
          <p>
            Customer builds will show up here as soon as the first PCs ship, with real photos and the exact parts
            inside. Until then the pictures on this site are AI concepts of the finished machines.
          </p>
          <Link to="/prebuilts" className="btn">
            Browse the prebuilts &rarr;
          </Link>
        </div>
      )}
    </section>
  )
}

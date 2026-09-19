import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GALLERY, GALLERY_FILTERS, SPEC_LABELS, galleryHero } from '../data/gallery.js'
import { formatPrice } from '../utils/format.js'
import './Gallery.css'

const SORTS = [
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
]

function SpecIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [openId, setOpenId] = useState(null)

  const builds = useMemo(() => {
    const list = GALLERY.filter((b) => filter === 'all' || b.filters.includes(filter))
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [filter, sort])

  const open = GALLERY.find((b) => b.id === openId) ?? null

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpenId(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="gallery">
      <section className="gallery__hero">
        <div className="container gallery__hero-inner">
          <div className="gallery__hero-copy">
            <span className="eyebrow">The Rune Gallery</span>
            <h1>
              Builds that speak
              <br />
              for themselves.
            </h1>
            <p>
              Every build is a reflection of our passion for performance, aesthetics and attention to detail. Explore
              some of our latest custom builds, showcasing the power, style and individuality of AwaitingRune.
            </p>
          </div>
          <div className="gallery__hero-art" aria-hidden="true">
            <img src={galleryHero} alt="" decoding="async" />
            <span className="gallery__stamp">Built different.</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="gallery__controls">
          <div className="gallery__filters" role="tablist" aria-label="Filter builds">
            {GALLERY_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                className={`filter-pill ${filter === f.key ? 'is-active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="prebuilts__sort">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {builds.length === 0 ? (
          <p className="prebuilts__empty">No builds match that filter yet.</p>
        ) : (
          <div className="gallery__grid">
            {builds.map((b) => (
              <article key={b.id} className="card gcard">
                <div className="gcard__main">
                  <div className="gcard__photo">
                    <img src={b.image} alt={`${b.name} custom PC`} loading="lazy" decoding="async" />
                  </div>
                  <div className="gcard__info">
                    <h2>{b.name}</h2>
                    <p className="gcard__tagline">{b.tagline}</p>
                    <ul className="gcard__specs">
                      {Object.entries(b.specs).map(([key, value]) => (
                        <li key={key}>
                          <SpecIcon />
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="gcard__price">{formatPrice(b.price)}</div>
                    <button type="button" className="gcard__view" onClick={() => setOpenId(b.id)}>
                      View Build &rarr;
                    </button>
                  </div>
                </div>
                <ul className="gcard__tags">
                  {b.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>

      <section className="gallery__cta">
        <span className="gallery__cta-eyebrow">Can&rsquo;t find what you&rsquo;re looking for?</span>
        <h2>Get a custom build</h2>
        <p>Tell us your budget, your games and your style, and we&rsquo;ll create a build just for you.</p>
        <div className="gallery__cta-actions">
          <Link to="/custom-build" className="btn btn-primary">
            Start Your Build
          </Link>
          <Link to="/find-your-pc" className="btn">
            Take the 1 minute quiz
          </Link>
        </div>
      </section>

      {open && (
        <div className="gmodal" role="dialog" aria-modal="true" aria-label={open.name} onClick={() => setOpenId(null)}>
          <div className="gmodal__panel card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gmodal__close" aria-label="Close" onClick={() => setOpenId(null)}>
              &times;
            </button>
            <div className="gmodal__photo">
              <img src={open.image} alt={`${open.name} custom PC`} />
            </div>
            <div className="gmodal__body">
              <h2>{open.name}</h2>
              <p className="gcard__tagline">{open.tagline}</p>
              <ul className="gmodal__specs">
                {Object.entries(open.specs).map(([key, value]) => (
                  <li key={key}>
                    <span>{SPEC_LABELS[key]}</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              <ul className="gcard__tags">
                {open.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="gmodal__foot">
                <span className="gcard__price">{formatPrice(open.price)}</span>
                <div className="gmodal__actions">
                  <Link to="/custom-build" className="btn btn-primary">
                    Build one like this
                  </Link>
                  <Link to="/about" className="btn">
                    Ask about it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

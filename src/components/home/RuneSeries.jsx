import { Link } from 'react-router-dom'
import { PREBUILTS, PREBUILT_CATEGORIES, resolveBuild } from '../../data/prebuilts.js'
import { evaluateBuild } from '../../utils/compatibility.js'
import { formatPrice } from '../../utils/format.js'
import { shortName } from '../../utils/partOptions.js'
import RigVisual from '../RigVisual.jsx'
import RuneGlyph from '../RuneGlyph.jsx'
import ImageDisclaimer from '../ImageDisclaimer.jsx'
import { useCustomize } from '../CustomizeProvider.jsx'

// The flagship four: the top gaming rig, raw power, esports, and creation.
const FLAGSHIP_IDS = ['sowilo', 'uruz', 'tiwaz', 'kenaz']
const SUBTITLE = PREBUILT_CATEGORIES.find((c) => c.key === 'rune')?.subtitle

export default function RuneSeries() {
  const { openCustomize } = useCustomize()
  const rigs = FLAGSHIP_IDS.map((id) => PREBUILTS.find((p) => p.id === id)).filter(Boolean)

  return (
    <section className="container home-section series-home">
      <div className="home-section__head home-section__head--row">
        <div>
          <span className="eyebrow">Rune Series</span>
          <h2>{SUBTITLE ?? 'The Rune Series'}</h2>
          <p>Our flagship prebuilts. Every one can be customised before you buy.</p>
        </div>
        <Link to="/prebuilts" className="btn">
          View all prebuilts &rarr;
        </Link>
      </div>

      <div className="series-home__grid">
        {rigs.map((preset) => {
          const build = resolveBuild(preset.partIds)
          const price = evaluateBuild(build).subtotal
          return (
            <article key={preset.id} className="card series-card">
              <RigVisual id={preset.id} build={build} alt={`${preset.name} custom PC`} />
              <span className="tag">{preset.tier}</span>
              <div className="series-card__title">
                <span className="prebuilt__rune">
                  <RuneGlyph name={preset.rune.key} size={22} />
                </span>
                <h3>{preset.name}</h3>
              </div>
              <p className="prebuilt__meaning">
                {preset.rune.label} &middot; {preset.rune.meaning}
              </p>
              <p className="series-card__spec">
                {shortName(build.cpu.name)} &middot; {shortName(build.gpu.name)}
              </p>
              <div className="series-card__foot">
                <span className="series-card__price">{formatPrice(price)}</span>
                <button type="button" className="btn btn-primary" onClick={() => openCustomize(preset)}>
                  Customize
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <ImageDisclaimer className="image-note--center" />
    </section>
  )
}

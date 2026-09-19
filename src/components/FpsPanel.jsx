import { RESOLUTIONS, findGame } from '../data/games.js'
import { RATINGS, estimateFps, performanceFor, rateFps } from '../utils/fps.js'
import './FpsPanel.css'

function resLabel(key) {
  return RESOLUTIONS.find((r) => r.key === key)?.label ?? key
}

// With a game chosen: that game at all three resolutions, with a rating at
// the resolution the shopper picked. Otherwise: a few headline games at the
// rig's target resolution.
export default function FpsPanel({ build, game, resKey, headlineGames, targetRes }) {
  if (game) {
    const perf = performanceFor(game, build)
    const chosen = perf[resKey]
    const scaleMax = game.target * 2

    return (
      <div className="fps">
        <div className="fps__head">
          <span className="fps__title">{game.name}</span>
          {chosen && (
            <span className={`fps__chip fps__chip--${RATINGS[chosen.rating].tone}`}>
              {RATINGS[chosen.rating].label} at {resLabel(resKey)}
            </span>
          )}
        </div>
        <ul className="fps__bars">
          {RESOLUTIONS.map((r) => {
            const p = perf[r.key]
            if (!p) return null
            const tone = RATINGS[p.rating].tone
            return (
              <li key={r.key} className={r.key === resKey ? 'is-selected' : ''}>
                <span className="fps__res">{r.label}</span>
                <span className="fps__bar">
                  <span className={`fps__fill fps__fill--${tone}`} style={{ width: `${Math.min(100, (p.fps / scaleMax) * 100)}%` }} />
                </span>
                <span className="fps__val">{p.fps}</span>
              </li>
            )
          })}
        </ul>
        <p className="fps__note">
          {game.settings}
          {game.cap ? ` · engine-capped at ${game.cap} FPS` : ''} · target {game.target}+ FPS
        </p>
      </div>
    )
  }

  return (
    <div className="fps">
      <div className="fps__head">
        <span className="fps__title">Estimated FPS</span>
        <span className="fps__tag">{resLabel(targetRes)}</span>
      </div>
      <ul className="fps__list">
        {headlineGames.map((id) => {
          const g = findGame(id)
          const fps = estimateFps(g, targetRes, { gpu: build.gpu, cpu: build.cpu })
          if (fps === null) return null
          const tone = RATINGS[rateFps(fps, g.target)].tone
          return (
            <li key={id}>
              <span className="fps__game">{g.name}</span>
              <span className={`fps__num fps__num--${tone}`}>{fps}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

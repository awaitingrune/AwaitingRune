import { useState } from 'react'
import { GAMES, GENRES, RESOLUTIONS, findGame } from '../data/games.js'
import { RATINGS, estimateFps, rateFps } from '../utils/fps.js'
import FpsPanel from './FpsPanel.jsx'
import './BuildInsights.css'

// The highest resolution where most of our test games reach their target.
function sweetSpot(build) {
  const parts = { gpu: build.gpu, cpu: build.cpu }
  const summary = RESOLUTIONS.map((r) => {
    const hits = GAMES.filter((g) => {
      const fps = estimateFps(g, r.key, parts)
      return fps !== null && fps >= g.target
    })
    return { ...r, share: hits.length / GAMES.length }
  })
  const good = [...summary].reverse().find((s) => s.share >= 0.75)
  if (good) return { label: good.label, text: `Comfortable at ${good.label}: most games reach their target frame rate.` }
  const ok = [...summary].reverse().find((s) => s.share >= 0.4)
  if (ok) return { label: ok.label, text: `Best at ${ok.label}. Heavier games will want lower settings above that.` }
  return { label: '1080p', text: 'Best at 1080p, with some settings turned down in the heavier games.' }
}

export default function BuildPerformance({ build }) {
  const [gameId, setGameId] = useState('cyberpunk')
  const [resKey, setResKey] = useState('1440')

  const ready = Boolean(build.cpu && build.gpu)
  const game = findGame(gameId)
  const spot = ready ? sweetSpot(build) : null

  return (
    <section className="insight card" aria-label="Performance estimate">
      <div className="insight__head">
        <h3>Performance estimate</h3>
        {spot && <span className="insight__count">{spot.label} sweet spot</span>}
      </div>

      {!ready ? (
        <p className="insight__verdict insight__verdict--idle">
          Pick a CPU and a graphics card to see estimated frame rates.
        </p>
      ) : (
        <>
          <p className="insight__verdict insight__verdict--good">{spot.text}</p>

          <div className="perf__controls">
            <label className="perf__field">
              <span>Game</span>
              <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
                {GENRES.map((g) => (
                  <optgroup key={g.key} label={g.label}>
                    {GAMES.filter((x) => x.genre === g.key).map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <div className="perf__res" role="group" aria-label="Resolution">
              {RESOLUTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  aria-pressed={resKey === r.key}
                  className={`filter-pill ${resKey === r.key ? 'is-active' : ''}`}
                  onClick={() => setResKey(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <FpsPanel build={build} game={game} resKey={resKey} />

          <details className="perf__all">
            <summary>Every game at {RESOLUTIONS.find((r) => r.key === resKey)?.label}</summary>
            <ul>
              {GAMES.map((g) => {
                const fps = estimateFps(g, resKey, { gpu: build.gpu, cpu: build.cpu })
                if (fps === null) return null
                const rating = rateFps(fps, g.target)
                return (
                  <li key={g.id}>
                    <span>{g.name}</span>
                    <span className={`fps__num fps__num--${RATINGS[rating].tone}`}>{fps} FPS</span>
                  </li>
                )
              })}
            </ul>
          </details>

          <p className="perf__note">
            Estimates from published benchmark averages, no ray tracing or upscaling. Real results vary by about
            10&ndash;15%.
          </p>
        </>
      )}
    </section>
  )
}

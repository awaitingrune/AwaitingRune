import { useState } from 'react'
import { GAMES, RESOLUTIONS } from '../../data/games.js'
import { PREBUILTS, presetPrice, resolveBuild } from '../../data/prebuilts.js'
import { evaluateBuild } from '../../utils/compatibility.js'
import { RATINGS, estimateFps, rateFps } from '../../utils/fps.js'
import { formatPrice } from '../../utils/format.js'
import { shortName } from '../../utils/partOptions.js'
import { useCustomize } from '../CustomizeProvider.jsx'
import '../FpsPanel.css'

// Workstations are for editing, so only the gaming rigs are listed here.
const RIGS = PREBUILTS.filter((p) => p.category !== 'workstation')
const GAME_IDS = ['cs2', 'fortnite', 'apex', 'warzone', 'cyberpunk', 'rdr2', 'eldenring', 'blackmyth']
const SHOWN = GAME_IDS.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean)

export default function WhatCanItRun() {
  const { openCustomize } = useCustomize()
  const [rigId, setRigId] = useState('uruz')
  const [resKey, setResKey] = useState('1440')

  const preset = RIGS.find((p) => p.id === rigId) ?? RIGS[0]
  const build = resolveBuild(preset.partIds)
  const price = presetPrice(preset, evaluateBuild(build))
  const resLabel = RESOLUTIONS.find((r) => r.key === resKey)?.label

  return (
    <section className="container home-section run">
      <div className="home-section__head">
        <span className="eyebrow">Frame rates</span>
        <h2>What can it run?</h2>
        <p>Pick a PC and a screen resolution to see the frame rates you can expect in popular games.</p>
      </div>

      <div className="card run__panel">
        <div className="run__controls">
          <label className="run__field">
            <span>Choose a PC</span>
            <select value={rigId} onChange={(e) => setRigId(e.target.value)}>
              {RIGS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <div className="run__field">
            <span>Resolution</span>
            <div className="run__pills" role="group" aria-label="Resolution">
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
          <div className="run__rig">
            <strong>{preset.name}</strong>
            <span>
              {shortName(build.cpu.name)} &middot; {shortName(build.gpu.name)} &middot; {formatPrice(price)}
            </span>
          </div>
        </div>

        <ul className="run__games">
          {SHOWN.map((game) => {
            const fps = estimateFps(game, resKey, { gpu: build.gpu, cpu: build.cpu })
            if (fps === null) return null
            const rating = rateFps(fps, game.target)
            const tone = RATINGS[rating].tone
            return (
              <li key={game.id}>
                <span className="run__game">{game.name}</span>
                <span className="fps__bar">
                  <span
                    className={`fps__fill fps__fill--${tone}`}
                    style={{ width: `${Math.min(100, (fps / (game.target * 2)) * 100)}%` }}
                  />
                </span>
                <span className="run__fps">
                  {fps} <small>FPS</small>
                </span>
                <span className={`fps__chip fps__chip--${tone} run__rating`}>{RATINGS[rating].label}</span>
              </li>
            )
          })}
        </ul>

        <div className="run__foot">
          <p>
            Estimated at {resLabel} from published benchmark averages for each graphics card and processor, with no
            ray tracing or upscaling. Real results vary by about 10&ndash;15%.
          </p>
          <button type="button" className="btn" onClick={() => openCustomize(preset)}>
            Customize this PC
          </button>
        </div>
      </div>
    </section>
  )
}

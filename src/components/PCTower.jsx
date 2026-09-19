import { useId } from 'react'
import './PCTower.css'

// A stylised PC that reflects the parts it's given: the case sets the
// width, the cooler decides between a top radiator (240/360mm) or a tower
// heatsink, the GPU sets the card length and fan count, and any part that
// hasn't been chosen yet shows as a dashed outline.
const CASE_WIDTH = { mini: 176, tower: 204, elite: 216 }
const CX = 120

const GHOST = {
  fill: 'none',
  stroke: 'var(--border-strong)',
  strokeWidth: 1.2,
  strokeDasharray: '4 3',
}

function Fan({ cx, cy, r, gradId }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} stroke="var(--purple-400)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="none" stroke="var(--purple-200)" strokeWidth="1.2" opacity="0.8" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={cx}
          y1={cy}
          x2={cx + r * 0.85 * Math.cos((a * Math.PI) / 180)}
          y2={cy + r * 0.85 * Math.sin((a * Math.PI) / 180)}
          stroke="var(--purple-300)"
          strokeWidth="1"
          opacity="0.55"
        />
      ))}
    </g>
  )
}

function coolerKind(cooler) {
  if (!cooler) return null
  if (cooler.id.includes('aio360')) return 'aio360'
  if (cooler.id.includes('aio240')) return 'aio240'
  return 'air'
}

export default function PCTower({ build = {}, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const gradId = `${uid}-glow`
  const caseGradId = `${uid}-case`
  const glassGradId = `${uid}-glass`
  const blurId = `${uid}-blur`

  const { case: pcCase, cpu, ram, gpu, cooler } = build
  const kind = pcCase?.id === 'case-mini' ? 'mini' : pcCase?.id === 'case-elite' ? 'elite' : 'tower'
  const W = CASE_WIDTH[kind]
  const caseX = CX - W / 2
  const glassX = caseX + 16
  const glassW = W - 32

  const moboW = glassW - 74
  const moboX = glassX + 12
  const moboY = 66
  const colX = moboX + moboW + 10

  const cool = coolerKind(cooler)
  const blockX = moboX + 24
  const blockY = 112

  const slotsX = moboX + moboW - 36
  const filledSlots = ram ? [1, 3] : []

  const gpuFans = gpu ? (gpu.tdp >= 250 ? 3 : 2) : 2
  const gpuW = Math.round((glassW - 24) * Math.min(1, (gpu?.lengthMm ?? 260) / 340))
  const gpuH = gpu && gpu.tdp >= 300 ? 44 : 36
  const gpuY = 190
  const gpuX = glassX + 12

  const radiatorFans = cool === 'aio360' ? 3 : cool === 'aio240' ? 2 : 0
  const fanSpacing = radiatorFans ? moboW / radiatorFans : 0

  return (
    <svg
      className={`pc-tower ${pcCase ? '' : 'is-no-case'} ${className}`}
      viewBox="0 0 240 300"
      role="img"
      aria-label="Illustration of the selected PC build"
    >
      <defs>
        <linearGradient id={caseGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--bg-3)" />
          <stop offset="100%" stopColor="var(--bg-1)" />
        </linearGradient>
        <radialGradient id={gradId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--purple-200)" />
          <stop offset="100%" stopColor="var(--purple-600)" />
        </radialGradient>
        <linearGradient id={glassGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--purple-400)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--purple-700)" stopOpacity="0.05" />
        </linearGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx={CX} cy="291" rx={W / 2 - 14} ry="5" fill="var(--purple-500)" opacity="0.35" filter={`url(#${blurId})`} />

      <g className="pc-tower__case">
        <rect x={caseX} y="10" width={W} height="280" rx="16" fill={`url(#${caseGradId})`} stroke="var(--border-strong)" />
        <rect x={caseX} y="10" width={W} height="18" rx="9" fill="var(--bg-0)" opacity="0.5" />
        <circle cx={caseX + W - 14} cy="19" r="3.5" fill="var(--purple-300)" />
        {kind === 'elite' && (
          <rect x={caseX + 6} y="44" width="3" height="226" rx="1.5" fill="var(--purple-400)" opacity="0.75" />
        )}
        <rect x={glassX} y="40" width={glassW} height="234" rx="10" fill={`url(#${glassGradId})`} stroke="var(--border)" />
      </g>

      {/* motherboard */}
      <rect x={moboX} y={moboY} width={moboW} height="112" rx="5" fill="var(--bg-1)" stroke="var(--border)" />

      {/* memory: four slots, two populated */}
      {[0, 1, 2, 3].map((i) => {
        const filled = filledSlots.includes(i)
        return (
          <rect
            key={i}
            x={slotsX + i * 8}
            y={moboY + 8}
            width="5"
            height="44"
            rx="1.5"
            fill={filled ? 'var(--purple-500)' : 'none'}
            opacity={filled ? 0.9 : 1}
            {...(filled ? {} : GHOST)}
          />
        )
      })}

      {/* cooling */}
      {radiatorFans > 0 && (
        <g>
          <rect x={moboX} y="46" width={moboW} height="16" rx="4" fill="var(--bg-0)" stroke="var(--purple-500)" strokeWidth="1.2" />
          {Array.from({ length: radiatorFans }).map((_, i) => (
            <Fan
              key={i}
              cx={moboX + fanSpacing * (i + 0.5)}
              cy={54}
              r={Math.min(6.5, fanSpacing / 2 - 2)}
              gradId={gradId}
            />
          ))}
          <path
            d={`M ${blockX - 6} ${blockY - 10} C ${blockX - 6} 84, ${moboX + 8} 76, ${moboX + 8} 62`}
            fill="none"
            stroke="var(--purple-700)"
            strokeWidth="2.5"
          />
          <path
            d={`M ${blockX + 6} ${blockY - 10} C ${blockX + 6} 90, ${moboX + 22} 78, ${moboX + 22} 62`}
            fill="none"
            stroke="var(--purple-700)"
            strokeWidth="2.5"
          />
          <circle cx={blockX} cy={blockY} r="11" fill="var(--bg-0)" stroke="var(--purple-400)" strokeWidth="1.5" />
          <path
            d={`M ${blockX - 3} ${blockY + 5} V ${blockY - 5} H ${blockX + 2} L ${blockX + 4} ${blockY - 2} L ${blockX + 2} ${blockY + 1} H ${blockX - 3} M ${blockX} ${blockY + 1} L ${blockX + 4.5} ${blockY + 5}`}
            fill="none"
            stroke="var(--purple-200)"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
        </g>
      )}

      {cool === 'air' && (
        <g>
          <rect x={moboX + 10} y="84" width="34" height="50" rx="3" fill="var(--bg-0)" stroke="var(--purple-500)" strokeWidth="1.2" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={moboX + 14 + i * 5} y1="87" x2={moboX + 14 + i * 5} y2="131" stroke="var(--purple-700)" strokeWidth="1" />
          ))}
          <Fan cx={moboX + 27} cy={109} r={10} gradId={gradId} />
        </g>
      )}

      {!cool && (
        <rect
          x={blockX - 9}
          y={blockY - 9}
          width="18"
          height="18"
          rx="2"
          {...(cpu ? { fill: 'var(--bg-3)', stroke: 'var(--purple-500)', strokeWidth: 1.2 } : GHOST)}
        />
      )}

      {/* graphics card */}
      <rect
        x={gpuX}
        y={gpuY}
        width={gpuW}
        height={gpuH}
        rx="7"
        {...(gpu ? { fill: 'var(--bg-1)', stroke: 'var(--purple-400)', strokeWidth: 1.5 } : GHOST)}
      />
      {gpu &&
        Array.from({ length: gpuFans }).map((_, i) => {
          const spacing = gpuW / (gpuFans + 1)
          return <Fan key={i} cx={gpuX + spacing * (i + 1)} cy={gpuY + gpuH / 2} r={gpuH / 2 - 5} gradId={gradId} />
        })}

      {/* rear intake fans */}
      <rect x={colX} y={moboY} width={glassX + glassW - 12 - colX} height="112" rx="5" fill="var(--bg-1)" stroke="var(--border)" />
      {[86, 122, 158].map((y) => (
        <Fan key={y} cx={colX + (glassX + glassW - 12 - colX) / 2} cy={y} r="12" gradId={gradId} />
      ))}

      {/* power supply shroud + underglow strip */}
      <rect x={glassX + 12} y="238" width={glassW - 24} height="24" rx="4" fill="var(--bg-0)" opacity="0.6" stroke="var(--border)" />
      <rect x={glassX} y="270" width={glassW} height="4" rx="2" fill="var(--purple-500)" opacity="0.6" />
    </svg>
  )
}

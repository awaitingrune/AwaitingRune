import './Logo.css'

// Omega (Ω) ring surrounding the R: a broken circle with two flared feet.
const OMEGA_R = 44
const OMEGA_GAP_DEG = 100
const OMEGA_ARC_STEPS = 48
const OMEGA_FOOT_R = 53
const OMEGA_FOOT_SPREAD_DEG = 18

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function pt(cx, cy, r, angle) {
  const [x, y] = polar(cx, cy, r, angle)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

function buildOmegaPath(cx, cy) {
  const gapHalf = OMEGA_GAP_DEG / 2
  const arcStart = 180 - gapHalf // right-hand end of the arc
  const arcEnd = 180 + gapHalf // left-hand end of the arc

  const arcPoints = Array.from({ length: OMEGA_ARC_STEPS + 1 }, (_, i) => {
    const t = arcEnd + (i / OMEGA_ARC_STEPS) * (arcStart + 360 - arcEnd)
    return pt(cx, cy, OMEGA_R, t)
  })

  // arcPoints[0] sits at the lower-left arc end (arcEnd); the last point
  // sits at the lower-right arc end (arcStart) — feet attach accordingly.
  const leftFootTip = pt(cx, cy, OMEGA_FOOT_R, arcEnd + OMEGA_FOOT_SPREAD_DEG)
  const rightFootTip = pt(cx, cy, OMEGA_FOOT_R, arcStart - OMEGA_FOOT_SPREAD_DEG)

  return `M ${leftFootTip} L ${arcPoints.join(' L ')} L ${rightFootTip}`
}

export default function Logo({ size = 44, showWordmark = false, className = '' }) {
  const cx = 60
  const cy = 60

  return (
    <div className={`logo ${className}`} style={{ '--logo-size': `${size}px` }}>
      <svg
        className="logo__mark"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        role="img"
        aria-label="AwaitingRune logo"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--purple-300)" />
            <stop offset="100%" stopColor="var(--purple-600)" />
          </linearGradient>
        </defs>

        <path
          d={buildOmegaPath(cx, cy)}
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 44 26 L 44 94 M 44 26 L 70 26 L 78 40 L 70 54 L 44 54 M 44 54 L 78 94"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="8.5"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && <span className="logo__wordmark">AwaitingRune</span>}
    </div>
  )
}

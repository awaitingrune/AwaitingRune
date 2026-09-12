import './Logo.css'

// A PC case with a jagged crack running down the side, glowing from
// within — the R rune sits engraved at the fracture, as if it's the
// source of the crack.
const CASE_X = 18
const CASE_Y = 8
const CASE_W = 84
const CASE_H = 104
const CASE_RX = 12

const CRACK_PATH = 'M 66 8 L 54 24 L 68 36 L 48 52 L 66 66 L 46 80 L 62 94 L 50 112'

const R_PATH = 'M 44 30 L 44 90 M 44 30 L 68 30 L 76 44 L 68 58 L 44 58 M 44 58 L 76 90'

export default function Logo({ size = 44, showWordmark = false, className = '' }) {
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
          <linearGradient id="logoCaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-3)" />
            <stop offset="100%" stopColor="var(--bg-1)" />
          </linearGradient>
          <filter id="logoCrackGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        <rect
          x={CASE_X}
          y={CASE_Y}
          width={CASE_W}
          height={CASE_H}
          rx={CASE_RX}
          fill="url(#logoCaseGrad)"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
        />

        <path
          d={CRACK_PATH}
          fill="none"
          stroke="var(--purple-400)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
          filter="url(#logoCrackGlow)"
        />

        <path
          d={CRACK_PATH}
          fill="none"
          stroke="var(--purple-200)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={R_PATH}
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="7.5"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && <span className="logo__wordmark">AwaitingRune</span>}
    </div>
  )
}

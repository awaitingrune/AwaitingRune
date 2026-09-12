import './Logo.css'

// A geometric gaming-PC tower, viewed slightly from front/side, dark
// metallic panels with a soft internal glow strip. The right edge of the
// side panel doesn't stay a straight line — it forges outward into the
// angular strokes of a rune-R, so the rune and the chassis read as one
// continuous silhouette rather than two overlaid shapes.
const VIEW = 140

export default function Logo({ size = 44, showWordmark = false, className = '' }) {
  return (
    <div className={`logo ${className}`} style={{ '--logo-size': `${size}px` }}>
      <svg
        className="logo__mark"
        width={size}
        height={size}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="img"
        aria-label="AwaitingRune logo"
      >
        <defs>
          <linearGradient id="logoRuneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--purple-200)" />
            <stop offset="100%" stopColor="var(--purple-600)" />
          </linearGradient>
          <linearGradient id="logoFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-2)" />
            <stop offset="100%" stopColor="var(--bg-0)" />
          </linearGradient>
          <linearGradient id="logoSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-1)" />
            <stop offset="100%" stopColor="var(--bg-0)" />
          </linearGradient>
          <filter id="logoGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.4" />
          </filter>
          <filter id="logoSoftGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* top panel (isometric lip) */}
        <polygon points="20,20 72,20 86,8 34,8" fill="var(--bg-3)" stroke="var(--purple-700)" strokeWidth="1.2" />

        {/* side panel — its outer edge forges into the rune, drawn below */}
        <polygon points="72,20 86,8 86,108 72,120" fill="url(#logoSideGrad)" stroke="var(--purple-700)" strokeWidth="1.2" />

        {/* front panel */}
        <rect x="20" y="20" width="52" height="100" rx="6" fill="url(#logoFrontGrad)" stroke="var(--purple-700)" strokeWidth="1.4" />

        {/* subtle intake vents */}
        <g stroke="var(--purple-700)" strokeWidth="1" opacity="0.55" strokeLinecap="round">
          <line x1="30" y1="27" x2="58" y2="27" />
          <line x1="30" y1="31" x2="58" y2="31" />
          <line x1="30" y1="35" x2="58" y2="35" />
        </g>

        {/* internal RGB glow visible through the front seam */}
        <rect x="43" y="42" width="5" height="70" rx="2.5" fill="var(--purple-500)" opacity="0.5" filter="url(#logoSoftGlow)" />
        <rect x="43" y="42" width="5" height="70" rx="2.5" fill="var(--purple-300)" opacity="0.35" />

        {/* rune-R forged from the side panel's edge — glow pass */}
        <path
          d="M 86 34 L 86 98 M 86 34 L 110 34 L 120 48 L 110 62 L 86 62 M 86 62 L 118 98"
          fill="none"
          stroke="var(--purple-400)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
          filter="url(#logoGlow)"
        />
        {/* rune-R core strokes, sharp and bright */}
        <path
          d="M 86 34 L 86 98 M 86 34 L 110 34 L 120 48 L 110 62 L 86 62 M 86 62 L 118 98"
          fill="none"
          stroke="url(#logoRuneGrad)"
          strokeWidth="3.2"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && <span className="logo__wordmark">AwaitingRune</span>}
    </div>
  )
}

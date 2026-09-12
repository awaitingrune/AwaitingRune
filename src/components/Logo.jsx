import './Logo.css'

// A single dark-metal PC side panel, viewed at an angle, torn open from
// within — jagged fracture, a handful of displaced shell fragments, and
// the rune-R bursting straight out through the breach. The R overlaps the
// broken edge and a couple of the fragments so it reads as erupting
// through the shell, not sitting beside it.
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
            <stop offset="0%" stopColor="var(--purple-100)" />
            <stop offset="100%" stopColor="var(--purple-600)" />
          </linearGradient>
          <linearGradient id="logoPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-2)" />
            <stop offset="100%" stopColor="var(--bg-0)" />
          </linearGradient>
          <radialGradient id="logoVoidGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--purple-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--purple-700)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="logoAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--purple-600)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--purple-600)" stopOpacity="0" />
          </radialGradient>
          <filter id="logoGlowTight" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="logoGlowWide" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <filter id="logoGlowAmbient" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* ambient purple illumination behind the whole mark */}
        <circle cx="70" cy="70" r="58" fill="url(#logoAmbient)" filter="url(#logoGlowAmbient)" />

        {/* the case's side panel */}
        <polygon
          points="30,8 100,2 108,132 38,138"
          fill="url(#logoPanelGrad)"
          stroke="var(--purple-700)"
          strokeWidth="1.6"
        />
        <line x1="42" y1="38" x2="94" y2="34" stroke="var(--purple-700)" strokeWidth="1" opacity="0.4" />
        <line x1="42" y1="104" x2="98" y2="100" stroke="var(--purple-700)" strokeWidth="1" opacity="0.4" />

        {/* displaced shell fragments, blown outward from the breach */}
        <polygon points="52,26 76,20 70,38 50,42" fill="url(#logoPanelGrad)" stroke="var(--purple-400)" strokeWidth="1.3" filter="url(#logoGlowTight)" opacity="0.95" />
        <polygon points="52,26 76,20 70,38 50,42" fill="url(#logoPanelGrad)" stroke="var(--purple-300)" strokeWidth="0.8" />
        <polygon points="96,46 114,52 104,74 90,64" fill="url(#logoPanelGrad)" stroke="var(--purple-400)" strokeWidth="1.3" filter="url(#logoGlowTight)" opacity="0.95" />
        <polygon points="96,46 114,52 104,74 90,64" fill="url(#logoPanelGrad)" stroke="var(--purple-300)" strokeWidth="0.8" />
        <polygon points="46,88 66,98 54,112 38,100" fill="url(#logoPanelGrad)" stroke="var(--purple-400)" strokeWidth="1.3" filter="url(#logoGlowTight)" opacity="0.95" />
        <polygon points="46,88 66,98 54,112 38,100" fill="url(#logoPanelGrad)" stroke="var(--purple-300)" strokeWidth="0.8" />

        {/* the jagged breach torn through the panel */}
        <polygon
          points="58,42 78,38 92,52 86,72 96,88 74,96 56,86 48,64"
          fill="var(--bg-0)"
        />
        <polygon
          points="58,42 78,38 92,52 86,72 96,88 74,96 56,86 48,64"
          fill="url(#logoVoidGlow)"
          filter="url(#logoGlowWide)"
        />
        <polygon
          points="58,42 78,38 92,52 86,72 96,88 74,96 56,86 48,64"
          fill="none"
          stroke="var(--purple-300)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          filter="url(#logoGlowTight)"
        />

        {/* the rune-R, erupting through the breach — glow pass */}
        <path
          d="M 66 38 L 66 100 M 66 38 L 90 38 L 100 52 L 90 66 L 66 66 M 66 66 L 98 100"
          fill="none"
          stroke="var(--purple-400)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
          filter="url(#logoGlowWide)"
        />
        {/* rune-R core strokes, sharp and bright */}
        <path
          d="M 66 38 L 66 100 M 66 38 L 90 38 L 100 52 L 90 66 L 66 66 M 66 66 L 98 100"
          fill="none"
          stroke="url(#logoRuneGrad)"
          strokeWidth="4.2"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && <span className="logo__wordmark">AwaitingRune</span>}
    </div>
  )
}

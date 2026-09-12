import './Logo.css'

// A compact, recognizable PC tower — front face (mesh + LED strip) and a
// larger side panel — with a bold, bevelled rune-R physically bursting
// through the side panel from inside. Cracks radiate outward from the
// breach across the panel, with a few debris fragments knocked loose.
// The R's own bulk is built from four stacked strokes (dark offset shadow,
// blurred glow, bright body, thin lit edge) to fake a 3D emblem in flat SVG.
const VIEW = 160
const RUNE_PATH = 'M 76 34 L 76 145 M 76 34 L 118 34 L 132 56 L 118 78 L 76 78 M 76 78 L 148 145'

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
          <linearGradient id="logoFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--bg-1)" />
            <stop offset="100%" stopColor="var(--bg-0)" />
          </linearGradient>
          <radialGradient id="logoAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--purple-600)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--purple-600)" stopOpacity="0" />
          </radialGradient>
          <filter id="logoGlowTight" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
          <filter id="logoGlowWide" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
          <filter id="logoGlowAmbient" x="-140%" y="-140%" width="380%" height="380%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>

        <circle cx="90" cy="85" r="68" fill="url(#logoAmbient)" filter="url(#logoGlowAmbient)" />

        {/* case feet */}
        <g fill="var(--bg-1)" stroke="var(--purple-700)" strokeWidth="1">
          <polygon points="30,156 42,156 39,163 27,163" />
          <polygon points="66,156 78,156 76,163 64,163" />
          <polygon points="112,156 124,156 122,163 110,163" />
        </g>

        {/* front face: mesh intake + LED strip */}
        <polygon points="18,28 38,20 38,156 18,164" fill="url(#logoFrontGrad)" stroke="var(--purple-700)" strokeWidth="1.4" />
        <g stroke="var(--purple-700)" strokeWidth="1" opacity="0.6">
          <line x1="24" y1="34" x2="24" y2="150" />
          <line x1="28" y1="32" x2="28" y2="152" />
          <line x1="32" y1="30" x2="32" y2="154" />
        </g>
        <line x1="20.5" y1="30" x2="20.5" y2="160" stroke="var(--purple-300)" strokeWidth="2.2" filter="url(#logoGlowWide)" opacity="0.9" />
        <line x1="20.5" y1="30" x2="20.5" y2="160" stroke="var(--purple-100)" strokeWidth="1" />

        {/* top lip */}
        <polygon points="18,28 38,20 120,10 98,18" fill="var(--bg-2)" stroke="var(--purple-700)" strokeWidth="1.2" />

        {/* side panel — the surface the rune bursts through */}
        <polygon points="38,20 120,10 146,150 38,156" fill="url(#logoPanelGrad)" stroke="var(--purple-700)" strokeWidth="1.6" />

        {/* debris knocked loose from the impact */}
        {[
          'M 62 18 L 78 12 L 74 26 L 60 30 Z',
          'M 104 12 L 120 10 L 118 24 L 102 24 Z',
          'M 132 30 L 144 24 L 142 42 L 130 44 Z',
          'M 44 118 L 58 112 L 56 128 L 42 132 Z',
          'M 136 118 L 148 124 L 142 138 L 130 134 Z',
        ].map((d) => (
          <g key={d}>
            <path d={d} fill="url(#logoPanelGrad)" stroke="var(--purple-400)" strokeWidth="1.2" filter="url(#logoGlowTight)" />
            <path d={d} fill="url(#logoPanelGrad)" stroke="var(--purple-300)" strokeWidth="0.7" />
          </g>
        ))}

        {/* cracks radiating outward from the breach */}
        {[
          'M 74 40 L 62 30 L 68 20 L 56 10',
          'M 104 34 L 100 20 L 110 10',
          'M 128 48 L 138 36 L 132 22',
          'M 72 88 L 56 94 L 60 110 L 46 118',
          'M 100 128 L 94 140 L 102 152',
          'M 138 108 L 148 116 L 140 130',
        ].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--purple-400)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" filter="url(#logoGlowWide)" />
            <path d={d} fill="none" stroke="var(--purple-200)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* the rune-R, forced through the panel — shadow / glow / body */}
        <path d={RUNE_PATH} fill="none" stroke="var(--bg-0)" strokeWidth="26" strokeLinejoin="miter" strokeLinecap="square" transform="translate(3, 4)" />
        <path d={RUNE_PATH} fill="none" stroke="var(--purple-400)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" filter="url(#logoGlowWide)" />
        <path d={RUNE_PATH} fill="none" stroke="url(#logoRuneGrad)" strokeWidth="17" strokeLinejoin="miter" strokeLinecap="square" />
      </svg>
      {showWordmark && <span className="logo__wordmark">AwaitingRune</span>}
    </div>
  )
}

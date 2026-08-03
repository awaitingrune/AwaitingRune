import './PCTower.css'

const FAN_COUNT_BY_TIER = {
  starter: 1,
  performance: 2,
  elite: 3,
  creator: 2,
  'studio-pro': 3,
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

export default function PCTower({ tier = 'starter', className = '' }) {
  const fans = FAN_COUNT_BY_TIER[tier] ?? 1
  const gradId = `pcGlow-${tier}`

  return (
    <svg
      className={`pc-tower ${className}`}
      viewBox="0 0 240 300"
      role="img"
      aria-label={`Illustration of a ${tier} PC build`}
    >
      <defs>
        <linearGradient id={`case-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--bg-3)" />
          <stop offset="100%" stopColor="var(--bg-1)" />
        </linearGradient>
        <radialGradient id={gradId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--purple-200)" />
          <stop offset="100%" stopColor="var(--purple-600)" />
        </radialGradient>
        <linearGradient id={`glass-${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--purple-400)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--purple-700)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect x="18" y="10" width="204" height="280" rx="16" fill={`url(#case-${tier})`} stroke="var(--border-strong)" />

      <rect x="18" y="10" width="204" height="18" rx="9" fill="var(--bg-0)" opacity="0.5" />
      <circle cx="204" cy="19" r="3.5" fill="var(--purple-300)" />

      <rect x="34" y="40" width="172" height="234" rx="10" fill={`url(#glass-${tier})`} stroke="var(--border)" />

      <rect x="48" y="56" width="92" height="120" rx="5" fill="var(--bg-1)" stroke="var(--border)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={58 + i * 14} y={64} width="7" height="46" rx="2" fill="var(--purple-500)" opacity="0.8" />
      ))}
      <rect x="58" y="120" width="70" height="8" rx="2" fill="var(--purple-700)" opacity="0.7" />
      <rect x="58" y="134" width="50" height="8" rx="2" fill="var(--purple-700)" opacity="0.5" />

      <rect x="48" y="188" width="144" height="40" rx="7" fill="var(--bg-1)" stroke="var(--purple-400)" strokeWidth="1.5" />
      {Array.from({ length: fans }).map((_, i) => {
        const spacing = 144 / (fans + 1)
        return <Fan key={i} cx={48 + spacing * (i + 1)} cy={208} r={15} gradId={gradId} />
      })}

      <rect x="150" y="56" width="42" height="120" rx="5" fill="var(--bg-1)" stroke="var(--border)" />
      <Fan cx={171} cy={82} r={13} gradId={gradId} />
      <Fan cx={171} cy={116} r={13} gradId={gradId} />
      <Fan cx={171} cy={150} r={13} gradId={gradId} />

      <rect x="34" y="270" width="172" height="4" rx="2" fill="var(--purple-500)" opacity="0.6" />
    </svg>
  )
}

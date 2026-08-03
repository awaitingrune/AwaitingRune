let uid = 0

export default function Vine({ flip = false, className = '' }) {
  const gradId = `vineGrad-${++uid}`

  return (
    <svg
      className={`vine ${className}`}
      viewBox="0 0 100 44"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--purple-400)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--purple-300)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M2 22 C 18 8, 26 36, 42 22 C 56 10, 64 34, 80 20 C 88 16, 92 18, 98 15"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 13 C 12 5, 4 5, 2 11 C 6 15, 13 15, 16 13 Z"
        fill="var(--purple-400)"
        opacity="0.6"
      />
      <path
        d="M48 30 C 46 40, 54 44, 60 40 C 58 34, 52 30, 48 30 Z"
        fill="var(--purple-400)"
        opacity="0.45"
      />
      <path
        d="M76 11 C 78 4, 86 3, 90 8 C 86 13, 78 13, 76 11 Z"
        fill="var(--purple-300)"
        opacity="0.3"
      />
    </svg>
  )
}

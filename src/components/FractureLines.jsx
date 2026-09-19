import { useId } from 'react'

const TRUNKS = [
  'M 600 300 L 548 284 L 506 312 L 440 288 L 392 318 L 318 298 L 262 330 L 178 302 L 120 334 L 40 316',
  'M 600 176 L 556 158 L 528 190 L 470 160 L 430 196 L 366 176 L 322 210',
  'M 600 428 L 558 452 L 516 428 L 470 468 L 420 446 L 372 486 L 318 462',
]

const BRANCHES = [
  'M 506 312 L 490 254 L 456 232 L 462 176 L 424 136 L 428 76',
  'M 440 288 L 420 350 L 448 394 L 412 452 L 424 522',
  'M 318 298 L 302 236 L 334 196 L 314 138 L 338 70',
  'M 262 330 L 244 402 L 276 442 L 250 502 L 266 578',
  'M 178 302 L 166 246 L 192 206 L 176 156',
  'M 120 334 L 114 398 L 142 430',
  'M 456 232 L 404 220 L 384 182',
  'M 412 452 L 366 474 L 346 526',
  'M 528 190 L 520 130 L 552 94',
  'M 516 428 L 524 490 L 496 540',
  'M 322 210 L 270 194 L 246 148',
  'M 318 462 L 296 520 L 322 570',
]

const SHARDS = [
  '470,196 488,188 484,206 468,210',
  '372,352 388,346 386,364 370,368',
  '262,214 280,208 276,224 260,228',
  '330,420 346,414 344,432 328,436',
  '196,268 210,262 208,278 194,282',
]

export default function FractureLines({ className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const glowId = `${uid}-glow`
  const trunksId = `${uid}-trunks`
  const branchesId = `${uid}-branches`

  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <g id={trunksId}>
          {TRUNKS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g id={branchesId}>
          {BRANCHES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </defs>

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <use href={`#${trunksId}`} stroke="var(--purple-400)" strokeWidth="6" opacity="0.7" filter={`url(#${glowId})`} />
        <use href={`#${branchesId}`} stroke="var(--purple-400)" strokeWidth="4" opacity="0.55" filter={`url(#${glowId})`} />
        <use href={`#${trunksId}`} stroke="var(--purple-200)" strokeWidth="1.6" />
        <use href={`#${branchesId}`} stroke="var(--purple-300)" strokeWidth="1" />
      </g>

      {SHARDS.map((points) => (
        <polygon key={points} points={points} fill="var(--bg-1)" stroke="var(--purple-400)" strokeWidth="1" opacity="0.9" />
      ))}
    </svg>
  )
}

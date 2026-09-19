// Elder Futhark runes drawn as straight strokes, so they render identically
// on every device instead of depending on a runic font being installed.
const RUNES = {
  fehu: 'M8 3 V21 M8 8 L17 3 M8 13 L17 8',
  uruz: 'M7 3 V21 M7 3 L17 11 V21',
  ansuz: 'M8 3 V21 M8 4 L17 9 M8 10 L17 15',
  kenaz: 'M17 5 L8 12 L17 19',
  tiwaz: 'M12 3 V21 M6 9 L12 3 L18 9',
  sowilo: 'M15 3 L9 10 L15 14 L9 21',
}

export const RUNE_KEYS = Object.keys(RUNES)

export default function RuneGlyph({ name, size = 24, className = '' }) {
  const d = RUNES[name]
  if (!d) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}

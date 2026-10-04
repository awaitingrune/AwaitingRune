import './ImageDisclaimer.css'

export const IMAGE_DISCLAIMER =
  'Some of the images on this site are AI interpretations of the finished builds. Treat them as a point of reference, not the exact final product. Real photos are coming soon.'

export default function ImageDisclaimer({ className = '' }) {
  return (
    <p className={`image-note ${className}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>
      <span>{IMAGE_DISCLAIMER}</span>
    </p>
  )
}

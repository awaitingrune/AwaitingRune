import { Link } from 'react-router-dom'
import './TrustStrip.css'

function Icon({ children }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// A slim band above the footer that keeps the two things buyers look for
// (warranty and returns) one click away on every page.
export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Warranty and returns">
      <div className="container trust-strip__inner">
        <Link to="/support#warranty" className="trust-strip__item">
          <Icon>
            <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </Icon>
          <span>
            <strong>12 month warranty</strong>
            <small>Parts and labour covered. Extend to 3 years when you order</small>
          </span>
        </Link>
        <Link to="/support#returns" className="trust-strip__item">
          <Icon>
            <path d="M4 8h11a5 5 0 0 1 0 10H8" />
            <path d="M8 4L4 8l4 4" />
          </Icon>
          <span>
            <strong>Returns &amp; cancellations</strong>
            <small>Full refund if you cancel before we start building</small>
          </span>
        </Link>
        <Link to="/support" className="trust-strip__more">
          Details &rarr;
        </Link>
      </div>
    </section>
  )
}

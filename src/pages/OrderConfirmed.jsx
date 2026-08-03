import { Link } from 'react-router-dom'
import './OrderConfirmed.css'

export default function OrderConfirmed() {
  const sessionId = new URLSearchParams(window.location.search).get('session_id')

  return (
    <div className="order-confirmed container">
      <div className="card order-confirmed__panel">
        <span className="eyebrow">Order received</span>
        <h1>Thanks — your build is on its way.</h1>
        <p>
          Payment went through and we've got your order. We'll be in touch by email to confirm build details and
          shipping.
        </p>
        {sessionId && (
          <p className="order-confirmed__ref">
            Reference: <code>{sessionId}</code>
          </p>
        )}
        <div className="order-confirmed__actions">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/prebuilts" className="btn">
            Browse More Rigs
          </Link>
        </div>
      </div>
    </div>
  )
}

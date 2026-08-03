import Logo from './Logo.jsx'
import Vine from './Vine.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__wordmark-row">
          <Vine flip />
          <div className="footer__mark-wrap">
            <Logo size={100} className="footer__mark" />
            <span className="footer__wordmark">AwaitingRune</span>
          </div>
          <Vine />
        </div>
        <p className="footer__copy">&copy; {new Date().getFullYear()} AwaitingRune</p>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Vine from './Vine.jsx'
import { CONTACT, SOCIALS } from '../data/site.js'
import { useQuiz } from './QuizProvider.jsx'
import './Footer.css'

const ICON_PATHS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.6 2 4.4 5 4.6" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
  discord: (
    <path d="M8 8.5c2.6-1 5.4-1 8 0 1.6 2.6 2.4 5.2 2.5 8-1.2.9-2.4 1.4-3.6 1.6l-.9-1.6M8 8.5C6.4 11.1 5.6 13.7 5.5 16.5c1.2.9 2.4 1.4 3.6 1.6l.9-1.6M9.5 13h.01M14.5 13h.01" />
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  phone: <path d="M6.5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z" />,
}

function SocialIcon({ name }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

const SHOP_LINKS = [
  { to: '/prebuilts', label: 'Prebuilt PCs' },
  { to: '/custom-build', label: 'Custom Builder' },
]

const SUPPORT_LINKS = [
  { to: '/support#delivery', label: 'Delivery' },
  { to: '/support#warranty', label: 'Warranty' },
  { to: '/support#returns', label: 'Returns' },
  { to: '/about', label: 'About & Contact' },
]

export default function Footer() {
  const socials = SOCIALS.filter((s) => s.url)
  const { openQuiz } = useQuiz()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__about">
            <span className="footer__heading">AwaitingRune</span>
            <p>Custom PCs built by someone who genuinely loves building them. Made to order in the UK.</p>
            <ul className="footer__social" aria-label="Contact and social links">
              <li>
                <a href={`mailto:${CONTACT.email}`} aria-label="Email us" title="Email">
                  <SocialIcon name="email" />
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} aria-label="Call us" title="Call">
                  <SocialIcon name="phone" />
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__col" aria-label="Shop">
            <span className="footer__heading">Shop</span>
            <ul>
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
              <li>
                <button type="button" className="footer__linkbtn" onClick={openQuiz}>
                  Find Your PC
                </button>
              </li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Support">
            <span className="footer__heading">Support</span>
            <ul>
              {SUPPORT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <span className="footer__heading">Get in touch</span>
            <ul>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
              <li className="footer__muted">Open {CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        <div className="footer__wordmark-row">
          <Vine flip />
          <div className="footer__mark-wrap">
            <Logo size={100} className="footer__mark" />
            <span className="footer__wordmark">AwaitingRune</span>
          </div>
          <Vine />
        </div>

        <div className="footer__base">
          <span>Secure payments by Stripe</span>
          <span>&copy; {new Date().getFullYear()} AwaitingRune</span>
        </div>
      </div>
    </footer>
  )
}

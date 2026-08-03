import { useState } from 'react'
import './About.css'

const INITIAL_FORM = { name: '', email: '', message: '' }

function encodeForm(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export default function About() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm({ 'form-name': 'contact', ...form }),
      })
    } catch {
      // Only succeeds once deployed on Netlify — safe to ignore locally.
    }
    setSubmitted(true)
    setForm(INITIAL_FORM)
  }

  return (
    <div className="about container">
      <section className="about__intro">
        <span className="eyebrow">About AwaitingRune</span>
        <h1>Builds cut clean, every time</h1>
        <p>
          I love PCs, and I've been building them for a long time — long enough to know exactly
          how it feels when a part list almost works, or when a "compatible" build turns out not
          to be. AwaitingRune grew out of that: a shop built by someone who builds rigs for fun,
          not just for a living.
        </p>
        <p>
          Every rig I build — custom or prebuilt — goes through the same checks the online
          configurator runs live, so sockets match, wattage has headroom, and nothing gets bolted
          together that was never meant to fit. I keep the catalog small and the parts well
          matched instead of drowning you in spec sheets. Tell me what you need the machine to
          do, and I'll help you land on a build that actually does it.
        </p>
      </section>

      <div className="about__grid">
        <section className="card about__panel">
          <h2>Get in touch</h2>
          <p>Questions about a build, a part, or an order — reach out and I'll get back to you.</p>
          <ul className="about__contact-list">
            <li>
              <span>Email</span>
              <span>
                <a href="mailto:awaitingrune@gmail.com">awaitingrune@gmail.com</a>
              </span>
            </li>
            <li>
              <span>Phone</span>
              <span>
                <a href="tel:+447936345498">07936 345498</a>
              </span>
            </li>
            <li>
              <span>Hours</span>
              <span>24/7</span>
            </li>
          </ul>
        </section>

        <section className="card about__panel">
          <h2>Business inquiries</h2>
          {submitted && (
            <div className="about__success">Thanks — your message was sent. I'll follow up by email.</div>
          )}
          <form
            className="about__form"
            name="contact"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="visually-hidden">
              <label>
                Don't fill this out: <input name="bot-field" tabIndex="-1" autoComplete="off" />
              </label>
            </p>
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} value={form.message} onChange={handleChange} required />
            </label>
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
            <p className="about__form-note">
              Wired to Netlify Forms — goes live once this site is deployed on Netlify.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

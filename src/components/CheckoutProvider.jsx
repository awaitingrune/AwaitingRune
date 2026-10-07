import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { UPSELL } from '../data/extras.js'
import { startCheckout } from '../utils/checkout.js'
import { formatPrice } from '../utils/format.js'
import './CheckoutProvider.css'

const CheckoutContext = createContext({ checkout: async () => {} })

export function useCheckout() {
  return useContext(CheckoutContext)
}

// Every "buy" button on the site goes through here. It shows a small offer
// ("don't miss out") and then sends the customer to Stripe.
//
//   checkout({ selections, buildName, cancelPath, extras: { os, warranty }, total })
//
// The returned promise rejects with { cancelled: true } if the customer closes
// the offer, so the button that started it can go back to normal.
export default function CheckoutProvider({ children }) {
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const primaryRef = useRef(null)

  const checkout = useCallback(
    (payload) => new Promise((resolve, reject) => setPending({ payload, resolve, reject })),
    []
  )

  const cancel = useCallback(() => {
    setPending((current) => {
      current?.reject(Object.assign(new Error('Checkout cancelled'), { cancelled: true }))
      return null
    })
    setBusy(false)
  }, [])

  async function proceed(withOffer) {
    if (!pending || busy) return
    setBusy(true)
    try {
      await startCheckout({
        ...pending.payload,
        extras: { ...pending.payload.extras, upsell: withOffer },
      })
      pending.resolve()
    } catch (err) {
      pending.reject(err)
      setPending(null)
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!pending) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      // Keep Escape from also closing the customiser sitting behind the offer.
      e.stopImmediatePropagation()
      if (!busy) cancel()
    }
    // Coming back with the browser's back button must not leave the offer open.
    const onShow = (e) => e.persisted && cancel()
    document.addEventListener('keydown', onKey, true)
    window.addEventListener('pageshow', onShow)
    document.body.style.overflow = 'hidden'
    primaryRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey, true)
      window.removeEventListener('pageshow', onShow)
      document.body.style.overflow = ''
    }
  }, [pending, busy, cancel])

  const value = useMemo(() => ({ checkout }), [checkout])
  const total = pending?.payload.total

  return (
    <CheckoutContext.Provider value={value}>
      {children}

      {pending && (
        <div className="upsell" role="dialog" aria-modal="true" aria-label="Before you check out" onClick={() => !busy && cancel()}>
          <div className="upsell__card card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="upsell__close" aria-label="Close" disabled={busy} onClick={cancel}>
              &times;
            </button>

            <span className="upsell__badge">Don&rsquo;t miss out</span>
            <h3>{UPSELL.discount * 100}% off a 1TB extra drive</h3>
            <p>
              Add a {UPSELL.product} to your order. A second fast drive for games, projects or backups, fitted and
              tested with your PC.
            </p>

            <div className="upsell__price">
              <strong>{formatPrice(UPSELL.price)}</strong>
              <s>{formatPrice(UPSELL.fullPrice)}</s>
              <span>Save {formatPrice(UPSELL.fullPrice - UPSELL.price)}</span>
            </div>
            {typeof total === 'number' && (
              <p className="upsell__total">
                Your total: {formatPrice(total)} <span>&rarr;</span> {formatPrice(total + UPSELL.price)} with the drive
              </p>
            )}

            <div className="upsell__actions">
              <button ref={primaryRef} type="button" className="btn btn-primary" disabled={busy} onClick={() => proceed(true)}>
                {busy ? 'Opening checkout…' : `Add it · ${formatPrice(UPSELL.price)}`}
              </button>
              <button type="button" className="upsell__skip" disabled={busy} onClick={() => proceed(false)}>
                No thanks, continue to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </CheckoutContext.Provider>
  )
}

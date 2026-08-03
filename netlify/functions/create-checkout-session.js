import Stripe from 'stripe'
import { CATEGORIES, findPart } from '../../shared/parts.js'
import { evaluateBuild } from '../../shared/compatibility.js'

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return jsonResponse(500, { error: 'Payments are not configured yet.' })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse(400, { error: 'Invalid request body.' })
  }

  const { selections, buildName, cancelPath } = payload ?? {}

  if (!selections || typeof selections !== 'object') {
    return jsonResponse(400, { error: 'Missing part selections.' })
  }

  // Resolve every category against the real catalog server-side — never
  // trust a price the client sends. Any unrecognized/missing part id fails.
  const build = {}
  for (const cat of CATEGORIES) {
    const part = findPart(cat.key, selections[cat.key])
    if (!part) {
      return jsonResponse(400, { error: `Missing or invalid selection for ${cat.label}.` })
    }
    build[cat.key] = part
  }

  const evaluation = evaluateBuild(build)
  if (!evaluation.isCompatible) {
    return jsonResponse(400, {
      error: 'This build has compatibility issues and cannot be checked out.',
      issues: evaluation.issues,
    })
  }

  const siteUrl = process.env.URL || new URL(req.url).origin
  const safeCancelPath = typeof cancelPath === 'string' && cancelPath.startsWith('/') ? cancelPath : '/custom-build'

  const stripe = new Stripe(stripeSecretKey)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: CATEGORIES.map((cat) => {
        const part = build[cat.key]
        return {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(part.price * 100),
            product_data: {
              name: part.name,
              description: cat.label,
            },
          },
        }
      }),
      success_url: `${siteUrl}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${safeCancelPath}`,
      metadata: {
        buildName: typeof buildName === 'string' ? buildName.slice(0, 200) : 'Custom Build',
        selections: JSON.stringify(selections).slice(0, 450),
      },
    })

    return jsonResponse(200, { url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    return jsonResponse(500, { error: 'Could not start checkout. Please try again.' })
  }
}

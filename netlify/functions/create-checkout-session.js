import Stripe from 'stripe'
import { CATEGORIES, LABOUR, findPart } from '../../shared/parts.js'
import { evaluateBuild } from '../../shared/compatibility.js'
import { UPSELL, priceExtras } from '../../shared/extras.js'

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

  // Optional extras (Windows, extended warranty, the storage offer). They are
  // priced here from the shared tables, never from anything the browser sends.
  const requested = payload?.extras ?? {}
  const extras = priceExtras({
    buildTotal: evaluation.subtotal,
    osId: requested.os ?? 'os-none',
    warrantyId: requested.warranty ?? 'war-std',
    upsell: requested.upsell === true,
  })
  if (!extras) {
    return jsonResponse(400, { error: 'Invalid operating system or warranty option.' })
  }

  const extraLines = []
  if (extras.osPrice > 0) {
    extraLines.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(extras.osPrice * 100),
        product_data: { name: `${extras.os.name} (installed and activated)`, description: 'Operating system' },
      },
    })
  }
  if (extras.warrantyPrice > 0) {
    extraLines.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(extras.warrantyPrice * 100),
        product_data: {
          name: `Extended warranty: ${extras.warranty.years} years in total`,
          description: `Adds ${extras.warranty.extraYears} year${extras.warranty.extraYears > 1 ? 's' : ''} to the standard 12 month warranty`,
        },
      },
    })
  }
  if (extras.upsellPrice > 0) {
    extraLines.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(extras.upsellPrice * 100),
        product_data: {
          name: `${UPSELL.name} (${UPSELL.product})`,
          description: `${UPSELL.discount * 100}% off checkout offer`,
        },
      },
    })
  }

  const siteUrl = process.env.URL || new URL(req.url).origin
  const safeCancelPath = typeof cancelPath === 'string' && cancelPath.startsWith('/') ? cancelPath : '/custom-build'

  const stripe = new Stripe(stripeSecretKey)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        ...CATEGORIES.map((cat) => {
          const part = build[cat.key]
          return {
            quantity: 1,
            price_data: {
              currency: 'gbp',
              unit_amount: Math.round(part.price * 100),
              product_data: {
                name: part.name,
                description: cat.label,
              },
            },
          }
        }),
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(LABOUR.price * 100),
            product_data: {
              name: LABOUR.name,
              description: LABOUR.includes.join(', '),
            },
          },
        },
        ...extraLines,
      ],
      shipping_address_collection: { allowed_countries: ['GB'] },
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${safeCancelPath}`,
      metadata: {
        buildName: typeof buildName === 'string' ? buildName.slice(0, 200) : 'Custom Build',
        selections: JSON.stringify(selections).slice(0, 450),
        os: extras.os.id,
        warranty: extras.warranty.id,
        extraStorage: extras.upsellPrice > 0 ? 'yes' : 'no',
      },
    })

    return jsonResponse(200, { url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    return jsonResponse(500, { error: 'Could not start checkout. Please try again.' })
  }
}

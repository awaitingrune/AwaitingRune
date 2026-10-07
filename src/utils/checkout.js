// Creates a Stripe Checkout session on the server and sends the browser to it.
// `extras` is { os, warranty, upsell }; the server prices them itself.
export async function startCheckout({ selections, buildName, cancelPath, extras }) {
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selections, buildName, cancelPath, extras }),
  })

  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok || !data?.url) {
    throw new Error(data?.error || 'Checkout failed. Please try again.')
  }

  window.location.href = data.url
}

export async function startCheckout({ selections, buildName, cancelPath }) {
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selections, buildName, cancelPath }),
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

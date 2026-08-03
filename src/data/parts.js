// Re-exports the shared catalog so both the frontend and the Netlify
// Function (netlify/functions/create-checkout-session.js) use one source
// of truth for part names, specs, and prices.
export * from '../../shared/parts.js'

// Re-exports the shared compatibility engine so the frontend and the
// Netlify Function (netlify/functions/create-checkout-session.js) run the
// exact same checks — a build that's rejected server-side never should
// have passed client-side either.
export * from '../../shared/compatibility.js'

import { useEffect } from 'react'

function setTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Gives each page its own browser-tab title and search-result description
// (and the matching link-preview text). Set `noindex` for pages that should
// not appear in Google, like an order confirmation.
export default function usePageMeta({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title
    setTag('name', 'description', description)
    setTag('property', 'og:title', title)
    setTag('property', 'og:description', description)
    setTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noindex])
}

/** Runtime SEO helpers for client-side routed pages. */

interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  /** JSON-LD object injected as a script tag (replaced per page) */
  jsonLd?: Record<string, unknown>
}

const JSONLD_ID = 'page-jsonld'

export function setPageMeta({ title, description, keywords, jsonLd }: PageMeta) {
  document.title = title

  const ensure = (selector: string, create: () => HTMLElement) => {
    let el = document.head.querySelector(selector)
    if (!el) {
      el = create()
      document.head.appendChild(el)
    }
    return el as HTMLMetaElement
  }

  ensure('meta[name="description"]', () => {
    const m = document.createElement('meta')
    m.name = 'description'
    return m
  }).content = description

  if (keywords?.length) {
    ensure('meta[name="keywords"]', () => {
      const m = document.createElement('meta')
      m.name = 'keywords'
      return m
    }).content = keywords.join(', ')
  }

  const og = document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
  if (og) og.content = title
  const ogDesc = document.head.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
  if (ogDesc) ogDesc.content = description

  document.getElementById(JSONLD_ID)?.remove()
  if (jsonLd) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = JSONLD_ID
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
  }
}

import { onMounted, watch, type Ref } from 'vue'

const SITE_NAME = 'ClearanceGate'
const SITE_URL = 'https://clearance-gate.com'
const DEFAULT_IMAGE = `${SITE_URL}/vite.svg`

type SeoInput = {
  title: Ref<string> | string
  description: Ref<string> | string
  path?: Ref<string> | string
  type?: Ref<'website' | 'article'> | 'website' | 'article'
}

function asValue<T>(value: Ref<T> | T): T {
  if (typeof value === 'object' && value && 'value' in value) {
    return value.value as T
  }
  return value as T
}

function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

export function useSeo(input: SeoInput) {
  const apply = () => {
    const title = asValue(input.title)
    const description = asValue(input.description)
    const path = input.path ? asValue(input.path) : '/'
    const type = input.type ? asValue(input.type) : 'website'
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const canonicalUrl = `${SITE_URL}${normalizedPath}`
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

    document.title = fullTitle
    upsertCanonical(canonicalUrl)

    upsertMetaByName('description', description)
    upsertMetaByName('robots', 'index, follow')
    upsertMetaByName('twitter:card', 'summary')
    upsertMetaByName('twitter:title', fullTitle)
    upsertMetaByName('twitter:description', description)
    upsertMetaByName('twitter:image', DEFAULT_IMAGE)

    upsertMetaByProperty('og:type', type)
    upsertMetaByProperty('og:site_name', SITE_NAME)
    upsertMetaByProperty('og:title', fullTitle)
    upsertMetaByProperty('og:description', description)
    upsertMetaByProperty('og:url', canonicalUrl)
    upsertMetaByProperty('og:image', DEFAULT_IMAGE)
  }

  onMounted(() => {
    apply()
    watch(
      () => [asValue(input.title), asValue(input.description), input.path ? asValue(input.path) : '/'],
      () => apply(),
    )
  })
}


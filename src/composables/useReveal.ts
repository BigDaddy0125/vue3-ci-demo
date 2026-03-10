import { onBeforeUnmount, onMounted } from 'vue'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
}

export function useReveal(selector = '.reveal', options: RevealOptions = {}) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!nodes.length) {
      return
    }

    const root = document.documentElement
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      root.classList.remove('reveal-enabled')
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      root.classList.remove('reveal-enabled')
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    root.classList.add('reveal-enabled')

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.16,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    nodes.forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    document.documentElement.classList.remove('reveal-enabled')
  })
}

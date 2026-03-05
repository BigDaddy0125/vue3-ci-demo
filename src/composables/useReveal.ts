import { onBeforeUnmount, onMounted } from 'vue'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
}

export function useReveal(selector = '.reveal', options: RevealOptions = {}) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

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
  })
}

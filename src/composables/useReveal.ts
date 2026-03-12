import { onBeforeUnmount, onMounted } from 'vue'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
}

export function useReveal(selector = '.reveal', options: RevealOptions = {}) {
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  const visible = new WeakSet<Element>()

  const markVisible = (el: Element) => {
    el.classList.add('is-visible')
    visible.add(el)
  }

  const observeNodes = (nodes: HTMLElement[]) => {
    nodes.forEach((el) => {
      if (visible.has(el) || el.classList.contains('is-visible')) {
        return
      }
      observer?.observe(el)
    })
  }

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
      nodes.forEach((el) => markVisible(el))
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      root.classList.remove('reveal-enabled')
      nodes.forEach((el) => markVisible(el))
      return
    }

    root.classList.add('reveal-enabled')

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markVisible(entry.target)
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.16,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    observeNodes(nodes)

    mutationObserver = new MutationObserver(() => {
      const next = Array.from(document.querySelectorAll<HTMLElement>(selector))
      observeNodes(next)
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    mutationObserver?.disconnect()
    mutationObserver = null
    document.documentElement.classList.remove('reveal-enabled')
  })
}

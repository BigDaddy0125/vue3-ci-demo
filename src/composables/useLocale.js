import { ref } from 'vue'

const STORAGE_KEY = 'cg-locale'
const SUPPORTED = ['en', 'ja']

const resolveInitialLocale = () => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED.includes(saved)) {
    return saved
  }

  const browser = String(window.navigator.language || 'en').toLowerCase()
  return browser.startsWith('ja') ? 'ja' : 'en'
}

const locale = ref(resolveInitialLocale())

const setLocale = (nextLocale) => {
  if (!SUPPORTED.includes(nextLocale)) return
  locale.value = nextLocale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    document.documentElement.setAttribute('lang', nextLocale)
  }
}

if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('lang', locale.value)
}

export const useLocale = () => ({
  locale,
  setLocale,
  supportedLocales: SUPPORTED,
})

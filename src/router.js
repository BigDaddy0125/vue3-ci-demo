import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DocsPage from './pages/docs/DocsPage.vue'

const resolvePreferredLocale = () => {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem('cg-locale')
  if (saved === 'ja' || saved === 'en') return saved
  return String(window.navigator.language || '').toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: () => `/${resolvePreferredLocale()}` },
    { path: '/docs/:slug?', redirect: (to) => `/${resolvePreferredLocale()}/docs/${to.params.slug || ''}` },
    { path: '/:locale(en|ja)', name: 'home', component: Home },
    { path: '/:locale(en|ja)/docs/:slug?', name: 'doc', component: DocsPage },
  ],
})

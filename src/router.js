import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DocsPage from './pages/docs/DocsPage.vue'

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/docs/:slug?', name: 'doc', component: DocsPage },
  ],
})

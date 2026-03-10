import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DocsPage from './pages/docs/DocsPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/docs/:slug?', name: 'doc', component: DocsPage },
  ],
})

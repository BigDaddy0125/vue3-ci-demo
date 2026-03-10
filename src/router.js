import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DocsPage from './pages/docs/DocsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/docs/:slug?', name: 'doc', component: DocsPage },
  ],
})

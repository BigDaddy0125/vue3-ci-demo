import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Use relative asset paths so the site works on both custom domains and preview URLs.
export default defineConfig({
  base: './',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
  },
})

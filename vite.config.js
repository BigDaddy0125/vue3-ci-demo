import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
  const repository = process.env.GITHUB_REPOSITORY
  const repoName = repository ? repository.split('/')[1] : null
  const base = isGithubActions && repoName ? `/${repoName}/` : '/'

  return {
    base,
    plugins: [vue()],
    test: {
      environment: 'jsdom',
    },
  }
})

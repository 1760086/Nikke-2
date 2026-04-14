import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

/** GitHub Pages project site: https://user.github.io/repo-name/ → base must be /repo-name/ */
function normalizeBasePath(p: string): string {
  let b = p.trim()
  if (!b || b === '/') return '/'
  if (!b.startsWith('/')) b = `/${b}`
  if (!b.endsWith('/')) b += '/'
  return b
}

function resolveBase(): string {
  if (process.env.VITE_BASE_PATH) {
    return normalizeBasePath(process.env.VITE_BASE_PATH)
  }
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) {
    if (repo.endsWith('.github.io')) return '/'
    return `/${repo}/`
  }
  return '/'
}

// https://vitejs.dev/config/
// GitHub Pages: deploy folder `dist/`. Project sites need a non-root base (see resolveBase).
export default defineConfig({
  base: resolveBase(),
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // The below values point to local addresses: this is correct, because TTS models can be run locally.
  // This is still manually configurable from within the UI.
  server: {
    proxy: {
      '/alltalk': {
        target: 'http://127.0.0.1:7851',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/alltalk/, '')
      },
      '/gptsovits': {
        target: 'http://127.0.0.1:9880',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gptsovits/, '')
      },
      '/chatterbox': {
        target: 'http://127.0.0.1:4123',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatterbox/, '')
      }
    }
  }
})

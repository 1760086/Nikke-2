import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
// GitHub Pages: deploy the output of `npm run build` (folder `dist/`), not the repo root `index.html`.
// Project site at username.github.io/repo-name/ needs `base: '/repo-name/'` here (see Vite docs).
export default defineConfig({
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

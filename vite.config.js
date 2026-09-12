import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Split heavy vendors so no single chunk dominates the initial payload
// and long-term caching survives app-code changes.
function manualChunks(id) {
  if (!id.includes('node_modules')) return
  if (id.includes('gsap')) return 'gsap'
  if (id.includes('lenis')) return 'lenis'
  if (id.includes('/motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
  if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react'
  return 'vendor'
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
    chunkSizeWarningLimit: 600,
  },
})
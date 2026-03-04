import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
  build: {
    // Улучшаем отдачу статических файлов
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1000,
  },
  // Это важно для TON Connect
  define: {
    'process.env': {},
  },
})

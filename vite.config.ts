import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/login': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/logout': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/checkAuth': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})

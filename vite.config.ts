import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@/components': path.resolve(__dirname, './components'),
        '@/utils': path.resolve(__dirname, './utils'),
        '@/styles': path.resolve(__dirname, './styles')
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['lucide-react', 'framer-motion']
          }
        }
      }
    },
    server: {
      port: 3000,
      host: true
    },
    preview: {
      port: 3000,
      host: true
    }
  }
})

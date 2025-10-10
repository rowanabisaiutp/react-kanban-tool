import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0', // Permitir conexiones externas
    port: 5173,      // Puerto del contenedor
    watch: {
      usePolling: true, // Necesario para Docker en Windows
    },
  },

  build: {
    // Optimizaciones de producción
    target: 'esnext',
    minify: 'esbuild', // esbuild es más rápido y no requiere configuración compleja
    
    // Configuración de minificación
    cssMinify: true,
    
    // Configurar code splitting y chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar librerías grandes en chunks independientes
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'date-fns': ['date-fns'],
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'ui-libs': ['lucide-react', 'recharts'],
          'state': ['zustand'],
        },
        // Nombres de archivos optimizados para caché
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Configuración de chunks
    chunkSizeWarningLimit: 1000, // Advertir si un chunk es > 1000kb
    
    // Source maps solo en desarrollo
    sourcemap: false,
  },

  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'date-fns',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'lucide-react'
    ],
  },
})

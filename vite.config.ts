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
})

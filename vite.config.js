import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true    
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // เปลี่ยนเป็น URL ของ backend server ที่ถูกต้อง
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          
        }
      }
    }
  },
})
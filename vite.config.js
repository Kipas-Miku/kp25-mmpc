import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/kp25-mmpc/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: 'src/index.js'
        }
    },    
    server: {
        port: 8000,
  },
  optimizeDeps: {
    include: ['textalive-app-api'], 
  }

})
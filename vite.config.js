import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/kp25-mmpc/',
  build: {
      outDir: 'dist',
      emptyOutDir: true,
  },
  define: {
    // Expose API key to your application
    'import.meta.env.VITE_TEXTALIVE_API_TOKEN': JSON.stringify(process.env.VITE_TEXTALIVE_API_TOKEN),
  },    
  server: {
      port: 8000,
  },
  optimizeDeps: {
    include: ['textalive-app-api'], 
  }

})
import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/procon',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: 'src/index.js'
        }
    },    
    server: {
        port: 8000,
  }

})
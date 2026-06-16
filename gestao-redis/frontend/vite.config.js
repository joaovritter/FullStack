import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Encaminha as chamadas /api para o backend Express (porta 8080)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});

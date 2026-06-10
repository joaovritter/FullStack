import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Servidor de desenvolvimento do Vite na porta 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});

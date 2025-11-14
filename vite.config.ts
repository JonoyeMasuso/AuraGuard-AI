import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL FIX: Change base path to relative ('./') to resolve 404 errors for assets on Vercel.
  base: './',
});
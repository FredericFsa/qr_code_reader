import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/qr_code_reader/', // ✅ Ajoute cette ligne !
  plugins: [react()],
});

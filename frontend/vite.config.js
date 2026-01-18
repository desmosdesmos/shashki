import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

// Custom plugin to copy telegram.html after build
const copyTelegramHtmlPlugin = {
  name: 'copy-telegram-html',
  closeBundle() {
    copyFileSync(
      join(__dirname, 'telegram.html'),
      join(__dirname, 'dist', 'telegram.html')
    );
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyTelegramHtmlPlugin],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
  }
});
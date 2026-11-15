import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Plugin to ensure 404.html exists for GitHub Pages SPA routing
function githubPagesSpaPlugin() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const notFoundPath = path.join(distDir, '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log('✓ Generated 404.html for GitHub Pages SPA routing');
        }
      } catch (err) {
        console.warn('Could not generate 404.html:', err);
      }
    }
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/AstroHealth-AI/'),
  plugins: [react(), githubPagesSpaPlugin()],
  server: {
    port: 3000,
    open: true
  }
});

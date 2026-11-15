import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Plugin to ensure 404.html and static route entrypoints exist for GitHub Pages SPA routing
function githubPagesSpaPlugin() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          // 404.html
          fs.copyFileSync(indexPath, path.join(distDir, '404.html'));

          // auth/callback/index.html
          const authCbDir = path.join(distDir, 'auth', 'callback');
          fs.mkdirSync(authCbDir, { recursive: true });
          fs.copyFileSync(indexPath, path.join(authCbDir, 'index.html'));

          // dashboard/index.html
          const dashDir = path.join(distDir, 'dashboard');
          fs.mkdirSync(dashDir, { recursive: true });
          fs.copyFileSync(indexPath, path.join(dashDir, 'index.html'));

          // login/index.html
          const loginDir = path.join(distDir, 'login');
          fs.mkdirSync(loginDir, { recursive: true });
          fs.copyFileSync(indexPath, path.join(loginDir, 'index.html'));

          console.log('✓ Generated 404.html and route entrypoints (auth/callback, dashboard, login) for GitHub Pages');
        }
      } catch (err) {
        console.warn('Could not generate static route entrypoints:', err);
      }
    }
  };
}

export default defineConfig(({ command }) => ({
  // In development ('serve'), always use '/' so localhost:3000 works normally
  // In production build ('build'), use '/AstroHealth-AI/' for GitHub Pages unless VERCEL or custom VITE_BASE_PATH is provided
  base: command === 'serve' ? '/' : (process.env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/AstroHealth-AI/')),
  plugins: [react(), githubPagesSpaPlugin()],
  server: {
    port: 3000,
    open: true
  }
}));

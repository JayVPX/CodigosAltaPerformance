import { defineConfig } from 'vite';
import authMiddleware from './src/js/authMiddleware.js';

export default defineConfig({
  root: 'src',
  assetsInclude: '**/*.html',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 5173,
  },
  plugins: [
    {
      name: 'dev-auth-middleware',
      configureServer(server) {
        server.middlewares.use(authMiddleware);
      }
    },
  ],
});

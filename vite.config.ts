import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Plugin to serve assets during local dev server
function serveAssetsPlugin() {
  return {
    name: 'serve-assets',
    configureServer(server: any) {
      server.middlewares.use('/assets', (req: any, res: any, next: any) => {
        const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
        const filePath = path.join(process.cwd(), 'public', 'assets', decodedUrl);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeMap: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.json': 'application/json',
          };
          res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  base: './', // Relative base path for seamless GitHub Pages deployment
  plugins: [react(), serveAssetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = join(__dirname, 'dist');

// DEBUG: Log struktur folder
console.log('📁 Dist path:', distPath);
console.log('📁 Dist exists:', existsSync(distPath));

if (existsSync(distPath)) {
  console.log('📂 Dist contents:', readdirSync(distPath));
  
  const assetsPath = join(distPath, 'assets');
  if (existsSync(assetsPath)) {
    const assets = readdirSync(assetsPath);
    console.log('📂 Assets found:', assets.length, 'files');
    console.log('📂 Assets:', assets);
  } else {
    console.error('❌ Assets folder not found!');
  }
}

// Disable caching for debugging
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Serve static files dengan MIME types yang benar
app.use(express.static(distPath, {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    console.log('📄 Serving file:', filePath);
    
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// SPA fallback
app.use((req, res) => {
  console.log('⚠️  Fallback to index.html for:', req.url);
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
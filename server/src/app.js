import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from './routes/api.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    // The site embeds YouTube/Vimeo players and loads Google Fonts.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'media-src': ["'self'", 'blob:', 'https:'],
        'frame-src': ["'self'", 'https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://player.vimeo.com'],
        'connect-src': ["'self'", 'https:'],
        'worker-src': ["'self'", 'blob:'],
        'upgrade-insecure-requests': null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean).length
      ? (process.env.CLIENT_URL || '').split(',').map((s) => s.trim())
      : true,
  })
);
app.use(express.json({ limit: '50kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

app.use('/api', apiRoutes);
app.use('/api', notFound);

// Serve the built React app (single-service deployment).
if (fs.existsSync(clientDist)) {
  app.use(
    express.static(clientDist, {
      index: false,
      setHeaders(res, filePath) {
        if (/[\\/]assets[\\/]/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        else if (/\.(mp4|webm|jpg|jpeg|png|webp|svg)$/i.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=86400');
      },
    })
  );
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (req, res) =>
    res.json({ ok: true, message: 'API is running. Build the client (npm run build) to serve the website from here.' })
  );
}

app.use(errorHandler);

export default app;

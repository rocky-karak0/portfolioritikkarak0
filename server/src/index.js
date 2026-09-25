import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

const shutdown = (signal) => {
  console.log(`[server] ${signal} received — shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 8000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

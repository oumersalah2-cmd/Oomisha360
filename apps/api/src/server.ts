import { createApp } from './app';
import { config } from './config';
import { seedCropProtectionDatabase } from './lib/db';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🌱 GEBERE VISION AI API SERVER STARTED`);
  console.log(`📡 URL: http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`🩺 Health: http://localhost:${config.port}${config.apiPrefix}/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`=========================================`);

  // Ensure crop protection registry is seeded in PostgreSQL if empty
  seedCropProtectionDatabase().catch((err) => {
    console.error('[DATABASE] Background crop protection seed error:', err);
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

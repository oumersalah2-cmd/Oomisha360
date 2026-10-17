import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🌱 GEBERE VISION AI API SERVER STARTED`);
  console.log(`📡 URL: http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`🩺 Health: http://localhost:${config.port}${config.apiPrefix}/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`=========================================`);
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

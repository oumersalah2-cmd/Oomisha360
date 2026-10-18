import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, NotFoundError } from './middleware/errorHandler';

// Route modules
import { healthRouter } from './modules/health/health.router';
import { profilesRouter } from './modules/profiles/profiles.router';
import { farmsRouter } from './modules/farms/farms.router';
import { landRouter } from './modules/land/land.router';
import { expensesRouter } from './modules/expenses/expenses.router';
import { harvestsRouter } from './modules/harvests/harvests.router';
import { financeRouter } from './modules/finance/finance.router';
import { marketplaceRouter } from './modules/marketplace/marketplace.router';
import { cropHealthRouter } from './modules/crop-health/crop-health.router';
import { cropsRouter } from './modules/crops/crops.router';
import { locationsRouter } from './modules/locations/locations.router';
import { authRouter } from './modules/auth/auth.router';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not permitted by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Bot-Api-Key', 'X-Demo-User-Id'],
    })
  );

  // Structured HTTP Request Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  }

  // Rate Limiting (General API protection)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests created from this IP, please try again after 15 minutes.',
      },
    },
  });
  app.use('/api/', limiter);

  // Body Parsing (Supports high-resolution crop photos & leaf scans)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Root information route
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'Gebere Vision AI API',
      status: 'operational',
      documentation: `${config.apiPrefix}/health`,
      version: '1.0.0',
    });
  });

  // Mount API v1 router
  const v1Router = express.Router();
  v1Router.use('/health', healthRouter);
  v1Router.use('/auth', authRouter);
  v1Router.use('/profiles', profilesRouter);
  v1Router.use('/farms', farmsRouter);
  v1Router.use('/land', landRouter);
  v1Router.use('/expenses', expensesRouter);
  v1Router.use('/harvests', harvestsRouter);
  v1Router.use('/finance', financeRouter);
  v1Router.use('/marketplace', marketplaceRouter);
  v1Router.use('/crop-health', cropHealthRouter);
  v1Router.use('/crops', cropsRouter);
  v1Router.use('/locations', locationsRouter);

  app.use(config.apiPrefix, v1Router);

  // Catch-all 404 handler
  app.use((req: Request, res: Response, next) => {
    next(new NotFoundError(`Endpoint ${req.method} ${req.originalUrl} does not exist.`));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

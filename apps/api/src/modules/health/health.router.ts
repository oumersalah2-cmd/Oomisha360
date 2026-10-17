import { Router, Request, Response } from 'express';
import { isUsingPrisma, prisma } from '../../lib/db';
import { config } from '../../config';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'in-memory-active';
  let dbOk = true;

  if (isUsingPrisma && prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'postgresql-connected';
    } catch {
      dbStatus = 'postgresql-error';
      dbOk = false;
    }
  }

  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'healthy' : 'degraded',
    service: 'gebere-vision-api',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: {
      status: dbStatus,
      isPrisma: isUsingPrisma,
    },
  });
});

import { Router, Request, Response } from 'express';
import { isUsingPrisma, testDbConnection } from '../../lib/db';
import { config } from '../../config';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'in-memory-active';
  let dbOk = true;
  let dbError: string | undefined = undefined;
  let latencyMs: number | undefined = undefined;

  if (isUsingPrisma) {
    const testResult = await testDbConnection();
    if (testResult.connected) {
      dbStatus = 'postgresql-connected';
      dbOk = true;
      latencyMs = testResult.latencyMs;
    } else {
      dbStatus = 'postgresql-error';
      dbOk = false;
      dbError = testResult.error;
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
      ...(latencyMs !== undefined ? { latencyMs } : {}),
      ...(dbError ? { error: dbError } : {}),
    },
  });
});

import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, isSupabaseAuthConfigured } from '../../middleware/auth';
import { config } from '../../config';
import { prisma, isUsingPrisma, inMemoryStore, ensureUserProfile } from '../../lib/db';
import { BadRequestError } from '../../middleware/errorHandler';

export const authRouter = Router();

// GET /api/v1/auth/status - Reports current authentication subsystem status
authRouter.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      supabaseAuthConfigured: isSupabaseAuthConfigured,
      environment: config.nodeEnv,
      isProduction: config.isProduction,
      demoTokensAllowed: !config.isProduction,
    },
  });
});

// POST /api/v1/auth/claim-demo-data - Safely associates demo farm/plot records with a real account
authRouter.post('/claim-demo-data', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const realUserId = req.user!.id;
    const { demoUserId } = req.body;

    if (!demoUserId || typeof demoUserId !== 'string') {
      throw new BadRequestError('demoUserId string is required to transfer records.');
    }

    if (demoUserId === realUserId) {
      res.json({ success: true, message: 'Source and target account IDs are identical; no transfer needed.', transferredCount: 0 });
      return;
    }

    let transferredFarms = 0;
    let transferredPlots = 0;
    let transferredExpenses = 0;
    let transferredHarvests = 0;

    if (isUsingPrisma && prisma) {
      await ensureUserProfile(req.user!);

      const farmUpdate = await prisma.farm.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredFarms = farmUpdate.count;

      const plotUpdate = await prisma.landRecord.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredPlots = plotUpdate.count;

      const expenseUpdate = await prisma.expense.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredExpenses = expenseUpdate.count;

      const harvestUpdate = await prisma.harvest.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredHarvests = harvestUpdate.count;
    } else {
      // In-memory fallback transfer
      for (const [id, f] of inMemoryStore.farms.entries()) {
        if (f.userId === demoUserId) {
          f.userId = realUserId;
          transferredFarms++;
        }
      }
      for (const [id, p] of inMemoryStore.landRecords.entries()) {
        if (p.userId === demoUserId) {
          p.userId = realUserId;
          transferredPlots++;
        }
      }
      for (const [id, e] of inMemoryStore.expenses.entries()) {
        if (e.userId === demoUserId) {
          e.userId = realUserId;
          transferredExpenses++;
        }
      }
      for (const [id, h] of inMemoryStore.harvests.entries()) {
        if (h.userId === demoUserId) {
          h.userId = realUserId;
          transferredHarvests++;
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully transferred records from ${demoUserId} to ${realUserId}`,
      transferred: {
        farms: transferredFarms,
        plots: transferredPlots,
        expenses: transferredExpenses,
        harvests: transferredHarvests,
        total: transferredFarms + transferredPlots + transferredExpenses + transferredHarvests,
      },
    });
  } catch (err) {
    next(err);
  }
});

import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { HarvestCreateSchema, Harvest } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const harvestsRouter = Router();

// GET /api/v1/harvests
harvestsRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { farmId, season } = req.query;

    if (isUsingPrisma && prisma) {
      const harvests = await prisma.harvest.findMany({
        where: {
          userId,
          ...(farmId ? { farmId: String(farmId) } : {}),
          ...(season ? { season: String(season) } : {}),
        },
        orderBy: { harvestDate: 'desc' },
      });
      res.json({ success: true, data: harvests });
      return;
    }

    const harvests = Array.from(inMemoryStore.harvests.values()).filter(
      (h) =>
        h.userId === userId &&
        (!farmId || h.farmId === farmId) &&
        (!season || h.season === season)
    );

    res.json({ success: true, data: harvests });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/harvests
harvestsRouter.post(
  '/',
  requireAuth,
  validateBody(HarvestCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = req.body;

      if (isUsingPrisma && prisma) {
        const farm = await prisma.farm.findUnique({ where: { id: data.farmId } });
        if (!farm || farm.userId !== userId) {
          throw new ForbiddenError('Farm not found or you do not have permission to log harvests on it.');
        }

        const created = await prisma.harvest.create({
          data: {
            ...data,
            userId,
            harvestDate: new Date(data.harvestDate),
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const farm = inMemoryStore.farms.get(data.farmId);
      if (!farm || farm.userId !== userId) {
        throw new ForbiddenError('Farm not found or you do not have permission to log harvests on it.');
      }

      const id = `hrv-${Date.now()}`;
      const now = new Date().toISOString();
      const newHarvest: Harvest = {
        id,
        userId,
        farmId: data.farmId,
        crop: data.crop,
        season: data.season,
        harvestDate: data.harvestDate,
        quantity: data.quantity,
        unit: data.unit,
        sellingPricePerUnit: data.sellingPricePerUnit,
        currency: data.currency || 'ETB',
        buyerName: data.buyerName || null,
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.harvests.set(id, newHarvest);
      res.status(201).json({ success: true, data: newHarvest });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/harvests/:id
harvestsRouter.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.harvest.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Harvest record not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this harvest.');

      await prisma.harvest.delete({ where: { id } });
      res.json({ success: true, message: 'Harvest deleted successfully' });
      return;
    }

    const existing = inMemoryStore.harvests.get(id);
    if (!existing) throw new NotFoundError('Harvest record not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this harvest.');

    inMemoryStore.harvests.delete(id);
    res.json({ success: true, message: 'Harvest deleted successfully' });
  } catch (err) {
    next(err);
  }
});

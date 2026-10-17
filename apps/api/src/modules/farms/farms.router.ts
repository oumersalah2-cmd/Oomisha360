import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { FarmCreateSchema, FarmUpdateSchema, Farm } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const farmsRouter = Router();

// GET /api/v1/farms - Lists user's private farms
farmsRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farms = await prisma.farm.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: farms });
      return;
    }

    // In-memory filter strictly by authenticated userId
    const userFarms = Array.from(inMemoryStore.farms.values()).filter((f) => f.userId === userId);
    res.json({ success: true, data: userFarms });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/farms - Creates a new farm for user
farmsRouter.post(
  '/',
  requireAuth,
  validateBody(FarmCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const farmData = req.body;

      if (isUsingPrisma && prisma) {
        const created = await prisma.farm.create({
          data: {
            ...farmData,
            userId,
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const id = `farm-${Date.now()}`;
      const now = new Date().toISOString();
      const newFarm: Farm = {
        id,
        userId,
        name: farmData.name,
        region: farmData.region,
        zone: farmData.zone || null,
        woreda: farmData.woreda || null,
        kebele: farmData.kebele || null,
        soilType: farmData.soilType || null,
        totalHectares: farmData.totalHectares,
        primaryCrop: farmData.primaryCrop || null,
        notes: farmData.notes || null,
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.farms.set(id, newFarm);
      res.status(201).json({ success: true, data: newFarm });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/farms/:farmId - Get single farm with ownership check
farmsRouter.get('/:farmId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farm = await prisma.farm.findUnique({
        where: { id: farmId },
      });

      if (!farm) throw new NotFoundError('Farm not found');
      if (farm.userId !== userId) throw new ForbiddenError('You do not have permission to view this farm.');

      res.json({ success: true, data: farm });
      return;
    }

    const farm = inMemoryStore.farms.get(farmId);
    if (!farm) throw new NotFoundError('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenError('You do not have permission to view this farm.');

    res.json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/farms/:farmId - Update farm with ownership check
farmsRouter.patch(
  '/:farmId',
  requireAuth,
  validateBody(FarmUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const farmId = req.params.farmId as string;
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.farm.findUnique({ where: { id: farmId } });
        if (!existing) throw new NotFoundError('Farm not found');
        if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to modify this farm.');

        const updated = await prisma.farm.update({
          where: { id: farmId },
          data: updates,
        });

        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.farms.get(farmId);
      if (!existing) throw new NotFoundError('Farm not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to modify this farm.');

      const updated: Farm = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.farms.set(farmId, updated);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/farms/:farmId - Delete farm with ownership check
farmsRouter.delete('/:farmId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.farm.findUnique({ where: { id: farmId } });
      if (!existing) throw new NotFoundError('Farm not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this farm.');

      await prisma.farm.delete({ where: { id: farmId } });
      res.json({ success: true, message: 'Farm deleted successfully' });
      return;
    }

    const existing = inMemoryStore.farms.get(farmId);
    if (!existing) throw new NotFoundError('Farm not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this farm.');

    inMemoryStore.farms.delete(farmId);
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (err) {
    next(err);
  }
});

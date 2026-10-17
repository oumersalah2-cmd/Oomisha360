import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import {
  calculateRectangularArea,
  calculatePolygonArea,
  LandRecordCreateSchema,
  LandRecordUpdateSchema,
  LandRecord,
  LandAreaResult,
} from '@gebere/shared';
import { z } from 'zod';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../middleware/errorHandler';

export const landRouter = Router();

const CalculateSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('rectangular'),
    length: z.number().positive('Length must be positive'),
    width: z.number().positive('Width must be positive'),
    lengthUnit: z.enum(['meters', 'kilometers', 'feet']),
    widthUnit: z.enum(['meters', 'kilometers', 'feet']),
  }),
  z.object({
    method: z.literal('polygon'),
    coordinates: z
      .array(
        z.object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        })
      )
      .min(3, 'At least 3 coordinates are required to calculate polygon area'),
  }),
]);

// POST /api/v1/land/calculate - Pure calculation for interactive UI
landRouter.post(
  '/calculate',
  validateBody(CalculateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      let result: LandAreaResult;

      if (body.method === 'rectangular') {
        result = calculateRectangularArea({
          length: body.length,
          width: body.width,
          lengthUnit: body.lengthUnit,
          widthUnit: body.widthUnit,
        });
      } else {
        result = calculatePolygonArea(body.coordinates);
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Handler for listing user's saved plots
const handleListLandRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { farmId } = req.query;

    if (isUsingPrisma && prisma) {
      const records = await prisma.landRecord.findMany({
        where: {
          userId,
          ...(farmId ? { farmId: String(farmId) } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });

      const parsed = records.map((r: any) => ({
        ...r,
        coordinates: r.coordinatesJson ? JSON.parse(r.coordinatesJson) : null,
      }));

      res.json({ success: true, data: parsed });
      return;
    }

    const records = Array.from(inMemoryStore.landRecords.values()).filter(
      (r) => r.userId === userId && (!farmId || r.farmId === farmId)
    );

    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/land - Alias for listing user's saved plots
landRouter.get('/', requireAuth, handleListLandRecords);

// GET /api/v1/land/records - List user's saved plots
landRouter.get('/records', requireAuth, handleListLandRecords);

// GET /api/v1/land/records/:id - Retrieve single saved plot with ownership check
landRouter.get('/records/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const record = await prisma.landRecord.findUnique({ where: { id } });
      if (!record) throw new NotFoundError('Land plot record not found');
      if (record.userId !== userId) throw new ForbiddenError('You do not have permission to view this plot record.');

      res.json({
        success: true,
        data: {
          ...record,
          coordinates: record.coordinatesJson ? JSON.parse(record.coordinatesJson) : null,
        },
      });
      return;
    }

    const record = inMemoryStore.landRecords.get(id);
    if (!record) throw new NotFoundError('Land plot record not found');
    if (record.userId !== userId) throw new ForbiddenError('You do not have permission to view this plot record.');

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/land/records - Save a new land plot record
landRouter.post(
  '/records',
  requireAuth,
  validateBody(LandRecordCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = req.body;

      let areaCalc: LandAreaResult;

      if (data.calculationMethod === 'rectangular') {
        if (!data.length || !data.width || !data.lengthUnit || !data.widthUnit) {
          throw new BadRequestError('Length, width, and measurement units are required for rectangular plots.');
        }
        areaCalc = calculateRectangularArea({
          length: data.length,
          width: data.width,
          lengthUnit: data.lengthUnit,
          widthUnit: data.widthUnit,
        });
      } else {
        if (!data.coordinates || data.coordinates.length < 3) {
          throw new BadRequestError('At least 3 polygon boundary coordinates are required.');
        }
        areaCalc = calculatePolygonArea(data.coordinates);
      }

      if (isUsingPrisma && prisma) {
        const created = await prisma.landRecord.create({
          data: {
            userId,
            farmId: data.farmId || null,
            plotName: data.plotName,
            crop: data.crop || null,
            calculationMethod: data.calculationMethod,
            length: data.length || null,
            width: data.width || null,
            lengthUnit: data.lengthUnit || null,
            widthUnit: data.widthUnit || null,
            coordinatesJson: data.coordinates ? JSON.stringify(data.coordinates) : null,
            areaSquareMeters: areaCalc.squareMeters,
            areaHectares: areaCalc.hectares,
            areaAcres: areaCalc.acres,
            isEstimate: areaCalc.isEstimate,
            notes: data.notes || null,
          },
        });

        res.status(201).json({
          success: true,
          data: {
            ...created,
            coordinates: data.coordinates || null,
          },
        });
        return;
      }

      const id = `land-${Date.now()}`;
      const now = new Date().toISOString();
      const newRecord: LandRecord = {
        id,
        userId,
        farmId: data.farmId || null,
        plotName: data.plotName,
        crop: data.crop || null,
        calculationMethod: data.calculationMethod,
        length: data.length || null,
        width: data.width || null,
        lengthUnit: data.lengthUnit || null,
        widthUnit: data.widthUnit || null,
        coordinates: data.coordinates || null,
        areaSquareMeters: areaCalc.squareMeters,
        areaHectares: areaCalc.hectares,
        areaAcres: areaCalc.acres,
        isEstimate: areaCalc.isEstimate,
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.landRecords.set(id, newRecord);
      res.status(201).json({ success: true, data: newRecord });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/land/records/:id - Edit an existing land plot record with ownership check
landRouter.patch(
  '/records/:id',
  requireAuth,
  validateBody(LandRecordUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.landRecord.findUnique({ where: { id } });
        if (!existing) throw new NotFoundError('Land plot record not found');
        if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to edit this record.');

        // Recalculate area if dimensions were modified
        let areaSquareMeters = existing.areaSquareMeters;
        let areaHectares = existing.areaHectares;
        let areaAcres = existing.areaAcres;
        let isEstimate = existing.isEstimate;

        const method = updates.calculationMethod || existing.calculationMethod;
        if (method === 'rectangular' && (updates.length || updates.width || updates.lengthUnit || updates.widthUnit)) {
          const l = updates.length ?? existing.length;
          const w = updates.width ?? existing.width;
          const lu = updates.lengthUnit ?? existing.lengthUnit;
          const wu = updates.widthUnit ?? existing.widthUnit;
          if (l && w && lu && wu) {
            const calc = calculateRectangularArea({ length: l, width: w, lengthUnit: lu, widthUnit: wu });
            areaSquareMeters = calc.squareMeters;
            areaHectares = calc.hectares;
            areaAcres = calc.acres;
            isEstimate = calc.isEstimate;
          }
        }

        const updated = await prisma.landRecord.update({
          where: { id },
          data: {
            plotName: updates.plotName !== undefined ? updates.plotName : existing.plotName,
            farmId: updates.farmId !== undefined ? updates.farmId : existing.farmId,
            crop: updates.crop !== undefined ? updates.crop : existing.crop,
            length: updates.length !== undefined ? updates.length : existing.length,
            width: updates.width !== undefined ? updates.width : existing.width,
            lengthUnit: updates.lengthUnit !== undefined ? updates.lengthUnit : existing.lengthUnit,
            widthUnit: updates.widthUnit !== undefined ? updates.widthUnit : existing.widthUnit,
            areaSquareMeters,
            areaHectares,
            areaAcres,
            isEstimate,
            notes: updates.notes !== undefined ? updates.notes : existing.notes,
            updatedAt: new Date(),
          },
        });

        res.json({
          success: true,
          message: 'Plot record updated successfully',
          data: {
            ...updated,
            coordinates: updated.coordinatesJson ? JSON.parse(updated.coordinatesJson) : null,
          },
        });
        return;
      }

      const existing = inMemoryStore.landRecords.get(id);
      if (!existing) throw new NotFoundError('Land plot record not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to edit this record.');

      let areaSquareMeters = existing.areaSquareMeters;
      let areaHectares = existing.areaHectares;
      let areaAcres = existing.areaAcres;
      let isEstimate = existing.isEstimate;

      const method = updates.calculationMethod || existing.calculationMethod;
      if (method === 'rectangular' && (updates.length || updates.width || updates.lengthUnit || updates.widthUnit)) {
        const l = updates.length ?? existing.length;
        const w = updates.width ?? existing.width;
        const lu = updates.lengthUnit ?? existing.lengthUnit;
        const wu = updates.widthUnit ?? existing.widthUnit;
        if (l && w && lu && wu) {
          const calc = calculateRectangularArea({ length: l, width: w, lengthUnit: lu, widthUnit: wu });
          areaSquareMeters = calc.squareMeters;
          areaHectares = calc.hectares;
          areaAcres = calc.acres;
          isEstimate = calc.isEstimate;
        }
      }

      const updatedRecord: LandRecord = {
        ...existing,
        plotName: updates.plotName !== undefined ? updates.plotName : existing.plotName,
        farmId: updates.farmId !== undefined ? updates.farmId : existing.farmId,
        crop: updates.crop !== undefined ? updates.crop : existing.crop,
        length: updates.length !== undefined ? updates.length : existing.length,
        width: updates.width !== undefined ? updates.width : existing.width,
        lengthUnit: updates.lengthUnit !== undefined ? updates.lengthUnit : existing.lengthUnit,
        widthUnit: updates.widthUnit !== undefined ? updates.widthUnit : existing.widthUnit,
        areaSquareMeters,
        areaHectares,
        areaAcres,
        isEstimate,
        notes: updates.notes !== undefined ? updates.notes : existing.notes,
        updatedAt: new Date().toISOString(),
      };

      inMemoryStore.landRecords.set(id, updatedRecord);
      res.json({
        success: true,
        message: 'Plot record updated successfully',
        data: updatedRecord,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/land/records/:id - Delete record with ownership check
landRouter.delete('/records/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.landRecord.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Land plot record not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this record.');

      await prisma.landRecord.delete({ where: { id } });
      res.json({ success: true, message: 'Land plot record deleted successfully' });
      return;
    }

    const existing = inMemoryStore.landRecords.get(id);
    if (!existing) throw new NotFoundError('Land plot record not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this record.');

    inMemoryStore.landRecords.delete(id);
    res.json({ success: true, message: 'Land plot record deleted successfully' });
  } catch (err) {
    next(err);
  }
});

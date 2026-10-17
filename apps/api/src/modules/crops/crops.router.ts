import { Router, Request, Response } from 'express';
import { PRIORITY_CROPS_CATALOGUE } from './crops.data';
import { NotFoundError } from '../../middleware/errorHandler';

export const cropsRouter = Router();

// GET /api/v1/crops - Returns verified crop catalogue
cropsRouter.get('/', (req: Request, res: Response) => {
  const { zone } = req.query;

  if (zone && typeof zone === 'string') {
    const filtered = PRIORITY_CROPS_CATALOGUE.filter((c) =>
      c.primaryGrowingZones.some((z) => z.toLowerCase().includes(zone.toLowerCase()))
    );
    res.json({ success: true, count: filtered.length, data: filtered });
    return;
  }

  res.json({ success: true, count: PRIORITY_CROPS_CATALOGUE.length, data: PRIORITY_CROPS_CATALOGUE });
});

// GET /api/v1/crops/:id - Returns details for a single crop
cropsRouter.get('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const crop = PRIORITY_CROPS_CATALOGUE.find(
    (c) => c.id.toLowerCase() === id.toLowerCase() || c.nameEnglish.toLowerCase() === id.toLowerCase()
  );

  if (!crop) {
    throw new NotFoundError(`Crop '${id}' not found in catalogue.`);
  }

  res.json({ success: true, data: crop });
});

// GET /api/v1/crops/:id/calendar - Returns farming calendar for crop
cropsRouter.get('/:id/calendar', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const crop = PRIORITY_CROPS_CATALOGUE.find(
    (c) => c.id.toLowerCase() === id.toLowerCase() || c.nameEnglish.toLowerCase() === id.toLowerCase()
  );

  if (!crop) {
    throw new NotFoundError(`Crop '${id}' not found in catalogue.`);
  }

  res.json({
    success: true,
    data: {
      cropId: crop.id,
      nameEnglish: crop.nameEnglish,
      nameAfaanOromoo: crop.nameAfaanOromoo,
      growingSeason: crop.growingSeasonMonths,
      activities: crop.farmingActivities,
    },
  });
});

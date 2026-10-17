import { Router, Request, Response } from 'express';
import { ALL_ETHIOPIA_LOCATIONS, ETHIOPIA_REGIONS_CATALOGUE } from './locations.data';
import { NotFoundError } from '../../middleware/errorHandler';

export const locationsRouter = Router();

// GET /api/v1/locations/regions - List all Ethiopian regions & charter cities
locationsRouter.get('/regions', (req: Request, res: Response) => {
  res.json({
    success: true,
    country: 'Ethiopia',
    count: ETHIOPIA_REGIONS_CATALOGUE.length,
    data: ETHIOPIA_REGIONS_CATALOGUE,
  });
});

// GET /api/v1/locations/zones - List zones within specified region or all regions
locationsRouter.get('/zones', (req: Request, res: Response) => {
  const { region } = req.query;

  if (region && typeof region === 'string') {
    const key = region.toLowerCase().replace(/[\s-]/g, '_');
    const matchedRegion = Object.entries(ALL_ETHIOPIA_LOCATIONS).find(
      ([k, v]) => k === key || v.region.toLowerCase() === region.toLowerCase()
    );

    if (matchedRegion) {
      const summary = matchedRegion[1].zones.map((z) => ({
        id: z.id,
        name: z.name,
        region: matchedRegion[1].region,
        primaryCrops: z.primaryCrops,
        woredaCount: z.woredas.length,
      }));
      res.json({ success: true, region: matchedRegion[1].region, count: summary.length, data: summary });
      return;
    }
  }

  // If no region filter, return all Ethiopian zones across all regions
  const allZones = Object.values(ALL_ETHIOPIA_LOCATIONS).flatMap((r) =>
    r.zones.map((z) => ({
      id: z.id,
      name: z.name,
      region: r.region,
      primaryCrops: z.primaryCrops,
      woredaCount: z.woredas.length,
    }))
  );

  res.json({ success: true, count: allZones.length, data: allZones });
});

// GET /api/v1/locations/zones/:zoneId - Details of a zone including all its woredas
locationsRouter.get('/zones/:zoneId', (req: Request, res: Response) => {
  const zoneId = Array.isArray(req.params.zoneId) ? req.params.zoneId[0] : req.params.zoneId;

  for (const regionData of Object.values(ALL_ETHIOPIA_LOCATIONS)) {
    const matched = regionData.zones.find(
      (z) => z.id.toLowerCase() === zoneId.toLowerCase() || z.name.toLowerCase() === zoneId.toLowerCase()
    );
    if (matched) {
      res.json({
        success: true,
        region: regionData.region,
        data: matched,
      });
      return;
    }
  }

  throw new NotFoundError(`Zone '${zoneId}' not found in Ethiopian administrative database.`);
});

// GET /api/v1/locations/woredas - List woredas filtered by zone or region
locationsRouter.get('/woredas', (req: Request, res: Response) => {
  const { zone, region } = req.query;

  if (zone && typeof zone === 'string') {
    for (const regionData of Object.values(ALL_ETHIOPIA_LOCATIONS)) {
      const matched = regionData.zones.find(
        (z) => z.id.toLowerCase() === zone.toLowerCase() || z.name.toLowerCase() === zone.toLowerCase()
      );
      if (matched) {
        res.json({
          success: true,
          region: regionData.region,
          zone: matched.name,
          count: matched.woredas.length,
          data: matched.woredas,
        });
        return;
      }
    }
    throw new NotFoundError(`Zone '${zone}' not found.`);
  }

  // Filter by region if specified
  if (region && typeof region === 'string') {
    const key = region.toLowerCase().replace(/[\s-]/g, '_');
    const matchedRegion = Object.entries(ALL_ETHIOPIA_LOCATIONS).find(
      ([k, v]) => k === key || v.region.toLowerCase() === region.toLowerCase()
    );

    if (matchedRegion) {
      const woredas = matchedRegion[1].zones.flatMap((z) =>
        z.woredas.map((w) => ({
          ...w,
          zoneId: z.id,
          zoneName: z.name,
          region: matchedRegion[1].region,
        }))
      );
      res.json({ success: true, region: matchedRegion[1].region, count: woredas.length, data: woredas });
      return;
    }
  }

  // Default: return all woredas across Ethiopia
  const allWoredas = Object.values(ALL_ETHIOPIA_LOCATIONS).flatMap((r) =>
    r.zones.flatMap((z) =>
      z.woredas.map((w) => ({
        ...w,
        zoneId: z.id,
        zoneName: z.name,
        region: r.region,
      }))
    )
  );

  res.json({ success: true, count: allWoredas.length, data: allWoredas });
});

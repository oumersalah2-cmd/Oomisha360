import { Router, Request, Response, NextFunction } from 'express';
import { requireBotApiKey, optionalAuth } from '../../middleware/auth';
import { cropHealthService } from './crop-health.service';
import { GebereVisionAIEngine } from './gebere-vision.engine';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { DiagnosisRequestInput } from '@gebere/shared';

export const cropHealthRouter = Router();

const DiagnosisRequestSchema = z.object({
  crop: z.string().min(1, 'Crop name is required'),
  region: z.string().optional(),
  zone: z.string().optional(),
  imageUrl: z.string().optional(),
  observedSymptoms: z.string().optional(),
});

const RequestExpertSchema = z.object({
  diagnosisId: z.string().optional().default('DIAG-MANUAL'),
  crop: z.string().min(1),
  location: z.string().optional(),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  contactPhone: z.string().optional(),
  farmerContact: z.string().optional(),
  farmerName: z.string().optional(),
  disease: z.string().optional(),
  notes: z.string().optional(),
});

const BotDiagnosticSyncSchema = z.object({
  farmerTelegramId: z.string().optional(),
  crop: z.string().min(1),
  symptoms: z.string().optional(),
  diseaseIdentified: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  region: z.string().optional(),
  language: z.string().optional(),
});

// GET /api/v1/crop-health/status - Reports honest bot connection status
cropHealthRouter.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await cropHealthService.getStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/crop-health/diagnose - Gebere Vision AI Diagnostic Analysis Engine
cropHealthRouter.post(
  '/diagnose',
  optionalAuth,
  validateBody(DiagnosisRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: DiagnosisRequestInput = req.body;
      const result = await GebereVisionAIEngine.analyzeCrop(input);

      // Save diagnostic log
      if (isUsingPrisma && prisma) {
        await prisma.cropDiagnosisLog.create({
          data: {
            source: 'gebere_vision_ai_web',
            crop: result.crop,
            symptoms: result.observedSymptoms.join('; '),
            diseaseIdentified: result.diseaseName,
            confidence: result.confidenceScore,
            region: input.region || null,
            status: result.status,
          },
        });
      } else {
        inMemoryStore.diagnosisLogs.unshift({
          ...result,
          region: input.region,
          zone: input.zone,
          source: 'gebere_vision_ai_web',
        });
      }

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/crop-health/history - Retrieve recent diagnostic scan records
cropHealthRouter.get('/history', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isUsingPrisma && prisma) {
      const logs = await prisma.cropDiagnosisLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, count: logs.length, data: logs });
      return;
    }

    const logs = inMemoryStore.diagnosisLogs.slice(0, 10);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/crop-health/request-expert - Request extension agronomist field visit
cropHealthRouter.post(
  '/request-expert',
  optionalAuth,
  validateBody(RequestExpertSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diagnosisId, crop, location, region, zone, woreda, contactPhone, farmerContact, notes, farmerName, disease } = req.body;
      const resolvedLocation = location || [region, zone, woreda].filter(Boolean).join(', ') || 'Ethiopia';
      const resolvedContact = contactPhone || farmerContact || 'Unknown';
      const escalationId = `ESC-${Date.now()}`;
      const escalationRecord = {
        id: `esc-${Date.now()}`,
        escalationId,
        diagnosisId: diagnosisId || 'DIAG-MANUAL',
        crop,
        disease: disease || 'Unspecified Condition',
        farmerName: farmerName || 'Anonymous Farmer',
        location: resolvedLocation,
        contactPhone: resolvedContact,
        notes: notes || 'Farmer requested agronomist field visit via Gebere Vision AI.',
        status: 'pending_woreda_assignment',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: 'Escalation request submitted. The local Woreda Agricultural Extension Office will contact you.',
        data: escalationRecord,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/crop-health/bot-sync - Secure webhook endpoint for existing Telegram Bot
cropHealthRouter.post(
  '/bot-sync',
  requireBotApiKey,
  validateBody(BotDiagnosticSyncSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (isUsingPrisma && prisma) {
        const record = await prisma.cropDiagnosisLog.create({
          data: {
            source: 'telegram_bot',
            farmerTelegramId: data.farmerTelegramId || null,
            crop: data.crop,
            symptoms: data.symptoms || null,
            diseaseIdentified: data.diseaseIdentified || null,
            confidence: data.confidence || null,
            region: data.region || null,
            language: data.language || null,
            status: 'synced_from_bot',
          },
        });
        res.status(201).json({ success: true, message: 'Diagnosis synced successfully from Telegram Bot', data: record });
        return;
      }

      const log = {
        id: `diag-sync-${Date.now()}`,
        ...data,
        source: 'telegram_bot',
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.diagnosisLogs.push(log);

      res.status(201).json({ success: true, message: 'Diagnosis synced successfully from Telegram Bot', data: log });
    } catch (err) {
      next(err);
    }
  }
);

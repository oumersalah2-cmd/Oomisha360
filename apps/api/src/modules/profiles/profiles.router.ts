import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { UserProfileUpdateSchema, UserProfile } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError } from '../../middleware/errorHandler';

export const profilesRouter = Router();

// GET /api/v1/profiles/me
profilesRouter.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const dbProfile = await prisma.userProfile.findUnique({
        where: { id: userId },
      });

      if (!dbProfile) {
        // Automatically provision profile if authenticated via Supabase
        const newProfile = await prisma.userProfile.create({
          data: {
            id: userId,
            email: req.user!.email,
            fullName: 'Farmer User',
            role: req.user!.role,
          },
        });
        res.json({ success: true, data: newProfile });
        return;
      }

      res.json({ success: true, data: dbProfile });
      return;
    }

    // In-memory fallback
    let profile = inMemoryStore.profiles.get(userId);
    if (!profile) {
      profile = {
        id: userId,
        email: req.user!.email,
        fullName: 'Abebe Demisse',
        role: req.user!.role,
        region: 'Oromia',
        zone: 'East Shewa',
        woreda: 'Bishoftu',
        cooperativeName: 'Ada\'a Agricultural Cooperative',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.profiles.set(userId, profile);
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/profiles/me
profilesRouter.patch(
  '/me',
  requireAuth,
  validateBody(UserProfileUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const updated = await prisma.userProfile.update({
          where: { id: userId },
          data: updates,
        });
        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.profiles.get(userId);
      if (!existing) {
        throw new NotFoundError('User profile not found');
      }

      const updated: UserProfile = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.profiles.set(userId, updated);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

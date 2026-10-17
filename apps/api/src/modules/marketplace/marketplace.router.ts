import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import {
  MarketplaceListingCreateSchema,
  MarketplaceListingUpdateSchema,
  MarketplaceInquiryCreateSchema,
  MarketplaceListing,
  MarketplaceInquiry,
} from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const marketplaceRouter = Router();

// GET /api/v1/marketplace/listings - Public browsing with search and filters
marketplaceRouter.get('/listings', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, region, query, status, myOnly } = req.query;
    const userId = req.user?.id;

    if (isUsingPrisma && prisma) {
      const whereClause: Record<string, unknown> = {};

      if (myOnly === 'true' && userId) {
        whereClause.sellerId = userId;
      } else {
        whereClause.status = status ? String(status) : 'active';
      }

      if (category && category !== 'All') {
        whereClause.category = String(category);
      }
      if (region && region !== 'All') {
        whereClause.region = { contains: String(region), mode: 'insensitive' };
      }
      if (query) {
        const q = String(query);
        whereClause.OR = [
          { commodityName: { contains: q, mode: 'insensitive' } },
          { variety: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { cooperativeName: { contains: q, mode: 'insensitive' } },
        ];
      }

      const listings = await prisma.marketplaceListing.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: listings });
      return;
    }

    let listings = Array.from(inMemoryStore.listings.values());

    if (myOnly === 'true' && userId) {
      listings = listings.filter((l) => l.sellerId === userId);
    } else {
      const filterStatus = status ? String(status) : 'active';
      listings = listings.filter((l) => l.status === filterStatus);
    }

    if (category && category !== 'All') {
      listings = listings.filter((l) => l.category === category);
    }
    if (region && region !== 'All') {
      listings = listings.filter((l) => l.region.toLowerCase().includes(String(region).toLowerCase()));
    }
    if (query) {
      const q = String(query).toLowerCase();
      listings = listings.filter(
        (l) =>
          l.commodityName.toLowerCase().includes(q) ||
          l.variety.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          (l.cooperativeName && l.cooperativeName.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, data: listings });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/marketplace/listings/:listingId - Public listing detail
marketplaceRouter.get('/listings/:listingId', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listingId = req.params.listingId as string;

    if (isUsingPrisma && prisma) {
      const listing = await prisma.marketplaceListing.findUnique({
        where: { id: listingId },
        include: {
          seller: {
            select: { id: true, fullName: true, region: true, cooperativeName: true, role: true },
          },
        },
      });

      if (!listing) throw new NotFoundError('Marketplace listing not found');
      res.json({ success: true, data: listing });
      return;
    }

    const listing = inMemoryStore.listings.get(listingId);
    if (!listing) throw new NotFoundError('Marketplace listing not found');

    res.json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/marketplace/listings - Create listing (authenticated user is seller)
marketplaceRouter.post(
  '/listings',
  requireAuth,
  validateBody(MarketplaceListingCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellerId = req.user!.id;
      const data = req.body;

      if (isUsingPrisma && prisma) {
        const created = await prisma.marketplaceListing.create({
          data: {
            ...data,
            sellerId,
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const id = `lst-${Date.now()}`;
      const now = new Date().toISOString();
      const newListing: MarketplaceListing = {
        id,
        sellerId,
        commodityName: data.commodityName,
        variety: data.variety,
        category: data.category,
        description: data.description,
        volumeAmount: data.volumeAmount,
        volumeUnit: data.volumeUnit,
        moistureLevel: data.moistureLevel ?? null,
        askingPriceAmount: data.askingPriceAmount,
        priceUnit: data.priceUnit,
        currency: data.currency || 'ETB',
        region: data.region,
        zone: data.zone,
        woreda: data.woreda,
        cooperativeName: data.cooperativeName ?? null,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail ?? null,
        certifications: data.certifications || [],
        status: data.status || 'active',
        isVerified: false, // Verified by cooperative or union review
        harvestYear: data.harvestYear,
        imageUrls: data.imageUrls || [],
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.listings.set(id, newListing);
      res.status(201).json({ success: true, data: newListing });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/marketplace/listings/:listingId - Edit listing (owner only)
marketplaceRouter.patch(
  '/listings/:listingId',
  requireAuth,
  validateBody(MarketplaceListingUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listingId = req.params.listingId as string;
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
        if (!existing) throw new NotFoundError('Listing not found');
        if (existing.sellerId !== userId) {
          throw new ForbiddenError('You do not have permission to modify this marketplace listing.');
        }

        const updated = await prisma.marketplaceListing.update({
          where: { id: listingId },
          data: updates,
        });
        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.listings.get(listingId);
      if (!existing) throw new NotFoundError('Listing not found');
      if (existing.sellerId !== userId) {
        throw new ForbiddenError('You do not have permission to modify this marketplace listing.');
      }

      const updated: MarketplaceListing = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.listings.set(listingId, updated);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/marketplace/listings/:listingId - Delete listing (owner only)
marketplaceRouter.delete(
  '/listings/:listingId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listingId = req.params.listingId as string;
      const userId = req.user!.id;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
        if (!existing) throw new NotFoundError('Listing not found');
        if (existing.sellerId !== userId) {
          throw new ForbiddenError('You do not have permission to delete this marketplace listing.');
        }

        await prisma.marketplaceListing.delete({ where: { id: listingId } });
        res.json({ success: true, message: 'Listing deleted successfully' });
        return;
      }

      const existing = inMemoryStore.listings.get(listingId);
      if (!existing) throw new NotFoundError('Listing not found');
      if (existing.sellerId !== userId) {
        throw new ForbiddenError('You do not have permission to delete this marketplace listing.');
      }

      inMemoryStore.listings.delete(listingId);
      res.json({ success: true, message: 'Listing deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/marketplace/listings/:listingId/inquiries - Submit an inquiry (direct contact, no fake escrow)
marketplaceRouter.post(
  '/listings/:listingId/inquiries',
  optionalAuth,
  validateBody(MarketplaceInquiryCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listingId = req.params.listingId as string;
      const data = req.body;
      const senderId = req.user?.id || null;

      // Verify listing exists
      if (isUsingPrisma && prisma) {
        const listing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
        if (!listing) throw new NotFoundError('Listing not found');

        const inquiry = await prisma.marketplaceInquiry.create({
          data: {
            ...data,
            listingId,
            senderId,
          },
        });
        res.status(201).json({
          success: true,
          message: 'Inquiry submitted directly to the seller/cooperative.',
          data: inquiry,
        });
        return;
      }

      const listing = inMemoryStore.listings.get(listingId);
      if (!listing) throw new NotFoundError('Listing not found');

      const id = `inq-${Date.now()}`;
      const newInquiry: MarketplaceInquiry = {
        id,
        listingId,
        senderId,
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        senderEmail: data.senderEmail || null,
        message: data.message,
        offeredPrice: data.offeredPrice || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.inquiries.set(id, newInquiry);
      res.status(201).json({
        success: true,
        message: 'Inquiry submitted directly to the seller/cooperative.',
        data: newInquiry,
      });
    } catch (err) {
      next(err);
    }
  }
);

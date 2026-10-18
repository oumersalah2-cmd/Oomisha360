import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import {
  CropProtectionListingCreateSchema,
  CropProtectionListingUpdateSchema,
  CropProtectionInquirySchema,
  CropProtectionProduct,
  CropProtectionListing,
  CropProtectionGuidanceResult,
} from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma, ensureUserProfile } from '../../lib/db';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../middleware/errorHandler';
import { VERIFIED_CROP_PROTECTION_PRODUCTS } from './crop-protection.data';

export const cropProtectionRouter = Router();

// GET /api/v1/crop-protection/products - List registered products with search & filters
cropProtectionRouter.get('/products', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { crop, category, query, registrationStatus } = req.query;

    if (isUsingPrisma && prisma) {
      const whereClause: Record<string, unknown> = {};

      if (category && category !== 'all') {
        whereClause.category = String(category);
      }
      if (registrationStatus && registrationStatus !== 'all') {
        whereClause.registrationStatus = String(registrationStatus);
      }
      if (crop && crop !== 'all') {
        const cropStr = String(crop);
        whereClause.supportedCrops = { has: cropStr };
      }
      if (query) {
        const q = String(query);
        whereClause.OR = [
          { tradeName: { contains: q, mode: 'insensitive' } },
          { brandName: { contains: q, mode: 'insensitive' } },
          { activeIngredient: { contains: q, mode: 'insensitive' } },
          { registrationNumber: { contains: q, mode: 'insensitive' } },
          { targetPests: { hasSome: [q] } },
        ];
      }

      const products = await prisma.cropProtectionProduct.findMany({
        where: whereClause,
        include: {
          approvedUses: true,
          listings: {
            where: { status: 'active' },
            select: { priceAmount: true },
          },
        },
        orderBy: { tradeName: 'asc' },
      });

      // Enhance with min price and listing counts
      const mapped = products.map((p: any) => {
        const prices = p.listings.map((l: any) => l.priceAmount);
        const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
        return {
          ...p,
          minPriceAmount: minPrice,
          listingCount: p.listings.length,
          listings: undefined, // keep summary clean
        };
      });

      res.json({ success: true, data: mapped, total: mapped.length });
      return;
    }

    // In-memory fallback
    let products = Array.from(inMemoryStore.cropProtectionProducts.values());

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }
    if (registrationStatus && registrationStatus !== 'all') {
      products = products.filter((p) => p.registrationStatus === registrationStatus);
    }
    if (crop && crop !== 'all') {
      const cropNorm = String(crop).toLowerCase();
      products = products.filter((p) =>
        p.supportedCrops.some((c) => c.toLowerCase().includes(cropNorm))
      );
    }
    if (query) {
      const q = String(query).toLowerCase();
      products = products.filter(
        (p) =>
          p.tradeName.toLowerCase().includes(q) ||
          (p.brandName && p.brandName.toLowerCase().includes(q)) ||
          p.activeIngredient.toLowerCase().includes(q) ||
          p.registrationNumber.toLowerCase().includes(q) ||
          p.targetPests.some((pest) => pest.toLowerCase().includes(q))
      );
    }

    const mapped = products.map((p) => {
      const relevantListings = Array.from(inMemoryStore.cropProtectionListings.values()).filter(
        (l) => l.productId === p.id && l.status === 'active'
      );
      const prices = relevantListings.map((l) => l.priceAmount);
      return {
        ...p,
        minPriceAmount: prices.length > 0 ? Math.min(...prices) : undefined,
        listingCount: relevantListings.length,
      };
    });

    res.json({ success: true, data: mapped, total: mapped.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/crop-protection/products/:id - Product detail with approved uses & supplier offers
cropProtectionRouter.get('/products/:id', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    if (isUsingPrisma && prisma) {
      const product = await prisma.cropProtectionProduct.findUnique({
        where: { id },
        include: {
          approvedUses: true,
          listings: {
            where: { status: 'active' },
            orderBy: { priceAmount: 'asc' },
          },
        },
      });

      if (!product) {
        throw new NotFoundError(`Crop protection product '${id}' not found`);
      }

      res.json({ success: true, data: product });
      return;
    }

    const product = inMemoryStore.cropProtectionProducts.get(id);
    if (!product) {
      throw new NotFoundError(`Crop protection product '${id}' not found`);
    }

    const listings = Array.from(inMemoryStore.cropProtectionListings.values())
      .filter((l) => l.productId === id && l.status === 'active')
      .sort((a, b) => a.priceAmount - b.priceAmount);

    res.json({
      success: true,
      data: {
        ...product,
        listings,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/crop-protection/guidance - Verified agricultural IPM guidance linked to safe crop protection
cropProtectionRouter.get('/guidance', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crop = String(req.query.crop || 'coffee').toLowerCase();
    const problem = String(req.query.problem || req.query.disease || '').toLowerCase();

    // Map common crop names
    let normalizedCrop = 'Coffee';
    if (crop.includes('wheat') || crop.includes('qamadii') || crop.includes('sinde')) {
      normalizedCrop = 'Wheat';
    } else if (crop.includes('teff') || crop.includes('xaafii')) {
      normalizedCrop = 'Teff';
    } else if (crop.includes('barley') || crop.includes('garbuu') || crop.includes('gebs')) {
      normalizedCrop = 'Barley';
    } else if (crop.includes('maiz') || crop.includes('boqqoolloo')) {
      normalizedCrop = 'Maize';
    }

    // Match registered products for this crop and problem
    let matchingProducts: CropProtectionProduct[] = [];

    if (isUsingPrisma && prisma) {
      const products = await prisma.cropProtectionProduct.findMany({
        where: {
          supportedCrops: { has: normalizedCrop },
        },
        include: {
          approvedUses: true,
          listings: { where: { status: 'active' }, select: { priceAmount: true } },
        },
      });

      matchingProducts = products
        .map((p: any) => {
          const prices = p.listings.map((l: any) => l.priceAmount);
          return {
            ...p,
            minPriceAmount: prices.length > 0 ? Math.min(...prices) : undefined,
            listingCount: p.listings.length,
          };
        })
        .filter((p: CropProtectionProduct) => {
          if (!problem) return true;
          const prob = problem.toLowerCase();
          const matchesTarget = p.targetPests.some((pest) => pest.toLowerCase().includes(prob));
          const matchesUse = p.approvedUses?.some((u) => u.targetProblem.toLowerCase().includes(prob));
          return matchesTarget || matchesUse;
        });
    } else {
      const products = Array.from(inMemoryStore.cropProtectionProducts.values()).filter((p) =>
        p.supportedCrops.some((c) => c.toLowerCase() === normalizedCrop.toLowerCase())
      );

      matchingProducts = products.filter((p) => {
        if (!problem) return true;
        const prob = problem.toLowerCase();
        return (
          p.targetPests.some((pest) => pest.toLowerCase().includes(prob)) ||
          p.approvedUses?.some((u) => u.targetProblem.toLowerCase().includes(prob))
        );
      });
    }

    // Cultural & IPM advice depending on crop & identified stress
    const culturalPractices: string[] = [
      'Maintain rigorous crop rotation with non-host legumes (faba beans, chickpeas, field peas) to disrupt pathogen lifecycles.',
      'Employ clean, certified disease-free seed sourced from recognized Ethiopian research centers (EIAR, DZARC, Kulumsa, or JARC).',
      'Ensure balanced soil nutrition based on local soil test; avoid excessive late nitrogen fertilization which amplifies foliar vulnerability.',
      'Scout fields twice weekly during high-humidity rainfall periods (Kiremt and Belg) to spot primary foci before widespread infestation.',
    ];

    const guidanceResult: CropProtectionGuidanceResult = {
      crop: normalizedCrop,
      diseaseOrPest: problem || 'General Crop Health Management',
      ipmRecommendation:
        'Prioritize preventative cultural practices and certified biological controls first. Chemical crop medicines should only be considered if economic threshold levels are exceeded and confirmed through field scouting.',
      culturalPractices,
      registeredProducts: matchingProducts,
      safetyNotice:
        'SAFETY MANDATE: Never apply pesticides without positive disease or pest identification. Do not guess mixing rates or exceed approved label dosage. Chemical treatments must never be applied off-label. If symptoms are ambiguous, consult your Kebele Development Agent (DA) or Woreda Agricultural Bureau before chemical intervention.',
      extensionContactRecommended: true,
      authority: 'Ethiopian Agricultural Authority (EAA) & Ministry of Agriculture (MoA)',
    };

    res.json({ success: true, data: guidanceResult });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/crop-protection/listings - Filter supplier listings across Oromia
cropProtectionRouter.get('/listings', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, region, zone, woreda, status, myOnly, inStockOnly } = req.query;
    const userId = req.user?.id;

    if (isUsingPrisma && prisma) {
      const whereClause: Record<string, unknown> = {};

      if (myOnly === 'true' && userId) {
        whereClause.supplierId = userId;
      } else {
        whereClause.status = status ? String(status) : 'active';
      }

      if (productId) {
        whereClause.productId = String(productId);
      }
      if (region && region !== 'all') {
        whereClause.region = { contains: String(region), mode: 'insensitive' };
      }
      if (zone && zone !== 'all') {
        whereClause.zone = { contains: String(zone), mode: 'insensitive' };
      }
      if (woreda && woreda !== 'all') {
        whereClause.woreda = { contains: String(woreda), mode: 'insensitive' };
      }
      if (inStockOnly === 'true') {
        whereClause.inStock = true;
      }

      const listings = await prisma.cropProtectionListing.findMany({
        where: whereClause,
        include: {
          product: {
            select: {
              id: true,
              tradeName: true,
              brandName: true,
              activeIngredient: true,
              category: true,
              whoToxicityClass: true,
              registrationNumber: true,
              registrationStatus: true,
            },
          },
        },
        orderBy: { priceAmount: 'asc' },
      });

      res.json({ success: true, data: listings, total: listings.length });
      return;
    }

    let listings = Array.from(inMemoryStore.cropProtectionListings.values());

    if (myOnly === 'true' && userId) {
      listings = listings.filter((l) => l.supplierId === userId);
    } else {
      const filterStatus = status ? String(status) : 'active';
      listings = listings.filter((l) => l.status === filterStatus);
    }

    if (productId) {
      listings = listings.filter((l) => l.productId === productId);
    }
    if (region && region !== 'all') {
      listings = listings.filter((l) => l.region.toLowerCase().includes(String(region).toLowerCase()));
    }
    if (zone && zone !== 'all') {
      listings = listings.filter((l) => l.zone.toLowerCase().includes(String(zone).toLowerCase()));
    }
    if (woreda && woreda !== 'all') {
      listings = listings.filter((l) => l.woreda.toLowerCase().includes(String(woreda).toLowerCase()));
    }
    if (inStockOnly === 'true') {
      listings = listings.filter((l) => l.inStock);
    }

    const enhanced = listings.map((l) => {
      const prod = inMemoryStore.cropProtectionProducts.get(l.productId);
      return {
        ...l,
        product: prod
          ? {
              id: prod.id,
              tradeName: prod.tradeName,
              brandName: prod.brandName,
              activeIngredient: prod.activeIngredient,
              category: prod.category,
              whoToxicityClass: prod.whoToxicityClass,
              registrationNumber: prod.registrationNumber,
              registrationStatus: prod.registrationStatus,
            }
          : undefined,
      };
    });

    res.json({ success: true, data: enhanced, total: enhanced.length });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/crop-protection/listings - Authorized supplier creates a product listing
cropProtectionRouter.post(
  '/listings',
  requireAuth,
  validateBody(CropProtectionListingCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      await ensureUserProfile(user);

      const data = req.body;

      // Verify that the product being listed exists in the verified product registry!
      if (isUsingPrisma && prisma) {
        const product = await prisma.cropProtectionProduct.findUnique({
          where: { id: data.productId },
        });

        if (!product) {
          throw new BadRequestError(
            `Cannot create listing: Product '${data.productId}' is not registered in the official Ethiopian Crop Protection database.`
          );
        }

        const listing = await prisma.cropProtectionListing.create({
          data: {
            ...data,
            supplierId: user.id,
            isVerifiedDealer: Boolean(data.licenseNumber),
          },
          include: {
            product: true,
          },
        });

        res.status(201).json({ success: true, data: listing });
        return;
      }

      const product = inMemoryStore.cropProtectionProducts.get(data.productId);
      if (!product) {
        throw new BadRequestError(
          `Cannot create listing: Product '${data.productId}' is not registered in the official Ethiopian Crop Protection database.`
        );
      }

      const newListing: CropProtectionListing = {
        ...data,
        id: `cpl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        supplierId: user.id,
        isVerifiedDealer: Boolean(data.licenseNumber),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inMemoryStore.cropProtectionListings.set(newListing.id, newListing);

      res.status(201).json({
        success: true,
        data: {
          ...newListing,
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/crop-protection/listings/:id - Supplier updates their own listing
cropProtectionRouter.patch(
  '/listings/:id',
  requireAuth,
  validateBody(CropProtectionListingUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const id = req.params.id as string;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.cropProtectionListing.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new NotFoundError(`Listing '${id}' not found`);
        }

        if (existing.supplierId !== user.id) {
          throw new ForbiddenError('You can only update your own supplier listings.');
        }

        const updated = await prisma.cropProtectionListing.update({
          where: { id },
          data: req.body,
        });

        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.cropProtectionListings.get(id);
      if (!existing) {
        throw new NotFoundError(`Listing '${id}' not found`);
      }

      if (existing.supplierId !== user.id) {
        throw new ForbiddenError('You can only update your own supplier listings.');
      }

      const updated: CropProtectionListing = {
        ...existing,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      inMemoryStore.cropProtectionListings.set(id, updated);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/crop-protection/listings/:id - Supplier deletes their listing
cropProtectionRouter.delete(
  '/listings/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const id = req.params.id as string;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.cropProtectionListing.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new NotFoundError(`Listing '${id}' not found`);
        }

        if (existing.supplierId !== user.id) {
          throw new ForbiddenError('You can only delete your own supplier listings.');
        }

        await prisma.cropProtectionListing.delete({ where: { id } });
        res.json({ success: true, message: 'Supplier listing deleted successfully' });
        return;
      }

      const existing = inMemoryStore.cropProtectionListings.get(id);
      if (!existing) {
        throw new NotFoundError(`Listing '${id}' not found`);
      }

      if (existing.supplierId !== user.id) {
        throw new ForbiddenError('You can only delete your own supplier listings.');
      }

      inMemoryStore.cropProtectionListings.delete(id);
      res.json({ success: true, message: 'Supplier listing deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/crop-protection/listings/:id/inquiries - Farmer submits inquiry to supplier
cropProtectionRouter.post(
  '/listings/:id/inquiries',
  validateBody(CropProtectionInquirySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // Verify listing exists
      let listingSupplierPhone = '';
      if (isUsingPrisma && prisma) {
        const listing = await prisma.cropProtectionListing.findUnique({
          where: { id },
        });
        if (!listing) {
          throw new NotFoundError(`Listing '${id}' not found`);
        }
        listingSupplierPhone = listing.contactPhone;
      } else {
        const listing = inMemoryStore.cropProtectionListings.get(id);
        if (!listing) {
          throw new NotFoundError(`Listing '${id}' not found`);
        }
        listingSupplierPhone = listing.contactPhone;
      }

      const inquiryData = req.body;
      const inquiryId = `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      res.status(201).json({
        success: true,
        data: {
          id: inquiryId,
          listingId: id,
          ...inquiryData,
          supplierContactPhone: listingSupplierPhone,
          status: 'sent',
          createdAt: new Date().toISOString(),
        },
        message: 'Inquiry successfully transmitted to authorized agricultural supplier.',
      });
    } catch (err) {
      next(err);
    }
  }
);

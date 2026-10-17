import { config } from '../config';
import type {
  Farm,
  LandRecord,
  Expense,
  Harvest,
  MarketplaceListing,
  MarketplaceInquiry,
  UserProfile,
} from '@gebere/shared';

// Dynamic Prisma client type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let prisma: any = null;
export let isUsingPrisma = false;

if (config.databaseUrl && !config.databaseUrl.includes('your-db-password')) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    isUsingPrisma = true;
  } catch (err) {
    console.warn('[DB] Could not initialize PrismaClient. Falling back to in-memory store:', err);
    prisma = null;
    isUsingPrisma = false;
  }
}

// In-Memory Data Store (Used when PostgreSQL is not configured or in testing)
export class InMemoryStore {
  public profiles: Map<string, UserProfile> = new Map();
  public farms: Map<string, Farm> = new Map();
  public landRecords: Map<string, LandRecord> = new Map();
  public expenses: Map<string, Expense> = new Map();
  public harvests: Map<string, Harvest> = new Map();
  public listings: Map<string, MarketplaceListing> = new Map();
  public inquiries: Map<string, MarketplaceInquiry> = new Map();
  public diagnosisLogs: Array<Record<string, unknown>> = [];

  constructor() {
    this.seedDefaultData();
  }

  public seedDefaultData() {
    // 1. Seed Demo User Profile
    const demoUser: UserProfile = {
      id: 'usr-demo-farmer-1',
      email: 'farmer.demo@geberevision.et',
      fullName: 'Abebe Demisse',
      phone: '+251 91 123 4567',
      region: 'Oromia',
      zone: 'East Shewa',
      woreda: 'Bishoftu (Ada\'a)',
      cooperativeName: 'Ada\'a Agricultural Cooperative',
      role: 'farmer',
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-01-10T08:00:00Z',
    };
    this.profiles.set(demoUser.id, demoUser);

    // 2. Seed Farms
    const farm1: Farm = {
      id: 'farm-adaa-teff',
      userId: demoUser.id,
      name: 'Bishoftu Volcanic Black Soil Plot',
      region: 'Oromia',
      zone: 'East Shewa',
      woreda: 'Bishoftu',
      kebele: 'Ude Kebele',
      soilType: 'Vertisol (Black Cotton Soil)',
      totalHectares: 3.5,
      primaryCrop: 'White Teff (Magna)',
      notes: 'Well-drained fertile plain, rotated with chickpeas in dry season.',
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-01T10:00:00Z',
    };

    const farm2: Farm = {
      id: 'farm-bale-wheat',
      userId: demoUser.id,
      name: 'Bale Highlands Durum Wheat Block',
      region: 'Oromia',
      zone: 'Bale',
      woreda: 'Goba',
      kebele: 'Sinana Kebele',
      soilType: 'Clay Loam',
      totalHectares: 5.0,
      primaryCrop: 'Durum Wheat',
      notes: 'Highland altitude 2,400m, high yield potential for pasta millers.',
      createdAt: '2026-02-15T09:30:00Z',
      updatedAt: '2026-02-15T09:30:00Z',
    };

    this.farms.set(farm1.id, farm1);
    this.farms.set(farm2.id, farm2);

    // 3. Seed Land Records
    const land1: LandRecord = {
      id: 'land-plot-1',
      userId: demoUser.id,
      farmId: farm1.id,
      plotName: 'East Field Rectangular Plot',
      crop: 'Teff',
      calculationMethod: 'rectangular',
      length: 250,
      width: 140,
      lengthUnit: 'meters',
      widthUnit: 'meters',
      areaSquareMeters: 35000,
      areaHectares: 3.5,
      areaAcres: 8.6487,
      isEstimate: false,
      notes: 'Measured with survey tape along drainage canal.',
      createdAt: '2026-02-05T11:00:00Z',
      updatedAt: '2026-02-05T11:00:00Z',
    };

    const land2: LandRecord = {
      id: 'land-plot-2',
      userId: demoUser.id,
      farmId: farm2.id,
      plotName: 'Goba Irregular Ridge Polygon',
      crop: 'Wheat',
      calculationMethod: 'polygon',
      coordinates: [
        { lat: 7.0125, lng: 39.9812 },
        { lat: 7.0150, lng: 39.9845 },
        { lat: 7.0120, lng: 39.9880 },
        { lat: 7.0095, lng: 39.9830 },
      ],
      areaSquareMeters: 50000,
      areaHectares: 5.0,
      areaAcres: 12.3553,
      isEstimate: true,
      notes: 'GPS estimation from satellite boundary points along contour terrace.',
      createdAt: '2026-02-18T14:20:00Z',
      updatedAt: '2026-02-18T14:20:00Z',
    };

    this.landRecords.set(land1.id, land1);
    this.landRecords.set(land2.id, land2);

    // 4. Seed Expenses
    const initialExpenses: Expense[] = [
      {
        id: 'exp-1',
        userId: demoUser.id,
        farmId: farm1.id,
        season: '2026 Meher',
        category: 'land_preparation',
        description: 'Tractor plowing (oxen + chisel plow)',
        amount: 8500,
        currency: 'ETB',
        date: '2026-05-10',
        createdAt: '2026-05-10T08:00:00Z',
        updatedAt: '2026-05-10T08:00:00Z',
      },
      {
        id: 'exp-2',
        userId: demoUser.id,
        farmId: farm1.id,
        season: '2026 Meher',
        category: 'seeds',
        description: 'Certified Magna Teff seed 40kg',
        amount: 6200,
        currency: 'ETB',
        date: '2026-05-25',
        createdAt: '2026-05-25T09:00:00Z',
        updatedAt: '2026-05-25T09:00:00Z',
      },
      {
        id: 'exp-3',
        userId: demoUser.id,
        farmId: farm1.id,
        season: '2026 Meher',
        category: 'fertilizer',
        description: 'NPSB and Urea blended fertilizer (4 bags)',
        amount: 14800,
        currency: 'ETB',
        date: '2026-06-12',
        createdAt: '2026-06-12T10:00:00Z',
        updatedAt: '2026-06-12T10:00:00Z',
      },
      {
        id: 'exp-4',
        userId: demoUser.id,
        farmId: farm1.id,
        season: '2026 Meher',
        category: 'labor',
        description: 'Weeding crew (3 days, 6 persons)',
        amount: 9000,
        currency: 'ETB',
        date: '2026-07-15',
        createdAt: '2026-07-15T11:00:00Z',
        updatedAt: '2026-07-15T11:00:00Z',
      },
      {
        id: 'exp-5',
        userId: demoUser.id,
        farmId: farm1.id,
        season: '2026 Meher',
        category: 'transportation',
        description: 'Transport from field to Ada\'a cooperative storehouse',
        amount: 4500,
        currency: 'ETB',
        date: '2026-10-20',
        createdAt: '2026-10-20T14:00:00Z',
        updatedAt: '2026-10-20T14:00:00Z',
      },
    ];

    for (const exp of initialExpenses) {
      this.expenses.set(exp.id, exp);
    }

    // 5. Seed Harvests
    const harvest1: Harvest = {
      id: 'hrv-1',
      userId: demoUser.id,
      farmId: farm1.id,
      crop: 'White Teff (Magna)',
      season: '2026 Meher',
      harvestDate: '2026-10-18',
      quantity: 38,
      unit: 'Quintals',
      sellingPricePerUnit: 6800,
      currency: 'ETB',
      buyerName: 'Ada\'a Union Millers',
      notes: 'Excellent grain purity, moisture level 10.8%.',
      createdAt: '2026-10-19T10:00:00Z',
      updatedAt: '2026-10-19T10:00:00Z',
    };
    this.harvests.set(harvest1.id, harvest1);

    // 6. Seed Marketplace Listings
    const listingsSeed: MarketplaceListing[] = [
      {
        id: 'lst-yirgacheffe-coffee',
        sellerId: 'usr-yirga-union',
        commodityName: 'Specialty Coffee',
        variety: 'Yirgacheffe Grade 1 (Washed)',
        category: 'coffee_spices',
        description:
          'Premium washed specialty coffee with bright floral acidity, hints of jasmine and bergamot, with a clean tea-like finish. Fully traceable to smallholder cooperative members.',
        volumeAmount: 18,
        volumeUnit: 'Metric Tons',
        moistureLevel: 11.5,
        askingPriceAmount: 480,
        priceUnit: 'kg',
        currency: 'ETB',
        region: 'Sidama',
        zone: 'Gedeo',
        woreda: 'Yirgacheffe',
        cooperativeName: 'Yirgacheffe Farmers Cooperative Union',
        contactPerson: 'Demeke Wolde',
        contactPhone: '+251 91 223 3445',
        contactEmail: 'trade@yirgacheffecoffee.et',
        certifications: ['Fairtrade Certified', 'Organic USDA', 'Rainforest Alliance'],
        status: 'active',
        isVerified: true,
        harvestYear: 2026,
        imageUrls: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'],
        createdAt: '2026-08-01T10:00:00Z',
        updatedAt: '2026-08-01T10:00:00Z',
      },
      {
        id: 'lst-durum-wheat',
        sellerId: 'usr-bale-coop',
        commodityName: 'Durum Wheat',
        variety: 'Grade 1 Durum Wheat (High Gluten)',
        category: 'cereals_grains',
        description:
          'High-protein durum wheat ideal for local industrial millers and pasta manufacturers. Cleaned, graded, and stored in dry, modern silos in Goba.',
        volumeAmount: 450,
        volumeUnit: 'Quintals',
        moistureLevel: 12.0,
        askingPriceAmount: 85,
        priceUnit: 'kg',
        currency: 'ETB',
        region: 'Oromia',
        zone: 'Bale',
        woreda: 'Goba',
        cooperativeName: 'Bale Goba Grain Cooperative',
        contactPerson: 'Taye Bekele',
        contactPhone: '+251 91 334 4556',
        contactEmail: 'bale.grains@gmail.com',
        certifications: ['CABI High Yield Inspected', 'Non-GMO'],
        status: 'active',
        isVerified: true,
        harvestYear: 2026,
        imageUrls: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
        createdAt: '2026-08-10T11:00:00Z',
        updatedAt: '2026-08-10T11:00:00Z',
      },
      {
        id: 'lst-white-teff',
        sellerId: demoUser.id,
        commodityName: 'White Teff',
        variety: 'Magna (Super White) Teff',
        category: 'cereals_grains',
        description:
          'First-grade Magna white teff from fertile volcanic soil of Ada\'a. Fine grain structure with high iron and fiber content, harvested under optimal dryness.',
        volumeAmount: 320,
        volumeUnit: 'Quintals',
        moistureLevel: 10.8,
        askingPriceAmount: 110,
        priceUnit: 'kg',
        currency: 'ETB',
        region: 'Oromia',
        zone: 'East Shewa',
        woreda: 'Bishoftu',
        cooperativeName: 'Ada\'a Agricultural Cooperative',
        contactPerson: 'Abebe Demisse',
        contactPhone: '+251 91 123 4567',
        contactEmail: 'farmer.demo@geberevision.et',
        certifications: ['Verified Gluten-Free Source', 'Cooperative Traceable'],
        status: 'active',
        isVerified: true,
        harvestYear: 2026,
        imageUrls: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'],
        createdAt: '2026-08-15T09:00:00Z',
        updatedAt: '2026-08-15T09:00:00Z',
      },
    ];

    for (const listing of listingsSeed) {
      this.listings.set(listing.id, listing);
    }
  }
}

export const inMemoryStore = new InMemoryStore();

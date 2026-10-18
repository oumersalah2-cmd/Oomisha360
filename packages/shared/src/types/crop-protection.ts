import { Currency } from './index.js';

export type CropProtectionCategory =
  | 'fungicide'
  | 'insecticide'
  | 'herbicide'
  | 'seed_treatment'
  | 'biological_control'
  | 'other';

export const CROP_PROTECTION_CATEGORY_LABELS: Record<CropProtectionCategory, string> = {
  fungicide: 'Fungicides (Disease Control)',
  insecticide: 'Insecticides (Pest Management)',
  herbicide: 'Herbicides (Weed Suppression)',
  seed_treatment: 'Seed Treatments & Protectants',
  biological_control: 'Biological & Bio-Control Products',
  other: 'Other Registered Crop Medicines',
};

export type RegistrationStatus = 'registered' | 'provisional' | 'sample_demo' | 'under_review';

export type WHOToxicityClass =
  | 'Class Ia (Extremely Hazardous)'
  | 'Class Ib (Highly Hazardous)'
  | 'Class II (Moderately Hazardous)'
  | 'Class III (Slightly Hazardous)'
  | 'Class U (Unlikely Acute Hazard)';

export interface ProductRegisteredUse {
  id: string;
  productId: string;
  crop: string;
  targetProblem: string;
  applicationMethod: string;
  applicationTiming: string;
  safetyNotes: string;
  phiDays: number; // Pre-Harvest Interval in days
}

export interface CropProtectionListing {
  id: string;
  productId: string;
  supplierId: string;
  supplierName: string;
  storeName?: string | null;
  licenseNumber?: string | null;
  isVerifiedDealer: boolean;
  packageSize: string;
  priceAmount: number;
  currency: Currency;
  inStock: boolean;
  stockQuantity?: number | null;
  region: string;
  zone: string;
  woreda: string;
  contactPhone: string;
  contactEmail?: string | null;
  notes?: string | null;
  status: 'active' | 'out_of_stock' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CropProtectionProduct {
  id: string;
  tradeName: string;
  brandName?: string | null;
  activeIngredient: string;
  category: CropProtectionCategory;
  formulation: string;
  registrationNumber: string;
  registrationStatus: RegistrationStatus;
  registrationAuthority: string;
  whoToxicityClass: WHOToxicityClass;
  targetPests: string[];
  supportedCrops: string[];
  approvedUses: ProductRegisteredUse[];
  safetyPrecautions: string[];
  ppeRequirements: string[];
  withholdingPeriodDays: number;
  storageInstructions: string;
  disposalInstructions: string;
  packagingSizes: string[];
  sourceOrganization: string;
  lastVerifiedAt: string;
  isVerified: boolean;
  isSampleData: boolean;
  listings?: CropProtectionListing[];
  minPriceAmount?: number;
  listingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CropProtectionGuidanceResult {
  crop: string;
  diseaseOrPest: string;
  ipmRecommendation: string;
  culturalPractices: string[];
  registeredProducts: CropProtectionProduct[];
  safetyNotice: string;
  extensionContactRecommended: boolean;
  authority: string;
}

export interface CropProtectionInquiryInput {
  listingId: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  message: string;
  quantityRequested?: number;
}

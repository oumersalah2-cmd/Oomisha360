export type MeasurementUnit = 'meters' | 'kilometers' | 'feet';

export type VolumeUnit = 'Quintals' | 'Metric Tons' | 'kg' | 'Bags';

export type Currency = 'ETB' | 'USD';

export type ExpenseCategory =
  | 'land_preparation'
  | 'seeds'
  | 'fertilizer'
  | 'crop_protection'
  | 'labor'
  | 'irrigation'
  | 'equipment_rental'
  | 'transportation'
  | 'other';


export interface RectangularCalculationInput {
  length: number;
  width: number;
  lengthUnit: MeasurementUnit;
  widthUnit: MeasurementUnit;
}

export interface LandAreaResult {
  squareMeters: number;
  hectares: number;
  acres: number;
  normalizedLengthMeters?: number;
  normalizedWidthMeters?: number;
  isEstimate: boolean;
  disclaimer: string;
}

export interface PolygonCoordinates {
  lat: number;
  lng: number;
}

export interface PolygonCalculationInput {
  coordinates: PolygonCoordinates[];
}

export interface LandRecord {
  id: string;
  userId: string;
  farmId?: string | null;
  plotName: string;
  crop?: string | null;
  calculationMethod: 'rectangular' | 'polygon';
  length?: number | null;
  width?: number | null;
  lengthUnit?: MeasurementUnit | null;
  widthUnit?: MeasurementUnit | null;
  coordinates?: PolygonCoordinates[] | null;
  areaSquareMeters: number;
  areaHectares: number;
  areaAcres: number;
  isEstimate: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  region: string;
  zone?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  soilType?: string | null;
  totalHectares: number;
  primaryCrop?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  farmId: string;
  season: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: Currency;
  date: string;
  receiptUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Harvest {
  id: string;
  userId: string;
  farmId: string;
  crop: string;
  season: string;
  harvestDate: string;
  quantity: number;
  unit: VolumeUnit;
  sellingPricePerUnit: number;
  currency: Currency;
  buyerName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBreakdownItem {
  category: ExpenseCategory;
  label: string;
  amount: number;
  percentage: number;
}

export interface FinanceSummary {
  farmId?: string;
  season?: string;
  cultivatedAreaHectares: number;
  totalCost: number;
  costPerHectare: number;
  totalRevenue: number;
  estimatedProfit: number;
  profitPerHectare: number;
  currency: Currency;
  expenseCount: number;
  harvestCount: number;
  categoryBreakdown: CategoryBreakdownItem[];
}

export type ListingStatus = 'active' | 'draft' | 'sold';

export type CommodityCategory =
  | 'cereals_grains'
  | 'pulses'
  | 'coffee_spices'
  | 'oilseeds'
  | 'vegetables'
  | 'fruits'
  | 'livestock_dairy'
  | 'equipment_inputs';

export const COMMODITY_CATEGORY_LABELS: Record<CommodityCategory, string> = {
  cereals_grains: 'Cereals & Grains (Teff, Wheat, Maize)',
  pulses: 'Pulses & Legumes (Chickpeas, Beans, Lentils)',
  coffee_spices: 'Coffee & Spices',
  oilseeds: 'Oilseeds (Sesame, Niger Seed, Linseed)',
  vegetables: 'Fresh Vegetables & Roots',
  fruits: 'Fresh Fruits',
  livestock_dairy: 'Livestock & Dairy Products',
  equipment_inputs: 'Farming Equipment & Organic Inputs',
};

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  commodityName: string;
  variety: string;
  category: CommodityCategory;
  description: string;
  volumeAmount: number;
  volumeUnit: VolumeUnit;
  moistureLevel?: number | null;
  askingPriceAmount: number;
  priceUnit: 'kg' | 'Quintal' | 'Metric Ton';
  currency: Currency;
  region: string;
  zone: string;
  woreda: string;
  cooperativeName?: string | null;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string | null;
  certifications: string[];
  status: ListingStatus;
  isVerified: boolean;
  harvestYear: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceInquiry {
  id: string;
  listingId: string;
  senderId?: string | null;
  senderName: string;
  senderPhone: string;
  senderEmail?: string | null;
  message: string;
  offeredPrice?: number | null;
  status: 'pending' | 'read' | 'responded';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  region?: string | null;
  zone?: string | null;
  woreda?: string | null;
  cooperativeName?: string | null;
  role: 'farmer' | 'cooperative_manager' | 'buyer' | 'agronomist';
  createdAt: string;
  updatedAt: string;
}

export interface CropHealthDiagnosisNotice {
  status: 'service_interface_ready' | 'telegram_bot_integrated' | 'web_ai_coming_soon';
  botUsername: string;
  notice: string;
  supportedBotCrops: string[];
}

export interface CropVariety {
  name: string;
  maturityDays: string;
  yieldPotentialQuintalsPerHa: string;
  recommendedZones: string[];
}

export interface FarmingActivityGuide {
  phase: string;
  timing: string;
  description: string;
}

export interface CropProfile {
  id: string; // 'coffee' | 'teff' | 'wheat' | 'barley'
  nameEnglish: string;
  nameAfaanOromoo: string;
  nameAmharic: string;
  scientificName: string;
  description: string;
  growingSeasonMonths: string;
  idealElevationMeters: string;
  primaryGrowingZones: string[];
  varieties: CropVariety[];
  farmingActivities: FarmingActivityGuide[];
  commonUses: string[];
  benchmarkExpensePerHaETB: number;
  benchmarkMarketPriceETBPerKg: number;
  marketTrend: 'Rising' | 'Stable' | 'Fluctuating';
  currentGrowthStage: string;
  progressPercent: number;
  imageUrl: string;
}

export interface WoredaItem {
  id: string;
  name: string;
}

export interface ZoneItem {
  id: string;
  name: string;
  primaryCrops: string[];
  woredas: WoredaItem[];
}

export interface RegionLocationData {
  region: string;
  country: string;
  zones: ZoneItem[];
}

export interface EthiopiaRegionSummary {
  id: string;
  name: string;
  country: string;
  zoneCount: number;
  primaryAgriculturalZones: string[];
}

export interface DiagnosisRequestInput {
  crop: string;
  region?: string;
  zone?: string;
  imageUrl?: string;
  observedSymptoms?: string;
}

export interface DiagnosisResult {
  id: string;
  timestamp: string;
  crop: string;
  status: 'healthy' | 'disease_detected';
  diseaseName: string;
  scientificName: string;
  confidenceScore: number;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  observedSymptoms: string[];
  diagnosticIndicators: string[];
  approvedManagementAdvice: string[];
  organicTreatments: string[];
  quarantineWarning?: string;
  extensionOfficeEscalationRecommended: boolean;
  sourceAuthority: string;
  imageUrl?: string;
}


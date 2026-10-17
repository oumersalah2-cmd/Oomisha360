import { z } from 'zod';

export const MeasurementUnitSchema = z.enum(['meters', 'kilometers', 'feet']);

export const VolumeUnitSchema = z.enum(['Quintals', 'Metric Tons', 'kg', 'Bags']);

export const CurrencySchema = z.enum(['ETB', 'USD']);

export const ExpenseCategorySchema = z.enum([
  'land_preparation',
  'seeds',
  'fertilizer',
  'crop_protection',
  'labor',
  'irrigation',
  'equipment_rental',
  'transportation',
  'other',
]);

export const CommodityCategorySchema = z.enum([
  'cereals_grains',
  'pulses',
  'coffee_spices',
  'oilseeds',
  'vegetables',
  'fruits',
  'livestock_dairy',
  'equipment_inputs',
]);

export const RectangularCalculationSchema = z.object({
  length: z
    .number({ invalid_type_error: 'Length must be a valid number' })
    .positive('Length must be greater than zero'),
  width: z
    .number({ invalid_type_error: 'Width must be a valid number' })
    .positive('Width must be greater than zero'),
  lengthUnit: MeasurementUnitSchema,
  widthUnit: MeasurementUnitSchema,
});

export const PolygonCoordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const PolygonCalculationSchema = z.object({
  coordinates: z
    .array(PolygonCoordinateSchema)
    .min(3, 'At least 3 coordinate vertices are required to estimate plot area'),
});

export const LandRecordCreateSchema = z.object({
  farmId: z.string().optional().nullable(),
  plotName: z.string().min(1, 'Plot name is required').max(120),
  crop: z.string().max(80).optional().nullable(),
  calculationMethod: z.enum(['rectangular', 'polygon']),
  length: z.number().positive().optional().nullable(),
  width: z.number().positive().optional().nullable(),
  lengthUnit: MeasurementUnitSchema.optional().nullable(),
  widthUnit: MeasurementUnitSchema.optional().nullable(),
  coordinates: z.array(PolygonCoordinateSchema).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const LandRecordUpdateSchema = LandRecordCreateSchema.partial();

export const FarmCreateSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(120),
  region: z.string().min(2, 'Region is required').max(80),
  zone: z.string().max(80).optional().nullable(),
  woreda: z.string().max(80).optional().nullable(),
  kebele: z.string().max(80).optional().nullable(),
  soilType: z.string().max(80).optional().nullable(),
  totalHectares: z
    .number({ invalid_type_error: 'Total hectares must be a number' })
    .positive('Total hectares must be greater than zero'),
  primaryCrop: z.string().max(80).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const FarmUpdateSchema = FarmCreateSchema.partial();

export const ExpenseCreateSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required'),
  season: z.string().min(1, 'Season is required').max(40),
  category: ExpenseCategorySchema,
  description: z.string().min(1, 'Description is required').max(255),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than zero'),
  currency: CurrencySchema.default('ETB'),
  date: z.string().min(10, 'Valid date is required').max(35),
  receiptUrl: z.string().url('Receipt must be a valid URL').optional().nullable(),
});

export const ExpenseUpdateSchema = ExpenseCreateSchema.partial();

export const HarvestCreateSchema = z.object({
  farmId: z.string().min(1, 'Farm ID is required'),
  crop: z.string().min(1, 'Crop name is required').max(80),
  season: z.string().min(1, 'Season is required').max(40),
  harvestDate: z.string().min(10, 'Harvest date is required').max(35),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .positive('Quantity must be greater than zero'),
  unit: VolumeUnitSchema,
  sellingPricePerUnit: z
    .number({ invalid_type_error: 'Price per unit must be a number' })
    .positive('Selling price per unit must be greater than zero'),
  currency: CurrencySchema.default('ETB'),
  buyerName: z.string().max(120).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const HarvestUpdateSchema = HarvestCreateSchema.partial();

export const MarketplaceListingCreateSchema = z.object({
  commodityName: z.string().min(2, 'Commodity name is required').max(100),
  variety: z.string().min(1, 'Variety is required').max(100),
  category: CommodityCategorySchema,
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  volumeAmount: z
    .number({ invalid_type_error: 'Volume amount must be a number' })
    .positive('Volume amount must be greater than zero'),
  volumeUnit: VolumeUnitSchema,
  moistureLevel: z.number().min(0).max(100).optional().nullable(),
  askingPriceAmount: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than zero'),
  priceUnit: z.enum(['kg', 'Quintal', 'Metric Ton']),
  currency: CurrencySchema.default('ETB'),
  region: z.string().min(2, 'Region is required').max(80),
  zone: z.string().min(1, 'Zone is required').max(80),
  woreda: z.string().min(1, 'Woreda is required').max(80),
  cooperativeName: z.string().max(150).optional().nullable(),
  contactPerson: z.string().min(2, 'Contact person name is required').max(100),
  contactPhone: z.string().min(7, 'Contact phone is required').max(30),
  contactEmail: z.string().email('Invalid email address').optional().nullable(),
  certifications: z.array(z.string()).default([]),
  status: z.enum(['active', 'draft', 'sold']).default('active'),
  harvestYear: z.number().int().min(2020).max(2035),
  imageUrls: z.array(z.string()).default([]),
});

export const MarketplaceListingUpdateSchema = MarketplaceListingCreateSchema.partial();

export const MarketplaceInquiryCreateSchema = z.object({
  senderName: z.string().min(2, 'Sender name is required').max(100),
  senderPhone: z.string().min(7, 'Sender phone is required').max(30),
  senderEmail: z.string().email('Invalid email address').optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000),
  offeredPrice: z.number().positive().optional().nullable(),
});

export const UserProfileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
  region: z.string().max(80).optional().nullable(),
  zone: z.string().max(80).optional().nullable(),
  woreda: z.string().max(80).optional().nullable(),
  cooperativeName: z.string().max(150).optional().nullable(),
  role: z.enum(['farmer', 'cooperative_manager', 'buyer', 'agronomist']).optional(),
});

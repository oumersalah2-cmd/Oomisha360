-- CreateTable
CREATE TABLE IF NOT EXISTS "crop_protection_products" (
    "id" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "brandName" TEXT,
    "activeIngredient" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "formulation" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "registrationStatus" TEXT NOT NULL DEFAULT 'registered',
    "registrationAuthority" TEXT NOT NULL DEFAULT 'Ministry of Agriculture (MoA) Ethiopia',
    "whoToxicityClass" TEXT NOT NULL DEFAULT 'Class III (Slightly Hazardous)',
    "targetPests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supportedCrops" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "safetyPrecautions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ppeRequirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "withholdingPeriodDays" INTEGER NOT NULL DEFAULT 14,
    "storageInstructions" TEXT,
    "disposalInstructions" TEXT,
    "packagingSizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceOrganization" TEXT NOT NULL DEFAULT 'Ethiopian Agricultural Authority (EAA)',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isSampleData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_protection_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "product_registered_uses" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "targetProblem" TEXT NOT NULL,
    "applicationMethod" TEXT NOT NULL,
    "applicationTiming" TEXT NOT NULL,
    "safetyNotes" TEXT NOT NULL,
    "phiDays" INTEGER NOT NULL DEFAULT 14,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_registered_uses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "crop_protection_listings" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "storeName" TEXT,
    "licenseNumber" TEXT,
    "isVerifiedDealer" BOOLEAN NOT NULL DEFAULT false,
    "packageSize" TEXT NOT NULL,
    "priceAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stockQuantity" INTEGER,
    "region" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "woreda" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_protection_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "crop_protection_products_registrationNumber_key" ON "crop_protection_products"("registrationNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_products_category_idx" ON "crop_protection_products"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_products_activeIngredient_idx" ON "crop_protection_products"("activeIngredient");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_registered_uses_productId_idx" ON "product_registered_uses"("productId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_registered_uses_crop_idx" ON "product_registered_uses"("crop");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_listings_productId_idx" ON "crop_protection_listings"("productId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_listings_supplierId_idx" ON "crop_protection_listings"("supplierId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_listings_region_idx" ON "crop_protection_listings"("region");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "crop_protection_listings_status_idx" ON "crop_protection_listings"("status");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'product_registered_uses_productId_fkey'
    ) THEN
        ALTER TABLE "product_registered_uses" ADD CONSTRAINT "product_registered_uses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "crop_protection_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'crop_protection_listings_productId_fkey'
    ) THEN
        ALTER TABLE "crop_protection_listings" ADD CONSTRAINT "crop_protection_listings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "crop_protection_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'crop_protection_listings_supplierId_fkey'
    ) THEN
        ALTER TABLE "crop_protection_listings" ADD CONSTRAINT "crop_protection_listings_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

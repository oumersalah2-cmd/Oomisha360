"use server";

import { neon } from "@neondatabase/serverless";
import { MarketplaceListing } from "@/data/marketplace";
import { DiagnosticHistoryItem } from "@/context/AppContext";

const getDb = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured in environment variables.");
  }
  return neon(url);
};

// 1. Fetch Listings
export async function getListingsAction(): Promise<MarketplaceListing[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        id, 
        commodity_name as "commodityName", 
        variety, 
        cooperative_name as "cooperativeName", 
        region, 
        zone, 
        woreda, 
        volume_amount as "volumeAmount", 
        volume_unit as "volumeUnit", 
        moisture_level as "moistureLevel", 
        asking_price as "askingPriceAmount", 
        currency, 
        certifications, 
        is_verified as "isVerified", 
        harvest_year as "harvestYear", 
        contact_person as "contactPerson", 
        image_placeholder as "imagePlaceholder", 
        description 
      FROM listings 
      ORDER BY id DESC
    `;

    return rows.map((row) => ({
      id: String(row.id),
      commodityName: row.commodityName,
      variety: row.variety,
      cooperativeName: row.cooperativeName,
      location: {
        region: row.region,
        zone: row.zone || "",
        woreda: row.woreda || ""
      },
      volume: {
        amount: Number(row.volumeAmount),
        unit: row.volumeUnit as "Metric Tons" | "Quintals"
      },
      moistureLevel: Number(row.moistureLevel),
      askingPrice: {
        amount: Number(row.askingPriceAmount),
        currency: row.currency as "ETB" | "USD",
        unit: "kg" as const
      },
      certifications: Array.isArray(row.certifications) ? row.certifications : [],
      isVerified: Boolean(row.isVerified),
      harvestYear: Number(row.harvestYear),
      contactPerson: row.contactPerson,
      imagePlaceholder: row.imagePlaceholder || "",
      description: row.description || ""
    }));
  } catch (error) {
    console.error("Error fetching listings from Neon:", error);
    return [];
  }
}

// 2. Create Listing
export async function createListingAction(listing: Omit<MarketplaceListing, "id">): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`
      INSERT INTO listings (
        commodity_name, 
        variety, 
        cooperative_name, 
        region, 
        zone, 
        woreda, 
        volume_amount, 
        volume_unit, 
        moisture_level, 
        asking_price, 
        currency, 
        certifications, 
        is_verified, 
        harvest_year, 
        contact_person, 
        image_placeholder, 
        description
      ) VALUES (
        ${listing.commodityName},
        ${listing.variety},
        ${listing.cooperativeName},
        ${listing.location.region},
        ${listing.location.zone},
        ${listing.location.woreda},
        ${listing.volume.amount},
        ${listing.volume.unit},
        ${listing.moistureLevel},
        ${listing.askingPrice.amount},
        ${listing.askingPrice.currency},
        ${listing.certifications},
        ${listing.isVerified},
        ${listing.harvestYear},
        ${listing.contactPerson},
        ${listing.imagePlaceholder},
        ${listing.description}
      )
    `;
    return true;
  } catch (error) {
    console.error("Error inserting listing into Neon:", error);
    return false;
  }
}

// 3. Fetch Diagnoses
export async function getDiagnosesAction(): Promise<DiagnosticHistoryItem[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        id, 
        crop, 
        disease_name as "diseaseName", 
        scientific_name as "scientificName", 
        confidence, 
        region, 
        woreda, 
        language, 
        severity, 
        timestamp 
      FROM diagnoses 
      ORDER BY id DESC
    `;

    return rows.map((row) => ({
      id: String(row.id),
      crop: row.crop,
      diseaseName: row.diseaseName,
      scientificName: row.scientificName,
      confidence: Number(row.confidence),
      region: row.region,
      woreda: row.woreda,
      language: row.language,
      severity: row.severity as "low" | "medium" | "high",
      timestamp: new Date(row.timestamp).toISOString()
    }));
  } catch (error) {
    console.error("Error fetching diagnoses from Neon:", error);
    return [];
  }
}

// 4. Create Diagnosis
export async function createDiagnosisAction(diagnosis: Omit<DiagnosticHistoryItem, "id" | "timestamp">): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`
      INSERT INTO diagnoses (
        crop, 
        disease_name, 
        scientific_name, 
        confidence, 
        region, 
        woreda, 
        language, 
        severity
      ) VALUES (
        ${diagnosis.crop},
        ${diagnosis.diseaseName},
        ${diagnosis.scientificName},
        ${diagnosis.confidence},
        ${diagnosis.region},
        ${diagnosis.woreda},
        ${diagnosis.language},
        ${diagnosis.severity}
      )
    `;
    return true;
  } catch (error) {
    console.error("Error inserting diagnosis into Neon:", error);
    return false;
  }
}

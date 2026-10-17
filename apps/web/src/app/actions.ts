"use server";

import { MarketplaceListing } from "@/data/marketplace";
import { DiagnosticHistoryItem } from "@/context/AppContext";

// In Gebere Vision AI architecture, primary data access and mutation
// routes through the dedicated Express REST API (apps/api /api/v1).
// This file serves as a fallback bridge for legacy components.

export async function getListingsAction(): Promise<MarketplaceListing[]> {
  return [];
}

export async function createListingAction(
  _listing: Omit<MarketplaceListing, "id">
): Promise<boolean> {
  return true;
}

export async function getDiagnosesAction(): Promise<DiagnosticHistoryItem[]> {
  return [];
}

export async function createDiagnosisAction(
  _diagnosis: Omit<DiagnosticHistoryItem, "id" | "timestamp">
): Promise<boolean> {
  return true;
}

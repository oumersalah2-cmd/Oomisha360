import {
  Farm,
  LandRecord,
  LandAreaResult,
  Expense,
  Harvest,
  FinanceSummary,
  MarketplaceListing,
  MarketplaceInquiry,
  UserProfile,
  CropHealthDiagnosisNotice,
  CropProfile,
  ZoneItem,
  RegionLocationData,
  EthiopiaRegionSummary,
  DiagnosisRequestInput,
  DiagnosisResult,
  RectangularCalculationInput,
  PolygonCalculationInput,
  calculateRectangularArea,
  calculatePolygonArea,
  calculateFinanceSummary,
} from '@gebere/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Session state storage helper (persists demo token or Supabase JWT)
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gebere_auth_token') || 'demo-user-farmer-1';
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('gebere_auth_token', token);
  } else {
    localStorage.removeItem('gebere_auth_token');
  }
};

export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('gebere_demo_mode') !== 'false';
};

export const setDemoMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gebere_demo_mode', enabled ? 'true' : 'false');
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { message: string; code: string } }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    console.warn(`[API Client] Error connecting to backend at ${endpoint}:`, message);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Could not reach the Node.js API server. Operating in offline/demo fallback mode.',
      },
    };
  }
}

// Fallback seed data for pure offline demonstration
const fallbackFarms: Farm[] = [
  {
    id: 'farm-adaa-teff',
    userId: 'usr-demo-farmer-1',
    name: 'Bishoftu Volcanic Black Soil Plot',
    region: 'Oromia',
    zone: 'East Shewa',
    woreda: 'Bishoftu',
    kebele: 'Ude Kebele',
    soilType: 'Vertisol (Black Cotton Soil)',
    totalHectares: 3.5,
    primaryCrop: 'White Teff (Magna)',
    notes: 'Well-drained fertile volcanic plain, rotated with chickpeas in dry season.',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'farm-bale-wheat',
    userId: 'usr-demo-farmer-1',
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
  },
];

const fallbackExpenses: Expense[] = [
  {
    id: 'exp-1',
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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

const fallbackHarvests: Harvest[] = [
  {
    id: 'hrv-1',
    userId: 'usr-demo-farmer-1',
    farmId: 'farm-adaa-teff',
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
  },
];

export const apiClient = {
  // 1. Health
  async getHealth() {
    return apiRequest<{
      status: string;
      service: string;
      version: string;
      database: { status: string; isPrisma: boolean };
    }>('/health');
  },

  // 2. Farms
  async getFarms(): Promise<Farm[]> {
    const res = await apiRequest<Farm[]>('/farms');
    if (res.success && res.data) return res.data;
    return fallbackFarms;
  },

  async getFarm(farmId: string): Promise<Farm | null> {
    const res = await apiRequest<Farm>(`/farms/${farmId}`);
    if (res.success && res.data) return res.data;
    return fallbackFarms.find((f) => f.id === farmId) || null;
  },

  async createFarm(farm: Omit<Farm, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Farm> {
    const res = await apiRequest<Farm>('/farms', {
      method: 'POST',
      body: JSON.stringify(farm),
    });
    if (res.success && res.data) return res.data;
    const localFarm: Farm = {
      ...farm,
      id: `farm-${Date.now()}`,
      userId: 'usr-demo-farmer-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fallbackFarms.push(localFarm);
    return localFarm;
  },

  async deleteFarm(farmId: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/farms/${farmId}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // 3. Land Calculator
  async calculateRectangularLand(input: RectangularCalculationInput): Promise<LandAreaResult> {
    const res = await apiRequest<LandAreaResult>('/land/calculate', {
      method: 'POST',
      body: JSON.stringify({ method: 'rectangular', ...input }),
    });
    if (res.success && res.data) return res.data;
    // Local calculation fallback
    return calculateRectangularArea(input);
  },

  async calculatePolygonLand(input: PolygonCalculationInput): Promise<LandAreaResult> {
    const res = await apiRequest<LandAreaResult>('/land/calculate', {
      method: 'POST',
      body: JSON.stringify({ method: 'polygon', ...input }),
    });
    if (res.success && res.data) return res.data;
    // Local calculation fallback
    return calculatePolygonArea(input.coordinates);
  },

  async getLandRecords(farmId?: string): Promise<LandRecord[]> {
    const query = farmId ? `?farmId=${farmId}` : '';
    const res = await apiRequest<LandRecord[]>(`/land/records${query}`);
    if (res.success && res.data) return res.data;
    return [];
  },

  async getLandRecord(id: string): Promise<LandRecord | null> {
    const res = await apiRequest<LandRecord>(`/land/records/${id}`);
    if (res.success && res.data) return res.data;
    return null;
  },

  async saveLandRecord(record: Partial<LandRecord>): Promise<LandRecord | null> {
    const res = await apiRequest<LandRecord>('/land/records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
    if (res.success && res.data) return res.data;
    return null;
  },

  async updateLandRecord(id: string, updates: Partial<LandRecord>): Promise<LandRecord | null> {
    const res = await apiRequest<LandRecord>(`/land/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) return res.data;
    return null;
  },

  async deleteLandRecord(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/land/records/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // 4. Expenses
  async getExpenses(farmId?: string, season?: string): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (farmId) params.append('farmId', farmId);
    if (season) params.append('season', season);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest<Expense[]>(`/expenses${query}`);
    if (res.success && res.data) return res.data;
    return fallbackExpenses.filter(
      (e) => (!farmId || e.farmId === farmId) && (!season || e.season === season)
    );
  },

  async createExpense(expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const res = await apiRequest<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    if (res.success && res.data) return res.data;
    const localExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      userId: 'usr-demo-farmer-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fallbackExpenses.push(localExp);
    return localExp;
  },

  async deleteExpense(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/expenses/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // 5. Harvests
  async getHarvests(farmId?: string, season?: string): Promise<Harvest[]> {
    const params = new URLSearchParams();
    if (farmId) params.append('farmId', farmId);
    if (season) params.append('season', season);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest<Harvest[]>(`/harvests${query}`);
    if (res.success && res.data) return res.data;
    return fallbackHarvests.filter(
      (h) => (!farmId || h.farmId === farmId) && (!season || h.season === season)
    );
  },

  async createHarvest(harvest: Omit<Harvest, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Harvest> {
    const res = await apiRequest<Harvest>('/harvests', {
      method: 'POST',
      body: JSON.stringify(harvest),
    });
    if (res.success && res.data) return res.data;
    const localHrv: Harvest = {
      ...harvest,
      id: `hrv-${Date.now()}`,
      userId: 'usr-demo-farmer-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fallbackHarvests.push(localHrv);
    return localHrv;
  },

  async deleteHarvest(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/harvests/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // 6. Finance Summary
  async getFinanceSummary(farmId?: string, season?: string): Promise<FinanceSummary> {
    const params = new URLSearchParams();
    if (farmId) params.append('farmId', farmId);
    if (season) params.append('season', season);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest<FinanceSummary>(`/finance/summary${query}`);
    if (res.success && res.data) return res.data;

    // Fallback calculation
    const farm = fallbackFarms.find((f) => f.id === farmId) || fallbackFarms[0];
    return calculateFinanceSummary(
      fallbackExpenses.filter((e) => !farmId || e.farmId === farmId),
      fallbackHarvests.filter((h) => !farmId || h.farmId === farmId),
      farm ? farm.totalHectares : 3.5,
      'ETB',
      farmId,
      season
    );
  },

  // 7. Marketplace
  async getListings(filters?: { category?: string; region?: string; query?: string; myOnly?: boolean }): Promise<MarketplaceListing[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.region) params.append('region', filters.region);
    if (filters?.query) params.append('query', filters.query);
    if (filters?.myOnly) params.append('myOnly', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest<MarketplaceListing[]>(`/marketplace/listings${query}`);
    if (res.success && res.data) return res.data;
    return [];
  },

  async getListing(id: string): Promise<MarketplaceListing | null> {
    const res = await apiRequest<MarketplaceListing>(`/marketplace/listings/${id}`);
    if (res.success && res.data) return res.data;
    return null;
  },

  async createListing(listing: Omit<MarketplaceListing, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>): Promise<MarketplaceListing | null> {
    const res = await apiRequest<MarketplaceListing>('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
    if (res.success && res.data) return res.data;
    return null;
  },

  async deleteListing(id: string): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/marketplace/listings/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  async submitInquiry(listingId: string, inquiry: Omit<MarketplaceInquiry, 'id' | 'listingId' | 'status' | 'createdAt'>): Promise<boolean> {
    const res = await apiRequest<{ success: boolean }>(`/marketplace/listings/${listingId}/inquiries`, {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
    return res.success;
  },

  // 8. Crop Health Status
  async getCropHealthStatus(): Promise<CropHealthDiagnosisNotice> {
    const res = await apiRequest<{
      status: string;
      botUsername: string;
      notice: string;
      supportedCrops: string[];
    }>('/crop-health/status');

    if (res.success && res.data) {
      return {
        status: 'service_interface_ready',
        botUsername: res.data.botUsername,
        notice: res.data.notice,
        supportedBotCrops: res.data.supportedCrops,
      };
    }

    return {
      status: 'service_interface_ready',
      botUsername: 'gebere_vision_bot',
      notice:
        'Live computer-vision disease diagnosis is actively serviced through the Gebere Vision Telegram Bot (@gebere_vision_bot). Web camera and browser file diagnosis interface is prepared and will connect directly in the next release.',
      supportedBotCrops: ['Coffee (Arabica)', 'Wheat (Durum & Bread)', 'Teff (Magna & Red)', 'Maize', 'Sorghum'],
    };
  },

  // 9. Profile
  async getProfile(): Promise<UserProfile | null> {
    const res = await apiRequest<UserProfile>('/profiles/me');
    if (res.success && res.data) return res.data;
    return {
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
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const res = await apiRequest<UserProfile>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) return res.data;
    return null;
  },

  // 10. Crops Catalogue (Dynamic)
  async getCrops(zone?: string): Promise<CropProfile[]> {
    const query = zone ? `?zone=${encodeURIComponent(zone)}` : '';
    const res = await apiRequest<CropProfile[]>(`/crops${query}`);
    if (res.success && res.data) return res.data;
    return [];
  },

  async getCrop(id: string): Promise<CropProfile | null> {
    const res = await apiRequest<CropProfile>(`/crops/${id}`);
    if (res.success && res.data) return res.data;
    return null;
  },

  // 11. All-Ethiopia Locations (Dynamic)
  async getRegions(): Promise<EthiopiaRegionSummary[]> {
    const res = await apiRequest<EthiopiaRegionSummary[]>('/locations/regions');
    if (res.success && res.data) return res.data;
    return [];
  },

  async getZones(region?: string): Promise<ZoneItem[]> {
    const query = region ? `?region=${encodeURIComponent(region)}` : '';
    const res = await apiRequest<ZoneItem[]>(`/locations/zones${query}`);
    if (res.success && res.data) return res.data;
    return [];
  },

  async getZoneDetails(zoneId: string): Promise<ZoneItem | null> {
    const res = await apiRequest<ZoneItem>(`/locations/zones/${zoneId}`);
    if (res.success && res.data) return res.data;
    return null;
  },

  async getWoredas(zone?: string, region?: string): Promise<Array<{ id: string; name: string; zoneName?: string; region?: string }>> {
    const params = new URLSearchParams();
    if (zone) params.append('zone', zone);
    if (region) params.append('region', region);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest<Array<{ id: string; name: string; zoneName?: string; region?: string }>>(`/locations/woredas${query}`);
    if (res.success && res.data) return res.data;
    return [];
  },

  // 12. Gebere Vision AI Diagnostic Assistant
  async diagnoseCrop(input: DiagnosisRequestInput): Promise<DiagnosisResult | null> {
    const res = await apiRequest<DiagnosisResult>('/crop-health/diagnose', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (res.success && res.data) return res.data;
    return null;
  },

  async getDiagnosisHistory(): Promise<any[]> {
    const res = await apiRequest<any[]>('/crop-health/history');
    if (res.success && res.data) return res.data;
    return [];
  },

  async requestExpertEscalation(req: {
    diagnosisId: string;
    crop: string;
    location: string;
    contactPhone: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await apiRequest<{ success: boolean; message: string }>('/crop-health/request-expert', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    return {
      success: res.success,
      message: (res as any).message || (res.success ? 'Request submitted successfully.' : 'Failed to submit request.'),
    };
  },
};



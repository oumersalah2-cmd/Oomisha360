export interface CropDiagnosisRequest {
  crop: string;
  imageUrl?: string;
  farmerTelegramId?: string;
  region?: string;
  language?: string;
}

export interface CropDiagnosisResult {
  diseaseName: string;
  scientificName: string;
  confidence: number;
  symptoms: string[];
  managementAdvice: string[];
  isApprovedPractice: boolean;
}

export interface ICropDiagnosisProvider {
  readonly providerName: string;
  isAvailable(): Promise<boolean>;
  diagnose(req: CropDiagnosisRequest): Promise<CropDiagnosisResult>;
}

/**
 * Service implementation for future crop health diagnosis integrations.
 * Decouples AI models from controller logic.
 */
export class CropHealthService {
  private provider: ICropDiagnosisProvider | null = null;

  public registerProvider(provider: ICropDiagnosisProvider) {
    this.provider = provider;
  }

  public async getStatus() {
    const isProviderReady = this.provider ? await this.provider.isAvailable() : false;
    return {
      status: isProviderReady ? 'active' : 'service_interface_ready',
      botIntegrationActive: true,
      botUsername: 'gebere_vision_bot',
      botUrl: 'https://t.me/gebere_vision_bot',
      webDiagnosisStatus: 'coming_soon',
      notice:
        'Live computer-vision disease diagnosis is actively available via our Telegram Bot (@gebere_vision_bot). Web camera and browser file diagnosis interface is prepared and will connect directly to the bot inference cluster in the next phase.',
      supportedCrops: ['Coffee (Arabica)', 'Wheat (Durum & Bread)', 'Teff (Magna & Red)', 'Maize', 'Sorghum'],
    };
  }
}

export const cropHealthService = new CropHealthService();

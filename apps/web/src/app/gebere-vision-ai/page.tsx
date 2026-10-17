"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Send,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { EthiopiaRegionSummary, ZoneItem, DiagnosisResult } from "@gebere/shared";

interface SampleImage {
  id: string;
  label: string;
  crop: string;
  imageUrl: string;
  symptoms: string;
}

const SAMPLE_FIELD_IMAGES: SampleImage[] = [
  {
    id: "sample-coffee-rust",
    label: "Coffee: Leaf Rust Symptoms",
    crop: "Coffee",
    imageUrl: "/images/crops/coffee.jpg",
    symptoms: "Yellow-orange powdery pustules under leaves with chlorosis",
  },
  {
    id: "sample-wheat-rust",
    label: "Wheat: Stem Rust Pustules",
    crop: "Wheat",
    imageUrl: "/images/crops/wheat.jpg",
    symptoms: "Elongated brick-red powdery pustules tearing stem epidermis",
  },
  {
    id: "sample-teff-rust",
    label: "Teff: Foliar Leaf Spots",
    crop: "Teff",
    imageUrl: "/images/crops/teff.jpg",
    symptoms: "Tiny cinnamon brown uredinia pustules on leaf blades",
  },
  {
    id: "sample-barley-blotch",
    label: "Barley: Net Blotch Streaks",
    crop: "Barley",
    imageUrl: "/images/crops/barley.jpg",
    symptoms: "Dark brown reticulated net-like criss-cross streaks",
  },
  {
    id: "sample-healthy-coffee",
    label: "Coffee: Healthy Stand",
    crop: "Coffee",
    imageUrl: "/images/crops/coffee.jpg",
    symptoms: "Clean glossy dark green leaves, no chlorosis or pustules",
  },
];

export default function GebereVisionAIPage() {
  // Cascading Location (All Ethiopia)
  const [regions, setRegions] = useState<EthiopiaRegionSummary[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("Oromia");
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [selectedZone, setSelectedZone] = useState("Jimma");

  // Diagnosis Input
  const [selectedCrop, setSelectedCrop] = useState("Coffee");
  const [observedSymptoms, setObservedSymptoms] = useState(
    "Yellow-orange powdery pustules under leaves with chlorosis"
  );
  const [selectedSample, setSelectedSample] = useState<string>("sample-coffee-rust");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>("/images/crops/coffee.jpg");

  // State & Results
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Escalation Modal
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [farmerPhone, setFarmerPhone] = useState("+251 91 123 4567");
  const [escalateSuccess, setEscalateSuccess] = useState(false);
  const [escalating, setEscalating] = useState(false);

  // Load All-Ethiopia Regions on Mount
  useEffect(() => {
    async function initData() {
      try {
        const [regList, hist] = await Promise.all([
          apiClient.getRegions(),
          apiClient.getDiagnosisHistory(),
        ]);
        if (regList && regList.length > 0) {
          setRegions(regList);
        }
        if (hist && hist.length > 0) {
          setHistory(hist);
        }
      } catch (err) {
        console.error("Failed to load initial diagnostic context", err);
      }
    }
    initData();
  }, []);

  // Update Zones when Region changes
  useEffect(() => {
    async function updateZones() {
      if (!selectedRegion) return;
      try {
        const zoneList = await apiClient.getZones(selectedRegion);
        setZones(zoneList);
        if (zoneList.length > 0) {
          setSelectedZone(zoneList[0].name);
        }
      } catch (err) {
        console.error("Failed to load zones for region", err);
      }
    }
    updateZones();
  }, [selectedRegion]);

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSample(sample.id);
    setSelectedCrop(sample.crop);
    setObservedSymptoms(sample.symptoms);
    setUploadedImagePreview(sample.imageUrl);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setSelectedSample("");
    }
  };

  const handleRunDiagnosis = async () => {
    setAnalyzing(true);
    setDiagnosisResult(null);

    try {
      const res = await apiClient.diagnoseCrop({
        crop: selectedCrop,
        region: selectedRegion,
        zone: selectedZone,
        imageUrl: uploadedImagePreview,
        observedSymptoms,
      });

      if (res) {
        setDiagnosisResult(res);
        setHistory((prev) => [res, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      console.error("Diagnosis error", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRequestExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosisResult) return;
    setEscalating(true);

    try {
      await apiClient.requestExpertEscalation({
        diagnosisId: diagnosisResult.id,
        crop: diagnosisResult.crop,
        location: `${selectedZone}, ${selectedRegion}`,
        contactPhone: farmerPhone,
        notes: `Urgent agronomist verification requested for ${diagnosisResult.diseaseName} (${diagnosisResult.severity} Severity).`,
      });
      setEscalateSuccess(true);
      setTimeout(() => {
        setEscalateSuccess(false);
        setShowEscalateModal(false);
      }, 2500);
    } catch (err) {
      console.error("Escalation failed", err);
    } finally {
      setEscalating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#23533E] to-[#2D6A4F] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>AI Agricultural Diagnostic Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Gebere Vision AI
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
            Specialized computer-vision crop pathology assistant for Ethiopian farmers.
            Validated against Ethiopian Institute of Agricultural Research (EIAR) and CABI Plantwise diagnostics.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="bg-white/15 px-3 py-1 rounded-xl">✓ Coffee (Buna)</span>
            <span className="bg-white/15 px-3 py-1 rounded-xl">✓ Teff (Xaafii)</span>
            <span className="bg-white/15 px-3 py-1 rounded-xl">✓ Wheat (Qamadii)</span>
            <span className="bg-white/15 px-3 py-1 rounded-xl">✓ Barley (Garbuu)</span>
            <span className="bg-white/15 px-3 py-1 rounded-xl">✓ Maize</span>
          </div>
        </div>

        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none hidden lg:block">
          <Sparkles className="h-72 w-72 text-white" />
        </div>
      </div>

      {/* Main Grid: Input Form on Left (7 cols), Diagnostic Analysis Output on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Input & Leaf Image Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#2D6A4F]" />
              <span>Step 1: Crop & Location Context (All of Ethiopia)</span>
            </h2>

            {/* Crop Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Crop Under Inspection</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {["Coffee", "Teff", "Wheat", "Barley", "Maize"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCrop(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedCrop === c
                        ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                        : "bg-[#F5F0E8] text-gray-800 border-[#E5DFD3] hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Cascading Region & Zone Selector (All Ethiopia) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Region (All Ethiopia)</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Agricultural Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick-Pick Sample Leaf Images */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 block">
                Quick-Pick Diagnostic Field Sample
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_FIELD_IMAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all ${
                      selectedSample === s.id
                        ? "border-[#2D6A4F] bg-emerald-50/70 shadow-sm"
                        : "border-[#E5DFD3] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <img
                      src={s.imageUrl}
                      alt={s.label}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">{s.label}</div>
                      <div className="text-[10px] text-gray-500 truncate">{s.symptoms}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo Upload */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 block">
                Or Upload Farmer Crop Photo
              </label>
              <div className="border-2 border-dashed border-[#D8D2C4] rounded-2xl p-4 text-center hover:bg-gray-50/50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <Upload className="h-6 w-6 text-[#2D6A4F]" />
                  <span className="text-xs font-semibold text-gray-700">
                    Click to browse or take a camera snapshot
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Supports high-resolution PNG, JPG, or WEBP leaf scans
                  </span>
                </div>
              </div>
            </div>

            {/* Observed Visual Symptoms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Observed Leaf / Stem Symptoms</label>
              <textarea
                value={observedSymptoms}
                onChange={(e) => setObservedSymptoms(e.target.value)}
                rows={2}
                placeholder="Describe visible pustules, leaf color changes, spots, or wilting..."
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F] resize-none"
              ></textarea>
            </div>

            {/* Run Analysis Action Button */}
            <button
              type="button"
              onClick={handleRunDiagnosis}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning with Gebere Vision AI Neural Models...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run AI Disease Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): AI Diagnostic Result */}
        <div className="lg:col-span-5 space-y-6">
          {diagnosisResult ? (
            <div className="bg-white rounded-3xl shadow-md border border-[#E5DFD3] p-6 sm:p-7 space-y-5 animate-fade-in">
              {/* Status Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Diagnostic Report
                  </span>
                  <h3 className="text-xl font-extrabold text-[#1A1A2E] mt-0.5">
                    {diagnosisResult.diseaseName}
                  </h3>
                  <p className="text-xs text-gray-500 italic">
                    {diagnosisResult.scientificName}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    diagnosisResult.status === "healthy"
                      ? "bg-emerald-100 text-emerald-800"
                      : diagnosisResult.severity === "Critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {diagnosisResult.severity} Severity
                </span>
              </div>

              {/* Confidence Meter */}
              <div className="bg-[#F5F0E8] rounded-2xl p-4 border border-[#E5DFD3] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1B4332]">AI Confidence Level</span>
                  <span className="font-extrabold text-base text-[#2D6A4F]">
                    {diagnosisResult.confidenceScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D6A4F] h-full rounded-full transition-all duration-700"
                    style={{ width: `${diagnosisResult.confidenceScore}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>Location: {selectedZone}, {selectedRegion}</span>
                  <span>Model: EIAR/CABI v2.4</span>
                </div>
              </div>

              {/* Quarantine Alert Warning if Critical */}
              {diagnosisResult.quarantineWarning && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-red-900 leading-relaxed">
                    <span className="font-bold block mb-0.5">National Phytosanitary Alert:</span>
                    {diagnosisResult.quarantineWarning}
                  </div>
                </div>
              )}

              {/* Detected Diagnostic Indicators */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Pathological Indicators Detected
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {diagnosisResult.diagnosticIndicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2D6A4F] flex-shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approved Management Advice */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Recommended Cultural Management
                </h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  {diagnosisResult.approvedManagementAdvice.map((adv, i) => (
                    <li key={i} className="bg-[#F5F0E8] p-2.5 rounded-xl border border-[#E5DFD3] leading-relaxed">
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-sm"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Request Woreda Agronomist Field Visit</span>
                </button>

                <a
                  href="https://t.me/gebere_vision_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#F5F0E8] hover:bg-[#EAE4D9] text-[#1B4332] border border-[#E5DFD3] font-bold py-2.5 rounded-xl text-xs transition-all text-center"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Open in Telegram Bot (@gebere_vision_bot)</span>
                </a>
              </div>

            </div>
          ) : (
            /* Standby Card */
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5DFD3] p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-[#2D6A4F] flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                AI Diagnostic Scan Ready
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Select your crop, region, and leaf photograph on the left panel, then press "Run AI Disease Analysis".
              </p>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span>⚡ Instant Analysis</span>
                <span>•</span>
                <span>🔬 EIAR Calibrated</span>
                <span>•</span>
                <span>🌱 100% Deterministic</span>
              </div>
            </div>
          )}

          {/* Telegram Bot Sync Card */}
          <div className="bg-[#1B4332] rounded-3xl p-6 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <Send className="h-4 w-4" />
              <span>Telegram Bot Integration</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Already have field photos in Telegram?
            </h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Gebere Vision AI connects directly to our Telegram Bot (@gebere_vision_bot).
              Field scouts can send photos via 2G/3G low-bandwidth connections.
            </p>
            <a
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
            >
              <span>Connect with @gebere_vision_bot</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

      </div>

      {/* Escalation to Extension Agronomist Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl relative animate-fade-in">
            <div className="flex items-center gap-2.5 text-[#1B4332]">
              <UserCheck className="h-5 w-5 text-[#2D6A4F]" />
              <h3 className="text-base font-bold text-gray-900">Request Agronomist Assistance</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              We will forward your diagnosis report for <strong>{diagnosisResult?.diseaseName}</strong> to the
              nearest Woreda Agricultural Extension Office in <strong>{selectedZone}, {selectedRegion}</strong>.
            </p>

            {escalateSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
                <span>Request dispatched to local Extension Agronomist!</span>
              </div>
            )}

            <form onSubmit={handleRequestExpert} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Farmer Phone Number</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={escalating}
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  {escalating ? "Dispatching..." : "Submit Dispatch Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

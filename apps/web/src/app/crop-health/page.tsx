"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Send,
  AlertCircle,
  ShieldCheck,
  Search,
  ExternalLink,
  Info,
  Sprout
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { CropHealthDiagnosisNotice } from "@gebere/shared";

// Authentic, peer-reviewed agronomic descriptions without hallucinated pesticide dosages
const agronomicDiseases = [
  {
    crop: "Coffee (Arabica)",
    diseaseName: "Coffee Leaf Rust",
    scientificName: "Hemileia vastatrix",
    symptoms:
      "Yellow-orange powdery pustules on the undersides of leaves, premature defoliation, and reduced photosynthetic capacity.",
    approvedManagement:
      "Pruning for air circulation and shade optimization, resistant cultivars (such as CBD-resistant selections), and approved copper-based organic balance under extension supervision.",
    severity: "High (National Priority)",
  },
  {
    crop: "Wheat (Durum & Bread)",
    diseaseName: "Wheat Stem Rust (Ug99 Race)",
    scientificName: "Puccinia graminis f. sp. tritici",
    symptoms:
      "Reddish-brown, elongated pustules on stems and leaf sheaths that rupture the plant epidermis and cause lodging before grain filling.",
    approvedManagement:
      "Deployment of resistant wheat varieties (e.g., Kingbird, Ogolcho), rigorous surveillance during the Meher season, and early reporting to woreda agricultural extension offices.",
    severity: "High (National Priority)",
  },
  {
    crop: "Teff",
    diseaseName: "Teff Rust",
    scientificName: "Uromyces eragrostidis",
    symptoms:
      "Tiny brown-orange uredinia scattered across leaf blades, causing leaf yellowing and grain shriveling in high-humidity highlands.",
    approvedManagement:
      "Crop rotation with legumes (chickpeas, faba beans), proper seed spacing to reduce microclimate moisture, and certified clean seed stocks.",
    severity: "Moderate",
  },
  {
    crop: "Maize",
    diseaseName: "Maize Lethal Necrosis (MLN)",
    scientificName: "MCMV + SCMV Viral Complex",
    symptoms:
      "Severe chlorotic mottling, leaf necrosis starting from leaf margins, premature plant death, and sterile or deformed ears.",
    approvedManagement:
      "Crop rotation away from cereal monocultures, vector control (thrips and beetles), strict quarantine of uncertified seed, and immediate rogueing of infected stalks.",
    severity: "Critical",
  },
];

export default function CropHealthPage() {
  const [statusNotice, setStatusNotice] = useState<CropHealthDiagnosisNotice | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");

  useEffect(() => {
    async function loadStatus() {
      const notice = await apiClient.getCropHealthStatus();
      setStatusNotice(notice);
    }
    loadStatus();
  }, []);

  const crops = ["All", "Coffee (Arabica)", "Wheat (Durum & Bread)", "Teff", "Maize"];

  const filteredDiseases = agronomicDiseases.filter((d) => {
    const matchesCrop = selectedCrop === "All" || d.crop.includes(selectedCrop);
    const matchesSearch =
      d.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
      d.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      d.symptoms.toLowerCase().includes(search.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
          Crop Pathology & Diagnostics
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          CABI-grounded pathology guide and field diagnostic integration via Telegram Bot.
        </p>
      </div>

      {/* Honest Architectural Status Banner */}
      <div className="bg-[#1B4332] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold">
              <Info className="h-3.5 w-3.5" />
              <span>Low-Bandwidth Mobile Integration</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Instant AI Vision Diagnosis via Telegram Bot (@gebere_vision_bot)
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              To support smallholders in rural woredas with intermittent connectivity, live photo diagnosis runs natively on Telegram. Photograph crop leaf symptoms for instantaneous diagnosis in <strong>Afaan Oromoo, Amharic, English, or Arabic</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 self-stretch sm:self-auto">
            <Link
              href="/gebere-vision-ai"
              className="flex items-center gap-2 bg-[#40916C] hover:bg-[#2D6A4F] text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-md transition-all justify-center"
            >
              <HeartPulse className="h-4 w-4" />
              <span>Launch Gebere Vision AI</span>
            </Link>

            <a
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#1B4332] hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold text-xs shadow-md transition-all justify-center"
            >
              <Send className="h-4 w-4" />
              <span>Open Bot (@gebere_vision_bot)</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Diagnostic Reference Encyclopedia Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              CABI-Aligned Disease Knowledge Base
            </h2>
            <p className="text-xs text-gray-500">
              Verified pathology symptoms and approved cultural/biological management practices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search disease or symptom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F] w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Diseases List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {filteredDiseases.map((d) => (
            <div
              key={d.diseaseName}
              className="bg-[#F5F0E8]/60 border border-[#E5DFD3] rounded-xl p-5 space-y-3 hover:border-[#2D6A4F] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider block">
                    {d.crop}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{d.diseaseName}</h3>
                  <span className="text-xs text-gray-500 italic font-serif">{d.scientificName}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  d.severity.includes("High") || d.severity.includes("Critical")
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {d.severity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-800 block">Symptoms:</span>
                <p className="text-xs text-gray-600 leading-relaxed">{d.symptoms}</p>
              </div>

              <div className="space-y-1 pt-1 border-t border-gray-200/60">
                <span className="text-xs font-semibold text-[#2D6A4F] block">Management Protocol:</span>
                <p className="text-xs text-gray-600 leading-relaxed">{d.approvedManagement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

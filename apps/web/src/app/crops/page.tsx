"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Mountain, ChevronRight, TrendingUp, Info, Calendar, DollarSign, Activity, ShieldCheck, X } from "lucide-react";
import { CropProfile } from "@gebere/shared";
import { apiClient } from "@/lib/api-client";

export default function CropsCatalogPage() {
  const [crops, setCrops] = useState<CropProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({
    coffee: "Overview",
    teff: "Overview",
    wheat: "Overview",
    barley: "Overview",
  });
  const [selectedCropModal, setSelectedCropModal] = useState<CropProfile | null>(null);

  useEffect(() => {
    async function loadCrops() {
      try {
        const data = await apiClient.getCrops();
        if (data && data.length > 0) {
          setCrops(data);
        }
      } catch (err) {
        console.error("Failed to load crop catalogue from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  const subNavItems = [
    "Overview",
    "Farming Activities",
    "Seasonal Calendar",
    "Expenses",
    "Harvest Records",
    "Market Info",
    "Crop Health",
  ];

  const handleSubTabChange = (cropId: string, tab: string) => {
    setActiveSubTabs((prev) => ({
      ...prev,
      [cropId]: tab,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Crops Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Dynamic agronomic catalogue for Oromia priority crops: Coffee, Teff, Wheat, and Barley.
          </p>
        </div>

        <Link
          href="/crop-health"
          className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <Sprout className="h-4 w-4" />
          <span>Disease Diagnosis & Symptoms</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500">Loading verified crop intelligence from API...</p>
        </div>
      ) : (
        /* 2x2 Grid matching Image 3 */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {crops.map((crop) => {
            const currentTab = activeSubTabs[crop.id] || "Overview";

            return (
              <div
                key={crop.id}
                className="bg-white rounded-3xl shadow-sm border border-[#E5DFD3] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
              >
                {/* Crop Hero Photo with Title Overlay */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-emerald-950">
                  <img
                    src={crop.imageUrl}
                    alt={`${crop.nameEnglish} / ${crop.nameAfaanOromoo}`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                      {crop.nameEnglish} / {crop.nameAfaanOromoo}
                    </h2>
                    <p className="text-xs text-white/80 italic font-serif">
                      {crop.scientificName} • {crop.nameAmharic}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 space-y-5">
                  
                  {/* Secondary Subnav Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    {subNavItems.map((tab) => {
                      const isActive = currentTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => handleSubTabChange(crop.id, tab)}
                          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                            isActive
                              ? "bg-[#1B4332] text-white shadow-sm font-semibold"
                              : "bg-[#F5F0E8] text-gray-700 hover:bg-[#EAE4D9]"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Content Panel by Subtab */}
                  {currentTab === "Overview" && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed min-h-[48px]">
                        {crop.description}
                      </p>

                      {/* 2 Earthy Brown Badges from Image 3 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#8B5E3C] text-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                          <Sprout className="h-5 w-5 text-amber-200 flex-shrink-0" />
                          <div>
                            <div className="text-[10px] text-amber-100 font-medium">Growing Season</div>
                            <div className="text-xs sm:text-sm font-bold">{crop.growingSeasonMonths}</div>
                          </div>
                        </div>

                        <div className="bg-[#8B5E3C] text-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                          <Mountain className="h-5 w-5 text-amber-200 flex-shrink-0" />
                          <div>
                            <div className="text-[10px] text-amber-100 font-medium">Ideal Elevation</div>
                            <div className="text-xs sm:text-sm font-bold">{crop.idealElevationMeters}</div>
                          </div>
                        </div>
                      </div>

                      {/* Stage Progress Bar from Image 3 */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-800">{crop.currentGrowthStage}</span>
                          <span className="text-gray-500 font-medium">{crop.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                          <div
                            className="bg-[#2D6A4F] h-full rounded-full transition-all duration-500"
                            style={{ width: `${crop.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Common Uses Pills */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-gray-700">Common Uses</span>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {crop.commonUses.map((use) => (
                            <span
                              key={use}
                              className="bg-[#F5F0E8] text-[#1B4332] text-xs font-semibold px-3 py-1 rounded-lg border border-[#E5DFD3]"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTab === "Farming Activities" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Verified Agronomic Phases</span>
                      <div className="space-y-2">
                        {crop.farmingActivities.map((act, i) => (
                          <div key={i} className="bg-[#F5F0E8] rounded-xl p-3 text-xs border border-[#E5DFD3]">
                            <div className="flex items-center justify-between font-bold text-[#1B4332]">
                              <span>{act.phase}</span>
                              <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-gray-600 border border-gray-200">{act.timing}</span>
                            </div>
                            <p className="text-gray-600 mt-1 leading-relaxed">{act.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentTab === "Seasonal Calendar" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Oromia Agricultural Calendar</span>
                      <div className="bg-[#F5F0E8] rounded-xl p-4 border border-[#E5DFD3] space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Main Season:</span>
                          <span className="font-semibold text-gray-800">Meher (Kiremt Rains)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Sowing Window:</span>
                          <span className="font-semibold text-gray-800">June – July</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Harvest Window:</span>
                          <span className="font-semibold text-gray-800">November – January</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Target Zones:</span>
                          <span className="font-semibold text-[#1B4332] text-right truncate max-w-[200px]">
                            {crop.primaryGrowingZones.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTab === "Expenses" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Baseline Production Expense Guide</span>
                      <div className="bg-[#F5F0E8] rounded-xl p-4 border border-[#E5DFD3] space-y-2 text-xs">
                        <div className="flex justify-between items-center font-bold text-gray-900 pb-2 border-b border-gray-200">
                          <span>Estimated Cost per Hectare:</span>
                          <span className="text-base text-[#1B4332]">{crop.benchmarkExpensePerHaETB.toLocaleString()} ETB</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                          Calculated based on standard input costs (certified seed, basal/top-dress fertilizer, plowing passes, and seasonal harvesting labor) across Oromia highland zones.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentTab === "Harvest Records" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Yield Benchmarks by Variety</span>
                      <div className="space-y-2">
                        {crop.varieties.map((v, i) => (
                          <div key={i} className="bg-[#F5F0E8] rounded-xl p-3 text-xs border border-[#E5DFD3] flex justify-between items-center">
                            <div>
                              <div className="font-bold text-gray-900">{v.name}</div>
                              <div className="text-[10px] text-gray-500">Maturity: {v.maturityDays}</div>
                            </div>
                            <div className="text-right font-semibold text-[#2D6A4F]">
                              {v.yieldPotentialQuintalsPerHa}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentTab === "Market Info" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Regional Commodity Pricing</span>
                      <div className="bg-[#F5F0E8] rounded-xl p-4 border border-[#E5DFD3] space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Benchmark Price:</span>
                          <span className="font-bold text-base text-[#2D6A4F]">{crop.benchmarkMarketPriceETBPerKg} ETB/kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Price Trend:</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                            <TrendingUp className="h-3 w-3" />
                            <span>{crop.marketTrend}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 pt-1">
                          Reported from Oromia regional agricultural cooperative exchanges and terminal markets.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentTab === "Crop Health" && (
                    <div className="space-y-3 animate-fade-in min-h-[180px]">
                      <span className="text-xs font-bold text-gray-800">Pathology & Extension Guidance</span>
                      <div className="bg-[#F5F0E8] rounded-xl p-3.5 border border-[#E5DFD3] text-xs space-y-2">
                        <p className="text-gray-600 leading-relaxed">
                          Verified disease prevention guidelines curated from the Ministry of Agriculture and CABI Plantwise for {crop.nameEnglish}.
                        </p>
                        <Link
                          href="/crop-health"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:underline pt-1"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Inspect Disease Profiles for {crop.nameEnglish} →</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Financial Summary & Market Indicator Bar */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Expense Summary</span>
                      <span className="text-sm font-bold text-gray-900">{crop.benchmarkExpensePerHaETB.toLocaleString()} ETB</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Market Price Indicator</span>
                      <span className="text-xs sm:text-sm font-bold text-[#2D6A4F]">
                        {crop.benchmarkMarketPriceETBPerKg} ETB/kg - {crop.marketTrend}
                      </span>
                    </div>
                  </div>

                  {/* View Full Profile Button from Image 3 */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCropModal(crop)}
                      className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-medium py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#2D6A4F]/20 text-center block"
                    >
                      View Full Profile
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Profile Modal */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedCropModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedCropModal.imageUrl}
                alt={selectedCropModal.nameEnglish}
                className="w-20 h-20 rounded-2xl object-cover shadow-sm"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCropModal.nameEnglish} / {selectedCropModal.nameAfaanOromoo}
                </h3>
                <p className="text-xs text-gray-500 italic">
                  {selectedCropModal.scientificName} • {selectedCropModal.nameAmharic}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="bg-emerald-100 text-[#1B4332] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedCropModal.growingSeasonMonths}
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedCropModal.idealElevationMeters}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {selectedCropModal.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Recommended Agricultural Zones in Oromia</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCropModal.primaryGrowingZones.map((z) => (
                  <span key={z} className="bg-[#F5F0E8] text-[#1B4332] border border-[#E5DFD3] text-xs font-semibold px-3 py-1 rounded-xl">
                    📍 {z}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Verified Crop Varieties & Yield Potentials</h4>
              <div className="space-y-2">
                {selectedCropModal.varieties.map((v, i) => (
                  <div key={i} className="bg-[#F5F0E8] rounded-xl p-3 text-xs border border-[#E5DFD3] space-y-1">
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>{v.name}</span>
                      <span className="text-[#2D6A4F]">{v.yieldPotentialQuintalsPerHa}</span>
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Days to maturity: {v.maturityDays} • Zones: {v.recommendedZones.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCropModal(null)}
                className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

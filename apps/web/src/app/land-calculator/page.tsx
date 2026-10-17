"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Save,
  CheckCircle2,
  Info,
  ChevronDown,
  Layers,
  Sprout,
  Trash2,
  Edit2,
  AlertCircle,
  ExternalLink,
  X
} from "lucide-react";
import {
  calculateRectangularArea,
  RECTANGULAR_DISCLAIMER,
  MAP_ESTIMATE_DISCLAIMER,
  LandAreaResult,
  MeasurementUnit,
  Farm,
  LandRecord
} from "@gebere/shared";
import { apiClient } from "@/lib/api-client";

// Dynamically load Leaflet GPS map drawer to avoid SSR issues
const PlotMapDrawer = dynamic(() => import("@/components/PlotMapDrawer"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-2xl bg-white border border-[#E5DFD3] flex items-center justify-center text-gray-500 text-sm">
      Loading OpenStreetMap GPS Plot Drawer...
    </div>
  ),
});

const PRIORITY_CROPS = [
  { id: "Coffee", name: "Coffee (Buna)", icon: "☕" },
  { id: "Teff", name: "Teff (Xaafii)", icon: "🌾" },
  { id: "Wheat", name: "Wheat (Qamadii)", icon: "🌾" },
  { id: "Barley", name: "Barley (Garbuu)", icon: "🌾" },
];

export default function LandCalculatorPage() {
  const [activeTab, setActiveTab] = useState<"rectangular" | "map">("rectangular");

  // Rectangular calculation form state (Default matches Image 2A)
  const [lengthInput, setLengthInput] = useState<string>("");
  const [widthInput, setWidthInput] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<MeasurementUnit>("meters");
  const [widthUnit, setWidthUnit] = useState<MeasurementUnit>("feet");

  const [calculationResult, setCalculationResult] = useState<LandAreaResult | null>({
    squareMeters: 3977.06,
    hectares: 0.024,
    acres: 0.677,
    isEstimate: true,
    disclaimer: "Rectangular estimates only — not legally certified.",
  });

  const [mapResult, setMapResult] = useState<any>(null);
  
  // Plot save form state
  const [plotName, setPlotName] = useState<string>("Bishoftu South Plot");
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("Teff");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [savedPlots, setSavedPlots] = useState<LandRecord[]>([]);
  const [loadingPlots, setLoadingPlots] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Edit plot modal state
  const [editingPlot, setEditingPlot] = useState<LandRecord | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCrop, setEditCrop] = useState<string>("");
  const [editFarmId, setEditFarmId] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // Load farms and existing plots on mount
  useEffect(() => {
    async function loadData() {
      setLoadingPlots(true);
      try {
        const [farmList, plotList] = await Promise.all([
          apiClient.getFarms(),
          apiClient.getLandRecords(),
        ]);
        setFarms(farmList);
        if (farmList.length > 0 && !selectedFarmId) {
          setSelectedFarmId(farmList[0].id);
        }
        setSavedPlots(plotList);
      } catch (err: any) {
        console.error("Failed to load farms or plots:", err);
      } finally {
        setLoadingPlots(false);
      }
    }
    loadData();
  }, []);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const l = parseFloat(lengthInput);
    const w = parseFloat(widthInput);

    if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0) {
      alert("Please enter positive, valid length and width dimensions.");
      return;
    }

    try {
      const res = calculateRectangularArea({
        length: l,
        width: w,
        lengthUnit,
        widthUnit,
      });
      setCalculationResult(res);
      setSaveError(null);
    } catch (err: any) {
      alert(err.message || "Calculation failed");
    }
  };

  const handleSavePlot = async () => {
    const areaSqM = activeTab === "rectangular"
      ? calculationResult?.squareMeters
      : mapResult?.result?.squareMeters;

    const areaHa = activeTab === "rectangular"
      ? calculationResult?.hectares
      : mapResult?.result?.hectares;

    const areaAc = activeTab === "rectangular"
      ? calculationResult?.acres
      : mapResult?.result?.acres;

    if (!areaSqM) {
      setSaveError("Please calculate area dimensions first.");
      return;
    }

    setSaveLoading(true);
    setSaveError(null);

    try {
      const saved = await apiClient.saveLandRecord({
        farmId: selectedFarmId || undefined,
        plotName: plotName.trim() || "Registered Plot",
        crop: selectedCrop,
        calculationMethod: activeTab === "rectangular" ? "rectangular" : "polygon",
        length: activeTab === "rectangular" ? parseFloat(lengthInput) : undefined,
        width: activeTab === "rectangular" ? parseFloat(widthInput) : undefined,
        lengthUnit: activeTab === "rectangular" ? lengthUnit : undefined,
        widthUnit: activeTab === "rectangular" ? widthUnit : undefined,
        coordinates: activeTab === "map" ? mapResult?.coordinates : undefined,
        notes: `Recorded via Oomisha360 Land Calculator (${activeTab}). Crop: ${selectedCrop}.`,
      });

      if (saved) {
        setSavedPlots((prev) => [saved, ...prev]);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setSaveError("Backend could not save the plot record. Please check inputs.");
      }
    } catch (err: any) {
      console.error("Failed to save plot:", err);
      setSaveError(err.message || "Failed to save plot to database.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeletePlot = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete plot "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const success = await apiClient.deleteLandRecord(id);
      if (success) {
        setSavedPlots((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Could not delete plot. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete plot.");
    }
  };

  const openEditModal = (plot: LandRecord) => {
    setEditingPlot(plot);
    setEditName(plot.plotName);
    setEditCrop(plot.crop || "Teff");
    setEditFarmId(plot.farmId || "");
    setEditNotes(plot.notes || "");
  };

  const handleUpdatePlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;
    setEditLoading(true);
    try {
      const updated = await apiClient.updateLandRecord(editingPlot.id, {
        plotName: editName.trim(),
        crop: editCrop,
        farmId: editFarmId || null,
        notes: editNotes,
      });
      if (updated) {
        setSavedPlots((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingPlot(null);
      } else {
        alert("Could not update plot.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update plot.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page Title & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Land Calculator
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Precision rectangular dimensional math & GPS polygon surface estimation.
          </p>
        </div>

        {/* View Tabs */}
        <div className="inline-flex p-1 bg-white border border-[#D8D2C4] rounded-xl self-start shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("rectangular")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "rectangular"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Rectangular Formula
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "map"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive GPS Map</span>
          </button>
        </div>
      </div>

      {activeTab === "rectangular" ? (
        /* Image 2A Exact Rectangular Card */
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Inputs Column */}
            <form onSubmit={handleCalculate} className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                
                {/* Length Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Length</label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#2D6A4F] focus-within:ring-1 focus-within:ring-[#2D6A4F]">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={lengthInput}
                      onChange={(e) => setLengthInput(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-white px-4 py-3 text-base text-gray-900 focus:outline-none"
                      required
                    />
                    <div className="relative border-l border-gray-300 bg-gray-50 flex items-center pr-3 pl-3">
                      <select
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value as MeasurementUnit)}
                        className="bg-transparent text-sm font-medium text-gray-700 pr-5 focus:outline-none cursor-pointer appearance-none"
                      >
                        <option value="meters">Meters</option>
                        <option value="feet">Feet</option>
                        <option value="kilometers">Kilometers</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Width Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Width</label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#2D6A4F] focus-within:ring-1 focus-within:ring-[#2D6A4F]">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={widthInput}
                      onChange={(e) => setWidthInput(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-white px-4 py-3 text-base text-gray-900 focus:outline-none"
                      required
                    />
                    <div className="relative border-l border-gray-300 bg-gray-50 flex items-center pr-3 pl-3">
                      <select
                        value={widthUnit}
                        onChange={(e) => setWidthUnit(e.target.value as MeasurementUnit)}
                        className="bg-transparent text-sm font-medium text-gray-700 pr-5 focus:outline-none cursor-pointer appearance-none"
                      >
                        <option value="feet">Feet</option>
                        <option value="meters">Meters</option>
                        <option value="kilometers">Kilometers</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
              >
                Calculate
              </button>
            </form>

            {/* Right Green Card (Exact match of Image 2A) */}
            <div className="md:col-span-6 bg-[#2D6A4F] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-md">
              
              {/* Output Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {calculationResult ? calculationResult.squareMeters.toFixed(2) : "3977.06"}
                  </div>
                  <div className="text-xs font-medium text-emerald-100/90 mt-0.5">
                    Square Meters
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {calculationResult ? calculationResult.hectares.toFixed(4) : "0.024"}
                  </div>
                  <div className="text-xs font-medium text-emerald-100/90 mt-0.5">
                    Hectares
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {calculationResult ? calculationResult.acres.toFixed(3) : "0.677"}
                  </div>
                  <div className="text-xs font-medium text-emerald-100/90 mt-0.5">
                    Acres
                  </div>
                </div>
              </div>

              {/* Rectangular Visual Diagram */}
              <div className="my-6 py-4 px-6 bg-[#23533E] rounded-xl border border-white/20 flex flex-col items-center justify-center relative">
                <div className="text-[10px] text-white/80 font-medium mb-1">Length</div>
                <div className="w-full h-18 border-2 border-dashed border-white/70 rounded bg-[#2D6A4F]/60 flex items-center justify-between px-2 relative">
                  <span className="text-[10px] text-white/80 -rotate-90">Width</span>
                  <div className="h-2 w-2 border-t-2 border-r-2 border-white absolute top-0 right-0"></div>
                  <div className="h-2 w-2 border-b-2 border-r-2 border-white absolute bottom-0 right-0"></div>
                  <div className="h-2 w-2 border-t-2 border-l-2 border-white absolute top-0 left-0"></div>
                  <div className="h-2 w-2 border-b-2 border-l-2 border-white absolute bottom-0 left-0"></div>
                  <span className="text-[10px] text-white/60 mx-auto">90° Perpendicular</span>
                </div>
                <div className="text-[10px] text-white/80 font-medium mt-1">Length</div>
              </div>

              {/* Subtext Disclaimer */}
              <p className="text-[11px] text-emerald-100/80 leading-normal italic">
                Rectangular estimates only — not legally certified.
              </p>
            </div>

          </div>

          {/* Save to Farm Registry Bar */}
          <div className="mt-8 pt-6 border-t border-[#E5DFD3] space-y-4">
            {saveError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {savedSuccess && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#1B4332]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2D6A4F] flex-shrink-0" />
                  <span className="font-semibold">Plot saved successfully to your farm registry!</span>
                </div>
                <Link
                  href="/farms"
                  className="font-medium text-[#2D6A4F] hover:underline flex items-center gap-1"
                >
                  <span>View on My Farm</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Plot Name */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs font-semibold text-gray-700">Plot Name</label>
                <input
                  type="text"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="e.g. Bale North Field"
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              {/* Farm Selector */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-gray-700">Assign to Farm</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                >
                  <option value="">General (No Farm Selected)</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Selector */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-gray-700">Crop Cultivated</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                >
                  {PRIORITY_CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Button */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleSavePlot}
                  disabled={saveLoading}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{saveLoading ? "Saving..." : "Save Plot"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GPS Map Polygon Drawer Tab */
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Interactive OpenStreetMap GPS Polygon Measurement
            </h2>
            <span className="text-xs text-gray-500">
              Click nodes or select presets to compute spherical area
            </span>
          </div>

          <PlotMapDrawer
            onAreaCalculated={(res: any, coords: any) => {
              setMapResult({ result: res, coordinates: coords });
            }}
          />

          {mapResult && (
            <div className="bg-[#2D6A4F] text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-bold">{mapResult.result?.squareMeters.toFixed(2)} m²</div>
                <div className="text-xs text-emerald-100">
                  {mapResult.result?.hectares.toFixed(4)} Hectares • {mapResult.result?.acres.toFixed(3)} Acres
                </div>
              </div>
              <button
                type="button"
                onClick={handleSavePlot}
                className="bg-white text-[#1B4332] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-gray-100 transition-colors"
              >
                Save Map Polygon
              </button>
            </div>
          )}
        </div>
      )}

      {/* Saved Land Plots Registry Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#2D6A4F]" />
              <span>Saved Plots Registry ({savedPlots.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Agricultural plots measured and linked to your registered farm estates.
            </p>
          </div>

          <Link
            href="/farms"
            className="text-xs font-semibold text-[#2D6A4F] hover:underline flex items-center gap-1"
          >
            <span>Go to My Farm</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loadingPlots ? (
          <div className="py-8 text-center text-xs text-gray-500">
            Loading saved plots from database...
          </div>
        ) : savedPlots.length === 0 ? (
          <div className="py-10 text-center rounded-xl bg-[#F5F0E8]/50 border border-dashed border-[#D8D2C4] space-y-2">
            <Sprout className="h-8 w-8 text-[#2D6A4F] mx-auto opacity-70" />
            <p className="text-sm font-semibold text-gray-700">No plots recorded yet</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Enter field dimensions above and click &quot;Save Plot&quot; to register your first measured plot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5DFD3] text-gray-500 font-semibold">
                  <th className="pb-3 pr-4">Plot Name</th>
                  <th className="pb-3 px-4">Farm</th>
                  <th className="pb-3 px-4">Crop</th>
                  <th className="pb-3 px-4">Method</th>
                  <th className="pb-3 px-4">Dimensions / Area</th>
                  <th className="pb-3 px-4">Hectares</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3]/60 text-gray-800">
                {savedPlots.map((plot) => {
                  const assignedFarm = farms.find((f) => f.id === plot.farmId);
                  const cropObj = PRIORITY_CROPS.find((c) => c.id.toLowerCase() === (plot.crop || "").toLowerCase());
                  return (
                    <tr key={plot.id} className="hover:bg-[#F5F0E8]/30 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-gray-900">
                        {plot.plotName}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {assignedFarm ? assignedFarm.name : "Unassigned"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#1B4332] border border-emerald-200">
                          {cropObj?.icon || "🌱"} {plot.crop || "Teff"}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize text-gray-600">
                        {plot.calculationMethod}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {plot.calculationMethod === "rectangular" && plot.length && plot.width
                          ? `${plot.length} ${plot.lengthUnit || "m"} × ${plot.width} ${plot.widthUnit || "m"}`
                          : `${plot.areaSquareMeters.toLocaleString()} m²`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1B4332]">
                        {plot.areaHectares.toFixed(3)} ha
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(plot)}
                            title="Edit Plot"
                            className="p-1.5 text-gray-500 hover:text-[#2D6A4F] hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePlot(plot.id, plot.plotName)}
                            title="Delete Plot"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Plot Modal */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5DFD3] space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-[#2D6A4F]" />
                <span>Edit Plot Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlot(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlot} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Plot Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Farm Assignment</label>
                <select
                  value={editFarmId}
                  onChange={(e) => setEditFarmId(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                >
                  <option value="">General (No Farm Selected)</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Crop Cultivated</label>
                <select
                  value={editCrop}
                  onChange={(e) => setEditCrop(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                >
                  {PRIORITY_CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Notes / Survey Details</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPlot(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-sm"
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

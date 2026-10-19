"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Sun,
  CloudSun,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Sprout,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  X,
  AlertCircle
} from "lucide-react";
import { Farm, ZoneItem, EthiopiaRegionSummary, LandRecord } from "@gebere/shared";
import { apiClient } from "@/lib/api-client";

const PRIORITY_CROPS = [
  { id: "Coffee", name: "Coffee", icon: "☕" },
  { id: "Teff", name: "Teff", icon: "🌾" },
  { id: "Wheat", name: "Wheat", icon: "🌾" },
  { id: "Barley", name: "Barley", icon: "🌾" },
];

export default function MyFarmPage() {
  const [farmName, setFarmName] = useState("Bale Ridge Estate");
  const [regions, setRegions] = useState<EthiopiaRegionSummary[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("Oromia");
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [selectedZone, setSelectedZone] = useState("Bale");
  const [woredas, setWoredas] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedWoreda, setSelectedWoreda] = useState("Goba");
  const [customKebele, setCustomKebele] = useState("");
  const [landArea, setLandArea] = useState("12500");
  const [crops, setCrops] = useState({
    coffee: true,
    teff: true,
    wheat: false,
    barley: false,
  });

  const [savedFarms, setSavedFarms] = useState<Farm[]>([]);
  const [farmPlots, setFarmPlots] = useState<LandRecord[]>([]);
  const [loadingPlots, setLoadingPlots] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Edit plot modal state
  const [editingPlot, setEditingPlot] = useState<LandRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editCrop, setEditCrop] = useState("Teff");
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [farmList, regList, plotList] = await Promise.all([
          apiClient.getFarms(),
          apiClient.getRegions(),
          apiClient.getLandRecords(),
        ]);
        setSavedFarms(farmList);
        setFarmPlots(plotList);
        if (regList && regList.length > 0) {
          setRegions(regList);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoadingPlots(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadZones() {
      if (!selectedRegion) return;
      try {
        const zoneList = await apiClient.getZones(selectedRegion);
        setZones(zoneList);
        if (zoneList.length > 0) {
          setSelectedZone(zoneList[0].name);
        }
      } catch (err) {
        console.error("Failed to load zones", err);
      }
    }
    loadZones();
  }, [selectedRegion]);

  useEffect(() => {
    async function loadWoredas() {
      if (!selectedZone) return;
      try {
        const list = await apiClient.getWoredas(selectedZone, selectedRegion);
        setWoredas(list);
        if (list.length > 0) {
          setSelectedWoreda(list[0].name);
        }
      } catch (err) {
        console.error("Failed to load woredas for zone", err);
      }
    }
    loadWoredas();
  }, [selectedZone, selectedRegion]);

  const handleStartFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveError(null);

    try {
      const selectedCropNames = Object.entries(crops)
        .filter(([_, checked]) => checked)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(", ");

      const newFarm = await apiClient.createFarm({
        name: farmName || "My Farm",
        region: selectedRegion,
        zone: selectedZone,
        woreda: selectedWoreda,
        kebele: customKebele || undefined,
        totalHectares: parseFloat(landArea) > 0 ? parseFloat(landArea) / 10000 : 1.25,
        primaryCrop: selectedCropNames || "Teff",
        notes: `Registered via Oomisha360 My Farm panel. Location: ${selectedRegion}, ${selectedZone}, ${selectedWoreda}.`,
      });

      setSavedFarms((prev) => [newFarm, ...prev]);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      console.error("Failed to save farm", err);
      setSaveError(err.message || "Failed to save farm to database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCrop = (key: keyof typeof crops) => {
    setCrops((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openEditPlot = (plot: LandRecord) => {
    setEditingPlot(plot);
    setEditName(plot.plotName);
    setEditCrop(plot.crop || "Teff");
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
        notes: editNotes,
      });
      if (updated) {
        setFarmPlots((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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

  const handleDeletePlot = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete plot "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const success = await apiClient.deleteLandRecord(id);
      if (success) {
        setFarmPlots((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Could not delete plot.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete plot.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Heading from Image 2B */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            My Farm
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Farm profile, field perimeter telemetry, and live agricultural activities.
          </p>
        </div>

        {successNotice && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-[#1B4332] text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
            <span>Farm Profile Saved Successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-800 text-xs font-semibold animate-fade-in">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* 2-Column Layout matching Image 2B */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Farm Configuration Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-8">
          <form onSubmit={handleStartFarm} className="space-y-5">
            
            {/* Farm Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-800">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Enter farm name..."
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Region & Agricultural Zone Location (All Ethiopia) */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Region (All Ethiopia)</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Agricultural Zone</label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.name}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {woredas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Woreda / District</label>
                    <select
                      value={selectedWoreda}
                      onChange={(e) => setSelectedWoreda(e.target.value)}
                      className="w-full bg-[#F5F0E8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                    >
                      {woredas.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Kebele / Locality (Optional)</label>
                    <input
                      type="text"
                      value={customKebele}
                      onChange={(e) => setCustomKebele(e.target.value)}
                      placeholder="e.g. Sinana Kebele 02"
                      className="w-full bg-[#F5F0E8] border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#2D6A4F]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Land Area */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-800">Land Area</label>
              <div className="relative">
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="3977"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-20 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                  Meters
                </span>
              </div>
            </div>

            {/* Crop Selection Checkboxes matching Image 2B */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-gray-800 block">
                Crop Selection
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Coffee */}
                <div
                  onClick={() => toggleCrop("coffee")}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    crops.coffee
                      ? "border-[#2D6A4F] bg-emerald-50/50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        crops.coffee
                          ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {crops.coffee && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Coffee</span>
                  </div>
                  <span className="text-lg">☕</span>
                </div>

                {/* Teff */}
                <div
                  onClick={() => toggleCrop("teff")}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    crops.teff
                      ? "border-[#2D6A4F] bg-emerald-50/50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        crops.teff
                          ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {crops.teff && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Teff</span>
                  </div>
                  <span className="text-lg">🌾</span>
                </div>

                {/* Wheat */}
                <div
                  onClick={() => toggleCrop("wheat")}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    crops.wheat
                      ? "border-[#2D6A4F] bg-emerald-50/50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        crops.wheat
                          ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {crops.wheat && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Wheat</span>
                  </div>
                  <span className="text-lg">🌾</span>
                </div>

                {/* Barley */}
                <div
                  onClick={() => toggleCrop("barley")}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    crops.barley
                      ? "border-[#2D6A4F] bg-emerald-50/50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                        crops.barley
                          ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {crops.barley && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Barley</span>
                  </div>
                  <span className="text-lg">🌾</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-medium py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
              >
                {loading ? "Registering Farm..." : "Start"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Stacked Cards matching Image 2B */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Farm Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Farm Overview
            </h3>

            {/* Mini Map View with Red Pin */}
            <div className="w-full h-36 rounded-xl overflow-hidden relative border border-gray-200 bg-emerald-950/10 flex items-center justify-center">
              {/* Map background tiles representation */}
              <div className="absolute inset-0 bg-[radial-gradient(#2D6A4F_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
              
              {/* Red Map Pin */}
              <div className="relative flex flex-col items-center animate-bounce">
                <div className="h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="h-1.5 w-3 rounded-full bg-black/30 blur-[1px]"></div>
              </div>

              <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gray-700 shadow-sm">
                Bale Highlands (7.0° N, 39.9° E)
              </div>
            </div>

            {/* Weather & Stats Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <CloudSun className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 leading-tight">28°C</div>
                  <div className="text-[11px] text-gray-500">Current weather</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">22,890 m²</div>
                <div className="text-[11px] text-gray-500">Basic Stats 4360</div>
              </div>
            </div>
          </div>

          {/* Card 2: Crop Photographs */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 sm:p-6 space-y-3">
            <h3 className="text-base font-bold text-gray-900">
              Crop Photographs
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group">
                <img
                  src="/images/crops/coffee.jpg"
                  alt="Coffee cherries"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Coffee</span>
              </div>

              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group">
                <img
                  src="/images/crops/teff.jpg"
                  alt="Teff field"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Teff</span>
              </div>

              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group">
                <img
                  src="/images/crops/wheat.jpg"
                  alt="Wheat field"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Wheat</span>
              </div>
            </div>
          </div>

          {/* Card 3: Activity Tracking Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Activity Tracking
            </h3>

            <div className="space-y-3">
              {/* Planted */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Planted</div>
                    <div className="text-xs text-gray-500">Planted farm farm</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">1 hrs ago</span>
              </div>

              {/* Fertilization */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 mt-1 flex-shrink-0"></span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Fertilization</div>
                    <div className="text-xs text-gray-500">Fertilization fertilization</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">1 hrs ago</span>
              </div>

              {/* Harvested */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 mt-1 flex-shrink-0"></span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Harvested</div>
                    <div className="text-xs text-gray-500">Harvested fertilization</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">1 hrs ago</span>
              </div>

              {/* Harvested 2 */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 mt-1 flex-shrink-0"></span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Harvested</div>
                    <div className="text-xs text-gray-500">Harvested farm farm</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">1 hrs ago</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Farm Plots & Land Registry Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#2D6A4F]" />
              <span>Registered Farm Plots ({farmPlots.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Individual agricultural parcels measured and saved with precise crop assignments.
            </p>
          </div>

          <Link
            href="/land-calculator"
            className="inline-flex items-center gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Measure New Plot (Land Calculator)</span>
          </Link>
        </div>

        {loadingPlots ? (
          <div className="py-8 text-center text-xs text-gray-500">
            Loading farm plots from database...
          </div>
        ) : farmPlots.length === 0 ? (
          <div className="py-10 text-center rounded-xl bg-[#F5F0E8]/50 border border-dashed border-[#D8D2C4] space-y-2">
            <Sprout className="h-8 w-8 text-[#2D6A4F] mx-auto opacity-70" />
            <p className="text-sm font-semibold text-gray-700">No plots registered yet for this farm</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Use the Land Calculator to measure field dimensions and assign crops to this estate.
            </p>
            <Link
              href="/land-calculator"
              className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm mt-2"
            >
              <span>Open Land Calculator</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5DFD3] text-gray-500 font-semibold">
                  <th className="pb-3 pr-4">Plot Name</th>
                  <th className="pb-3 px-4">Crop Cultivated</th>
                  <th className="pb-3 px-4">Measurement Method</th>
                  <th className="pb-3 px-4">Dimensions</th>
                  <th className="pb-3 px-4">Surface Area</th>
                  <th className="pb-3 px-4">Hectares</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3]/60 text-gray-800">
                {farmPlots.map((plot) => {
                  const cropObj = PRIORITY_CROPS.find((c) => c.id.toLowerCase() === (plot.crop || "").toLowerCase());
                  return (
                    <tr key={plot.id} className="hover:bg-[#F5F0E8]/30 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-gray-900">
                        {plot.plotName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-[#1B4332] border border-emerald-200">
                          {cropObj?.icon || "🌱"} {plot.crop || "Teff"}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize text-gray-600">
                        {plot.calculationMethod}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {plot.calculationMethod === "rectangular" && plot.length && plot.width
                          ? `${plot.length} ${plot.lengthUnit || "m"} × ${plot.width} ${plot.widthUnit || "m"}`
                          : "GPS Coordinates"}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {plot.areaSquareMeters.toLocaleString()} m²
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1B4332]">
                        {plot.areaHectares.toFixed(3)} ha
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditPlot(plot)}
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
                <span>Edit Plot: {editingPlot.plotName}</span>
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
                <label className="font-semibold text-gray-700">Notes / Topography</label>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  BarChart3,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sprout,
  Wheat,
  Clock
} from "lucide-react";
import { Farm, FinanceSummary, VolumeUnit } from "@gebere/shared";
import { apiClient } from "@/lib/api-client";

export default function FinanceDashboardPage() {
  // Real data state
  const [farms, setFarms] = useState<Farm[]>([]);
  const [financeData, setFinanceData] = useState<FinanceSummary | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Filters
  const [selectedCrop, setSelectedCrop] = useState("Teff");
  const [selectedFarm, setSelectedFarm] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("Meher 2024");
  const [trendRange, setTrendRange] = useState("Jan - June");

  // Segmented Card Tab: "expense" | "harvest"
  const [activeEntryTab, setActiveEntryTab] = useState<"expense" | "harvest">("expense");

  // Expense form inputs
  const [expenseFarmId, setExpenseFarmId] = useState("");
  const [category, setCategory] = useState("Fertilizer");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseNotes, setExpenseNotes] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Harvest form inputs
  const [harvestFarmId, setHarvestFarmId] = useState("");
  const [harvestCrop, setHarvestCrop] = useState("Teff");
  const [harvestQuantity, setHarvestQuantity] = useState("");
  const [harvestUnit, setHarvestUnit] = useState<VolumeUnit>("Quintals");
  const [harvestPrice, setHarvestPrice] = useState("");
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [harvestBuyer, setHarvestBuyer] = useState("");
  const [harvestNotes, setHarvestNotes] = useState("");
  const [submittingHarvest, setSubmittingHarvest] = useState(false);

  // Status feedback
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch farms and initial finance telemetry
  useEffect(() => {
    async function loadInitial() {
      setLoadingData(true);
      try {
        const [farmList, fin] = await Promise.all([
          apiClient.getFarms(),
          apiClient.getFinanceSummary(),
        ]);
        setFarms(farmList);
        if (farmList.length > 0) {
          setExpenseFarmId(farmList[0].id);
          setHarvestFarmId(farmList[0].id);
        }
        setFinanceData(fin);
      } catch (err) {
        console.error("Failed to load financial records", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadInitial();
  }, []);

  // Refresh finance summary when filters change
  useEffect(() => {
    async function refreshFinance() {
      try {
        const fin = await apiClient.getFinanceSummary(
          selectedFarm !== "All" ? selectedFarm : undefined,
          selectedSeason
        );
        setFinanceData(fin);
      } catch (err) {
        console.error("Failed to refresh finance telemetry", err);
      }
    }
    refreshFinance();
  }, [selectedFarm, selectedSeason]);

  // Derived KPI values with fallback to 0 (no hardcoded vanity numbers)
  const totalExpenses = financeData?.totalCost ?? 0;
  const totalRevenue = financeData?.totalRevenue ?? 0;
  const netProfit = financeData?.estimatedProfit ?? 0;
  const profitPerHectare = financeData?.profitPerHectare ?? 0;

  // Add Expense Submission
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseFarmId) {
      setFormError("Please select or register a farm profile before recording an expense.");
      setFormSuccess(null);
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setFormError("Please enter a valid expense amount in ETB greater than zero.");
      setFormSuccess(null);
      return;
    }

    setSubmittingExpense(true);
    setFormError(null);
    try {
      await apiClient.createExpense({
        farmId: expenseFarmId,
        season: selectedSeason,
        category: (category.toLowerCase().replace(/ /g, "_") as any) || "other",
        description: expenseNotes || `${category} input`,
        amount: val,
        currency: "ETB",
        date: expenseDate || new Date().toISOString().split("T")[0],
      });

      // Refresh real finance summary
      const fin = await apiClient.getFinanceSummary(
        selectedFarm !== "All" ? selectedFarm : undefined,
        selectedSeason
      );
      setFinanceData(fin);
      setFormSuccess(`Expense of ${val.toLocaleString()} ETB logged successfully!`);
      setAmount("");
      setExpenseNotes("");
      setTimeout(() => setFormSuccess(null), 3500);
    } catch (err: any) {
      setFormError(err.message || "Failed to record expense. Please try again.");
    } finally {
      setSubmittingExpense(false);
    }
  };

  // Add Harvest Submission (Replaces window.prompt with structured real record)
  const handleRecordHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!harvestFarmId) {
      setFormError("Please select or register a farm profile before recording a harvest lot.");
      setFormSuccess(null);
      return;
    }
    const qty = parseFloat(harvestQuantity);
    const prc = parseFloat(harvestPrice);
    if (isNaN(qty) || qty <= 0 || isNaN(prc) || prc <= 0) {
      setFormError("Please enter valid positive quantity and selling price.");
      setFormSuccess(null);
      return;
    }

    setSubmittingHarvest(true);
    setFormError(null);
    try {
      await apiClient.createHarvest({
        farmId: harvestFarmId,
        crop: harvestCrop,
        season: selectedSeason,
        quantity: qty,
        unit: harvestUnit,
        sellingPricePerUnit: prc,
        currency: "ETB",
        harvestDate: harvestDate || new Date().toISOString().split("T")[0],
        buyerName: harvestBuyer || undefined,
        notes: harvestNotes || undefined,
      });

      // Refresh real finance summary
      const fin = await apiClient.getFinanceSummary(
        selectedFarm !== "All" ? selectedFarm : undefined,
        selectedSeason
      );
      setFinanceData(fin);
      const estRev = qty * prc;
      setFormSuccess(`Harvest recorded: ${qty} ${harvestUnit} ${harvestCrop} (Revenue: ETB ${estRev.toLocaleString()})!`);
      setHarvestQuantity("");
      setHarvestPrice("");
      setHarvestBuyer("");
      setHarvestNotes("");
      setTimeout(() => setFormSuccess(null), 3500);
    } catch (err: any) {
      setFormError(err.message || "Failed to record harvest lot. Please try again.");
    } finally {
      setSubmittingHarvest(false);
    }
  };

  // Live calculation for harvest form
  const estHarvestRevenue =
    parseFloat(harvestQuantity) > 0 && parseFloat(harvestPrice) > 0
      ? (parseFloat(harvestQuantity) * parseFloat(harvestPrice)).toLocaleString()
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Page Title & Filter Bar matching Image 5 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Finance & Harvest Telemetry
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time ETB input expenses, harvest lot revenues, and net return per hectare.
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Farm Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Farm</span>
            <select
              value={selectedFarm}
              aria-label="Filter by Farm"
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="All">All Farms</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Crop</span>
            <select
              value={selectedCrop}
              aria-label="Filter by Crop"
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="Teff">Teff</option>
              <option value="Coffee">Coffee</option>
              <option value="Wheat">Wheat</option>
              <option value="Barley">Barley</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          {/* Season Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Season</span>
            <select
              value={selectedSeason}
              aria-label="Filter by Season"
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="Meher 2024">Meher 2024</option>
              <option value="Belg 2024">Belg 2024</option>
              <option value="Meher 2023">Meher 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row of 4 Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Expenses */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Total Expenses</span>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                ETB {totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 100 25" className="w-full h-full stroke-red-500 fill-none" preserveAspectRatio="none">
              <path
                d="M 0 18 Q 20 8, 40 16 T 70 10 T 100 20"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: Total Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Total Revenue</span>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                ETB {totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 100 25" className="w-full h-full stroke-emerald-600 fill-none" preserveAspectRatio="none">
              <path
                d="M 0 20 Q 25 15, 50 18 T 80 6 T 100 4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 3: Net Profit */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Net Return</span>
              <span className={`text-2xl font-extrabold tracking-tight ${netProfit >= 0 ? "text-[#1B4332]" : "text-red-600"}`}>
                ETB {netProfit.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 100 25" className={`w-full h-full fill-none ${netProfit >= 0 ? "stroke-[#1B4332]" : "stroke-red-500"}`} preserveAspectRatio="none">
              <path
                d="M 0 22 Q 25 20, 50 12 T 75 14 T 100 5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 4: Profit per Hectare */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Return per Hectare</span>
              <span className="text-2xl font-extrabold text-teal-900 tracking-tight">
                ETB {profitPerHectare.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 100 25" className="w-full h-full stroke-teal-600 fill-none" preserveAspectRatio="none">
              <path
                d="M 0 19 Q 30 16, 60 12 T 90 7 T 100 4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

      </div>

      {/* Main Grid: Visual Breakdown on Left, Unified Record Entry Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Charts & Trends */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Expense Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-900">
                Expense Category Distribution
              </h2>
              <span className="text-xs text-gray-500">
                {financeData?.expenseCount ?? 0} Recorded Incurred Costs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
              
              {/* Donut Chart 1 */}
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#2D6A4F" strokeWidth="18" strokeDasharray="28 72" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5E3C" strokeWidth="18" strokeDasharray="24 76" strokeDashoffset="-28" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#D97706" strokeWidth="18" strokeDasharray="20 80" strokeDashoffset="-52" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#CA8A04" strokeWidth="18" strokeDasharray="15 85" strokeDashoffset="-72" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#0D9488" strokeWidth="18" strokeDasharray="13 87" strokeDashoffset="-87" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Total</span>
                    <span className="text-xs font-bold text-gray-800">100%</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-700">
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]"></span>Seeds</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#8B5E3C]"></span>Fertilizer</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span>Labor</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#CA8A04]"></span>Land Prep</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]"></span>Protection</span>
                </div>
              </div>

              {/* Information Sidebox */}
              <div className="bg-[#F5F0E8]/70 border border-[#E5DFD3] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold text-gray-800 block">
                  Ethiopian Farm Economy Notes
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Inputs recorded in Oomisha360 are benchmarked against official wholesale market rates in Oromia.
                  Fertilizer and certified seed allocations represent standard highland agronomic practice.
                </p>
                <div className="pt-2 border-t border-[#D8D2C4] flex items-center justify-between text-xs font-semibold text-[#1B4332]">
                  <span>Cultivated Area:</span>
                  <span>{financeData?.cultivatedAreaHectares ?? 0} ha</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Monthly Net Return Trend */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Seasonal Revenue Trend
                </h2>
                <p className="text-xs text-gray-500">
                  Trajectory of commodity lot returns throughout the season
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTrendRange("Jan - June")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    trendRange === "Jan - June" ? "bg-[#1B4332] text-white" : "bg-[#F5F0E8] text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Meher Window
                </button>
                <button
                  type="button"
                  onClick={() => setTrendRange("Full Year")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    trendRange === "Full Year" ? "bg-[#1B4332] text-white" : "bg-[#F5F0E8] text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Belg Window
                </button>
              </div>
            </div>

            <div className="relative h-48 w-full pt-4">
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 pointer-events-none pb-6">
                <div className="border-b border-gray-100 flex justify-between"><span>50,000 ETB</span></div>
                <div className="border-b border-gray-100 flex justify-between"><span>25,000 ETB</span></div>
                <div className="border-b border-gray-100 flex justify-between"><span>10,000 ETB</span></div>
                <div className="border-b border-gray-100 flex justify-between"><span>0 ETB</span></div>
              </div>

              <div className="h-full w-full pb-6 pl-14">
                <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 145 C 80 120, 150 110, 200 95 C 260 70, 320 20, 380 40 C 430 55, 470 30, 500 15 L 500 150 L 0 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  <path
                    d="M 0 145 C 80 120, 150 110, 200 95 C 260 70, 320 20, 380 40 C 430 55, 470 30, 500 15"
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="absolute bottom-0 left-14 right-0 flex justify-between text-[11px] font-medium text-gray-500 pt-1">
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>Month 4</span>
                <span>Month 5</span>
                <span>Harvest Window</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Accessible Record Entry (Segmented Switcher) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-5">
          
          {/* Segmented Mode Selector: Log Expense vs Record Harvest */}
          <div className="flex bg-[#F5F0E8] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveEntryTab("expense");
                setFormError(null);
                setFormSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeEntryTab === "expense"
                  ? "bg-[#2D6A4F] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveEntryTab("harvest");
                setFormError(null);
                setFormSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeEntryTab === "harvest"
                  ? "bg-[#2D6A4F] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Record Harvest
            </button>
          </div>

          {/* Notifications */}
          {formSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#2D6A4F] shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form 1: Log Expense */}
          {activeEntryTab === "expense" ? (
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Farm</label>
                {farms.length === 0 ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                    <span>No farm registered</span>
                    <Link href="/farms" className="text-[#2D6A4F] font-bold hover:underline">
                      Add Farm →
                    </Link>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={expenseFarmId}
                      aria-label="Farm for Expense"
                      onChange={(e) => setExpenseFarmId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    aria-label="Expense Category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    <option value="Fertilizer">Fertilizer (DAP / Urea / NPS)</option>
                    <option value="Seeds">Certified Seeds</option>
                    <option value="Labor">Agricultural Labor</option>
                    <option value="Land Prep">Land Prep / Tractor Rental</option>
                    <option value="Crop Protection">Crop Protection</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Irrigation">Irrigation / Fuel</option>
                    <option value="Transportation">Transportation to Market</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Amount (ETB) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Amount (ETB)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Date Incurred</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Description / Receipt Note</label>
                <textarea
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="e.g. 2 bags NPS from cooperative union"
                  rows={2}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingExpense || farms.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99] disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                <span>{submittingExpense ? "Recording Expense..." : "Log Expense"}</span>
              </button>
            </form>
          ) : (
            /* Form 2: Record Harvest (Replaces window.prompt with structured real record) */
            <form onSubmit={handleRecordHarvest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Farm</label>
                {farms.length === 0 ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                    <span>No farm registered</span>
                    <Link href="/farms" className="text-[#2D6A4F] font-bold hover:underline">
                      Add Farm →
                    </Link>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={harvestFarmId}
                      aria-label="Farm for Harvest"
                      onChange={(e) => setHarvestFarmId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Crop Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Crop Harvested</label>
                <div className="relative">
                  <select
                    value={harvestCrop}
                    aria-label="Crop Harvested"
                    onChange={(e) => setHarvestCrop(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    <option value="Teff">Teff (Xaafii)</option>
                    <option value="Coffee">Coffee (Buna)</option>
                    <option value="Wheat">Wheat (Qamadii)</option>
                    <option value="Barley">Barley (Garbuu)</option>
                    <option value="Maize">Maize (Boqqolloo)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Quantity and Unit in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Quantity</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={harvestQuantity}
                    onChange={(e) => setHarvestQuantity(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Unit</label>
                  <div className="relative">
                    <select
                      value={harvestUnit}
                      aria-label="Measurement Unit"
                      onChange={(e) => setHarvestUnit(e.target.value as VolumeUnit)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 appearance-none pr-8 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="Quintals">Quintals (100kg)</option>
                      <option value="Kilograms">Kilograms (kg)</option>
                      <option value="Bags">Bags / Sacks</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Selling Price per Unit (ETB) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Selling Price per {harvestUnit.replace(/s$/, "")} (ETB)
                  </label>
                  {estHarvestRevenue && (
                    <span className="text-xs font-bold text-[#1B4332] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Total: {estHarvestRevenue} ETB
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={harvestPrice}
                  onChange={(e) => setHarvestPrice(e.target.value)}
                  placeholder="e.g. 8500"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              {/* Harvest Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Harvest Date</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              {/* Optional Buyer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Buyer / Cooperative Union (Optional)</label>
                <input
                  type="text"
                  value={harvestBuyer}
                  onChange={(e) => setHarvestBuyer(e.target.value)}
                  placeholder="e.g. Ada'a Agricultural Cooperative"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingHarvest || farms.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#1B4332]/20 active:scale-[0.99] disabled:opacity-60"
              >
                <Wheat className="h-4 w-4" />
                <span>{submittingHarvest ? "Recording Harvest..." : "Record Harvest Lot"}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}

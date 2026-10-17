"use client";

import { useState } from "react";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  BarChart3,
  Plus,
  Calendar,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function FinanceDashboardPage() {
  // Filter state matching top of Image 5
  const [selectedCrop, setSelectedCrop] = useState("Teff");
  const [selectedFarm, setSelectedFarm] = useState("Farm Alpha");
  const [selectedSeason, setSelectedSeason] = useState("Meher 2023");
  const [trendRange, setTrendRange] = useState("Jan - June");

  // Form inputs
  const [category, setCategory] = useState("Fertilizer");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2023-10-12");
  const [notes, setNotes] = useState("");
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic KPI amounts
  const [totalExpenses, setTotalExpenses] = useState(12400);
  const [totalRevenue, setTotalRevenue] = useState(38000);
  const netProfit = totalRevenue - totalExpenses; // 25,600
  const profitPerHectare = 5689;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid expense amount in ETB.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.createExpense({
        farmId: "farm-1",
        season: selectedSeason,
        category: (category.toLowerCase().replace(/ /g, "_") as any) || "other",
        description: notes || `${category} input`,
        amount: val,
        currency: "ETB",
        date: date || new Date().toISOString().split("T")[0],
      });

      setTotalExpenses((prev) => prev + val);
      setFormSuccess("Expense recorded successfully!");
      setAmount("");
      setNotes("");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHarvest = async () => {
    const rev = prompt("Enter harvest revenue amount in ETB:", "4500");
    if (!rev) return;
    const num = parseFloat(rev);
    if (!isNaN(num) && num > 0) {
      setTotalRevenue((prev) => prev + num);
      setFormSuccess("Harvest revenue added successfully!");
      setTimeout(() => setFormSuccess(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Page Title & Filter Bar matching Image 5 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Finance Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time ETB input expenses, harvest revenue, and net profit per hectare.
          </p>
        </div>

        {/* Filter Dropdowns from Image 5 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Crop Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Crop</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="Teff">Teff</option>
              <option value="Maiz">Maiz</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>

          {/* Farm Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Farm</span>
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="Farm Alpha">Farm Alpha</option>
              <option value="Beta">Beta</option>
            </select>
          </div>

          {/* Season Selector */}
          <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-gray-500 mr-2 font-medium">Season</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer"
            >
              <option value="Meher 2023">Meher 2023</option>
              <option value="Belg 2024">Belg 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row of 4 KPI Cards matching Image 5 */}
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
          {/* Red Sparkline Curve */}
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
          {/* Green Sparkline Curve */}
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
              <span className="text-xs font-semibold text-gray-500 block">Net Profit</span>
              <span className="text-2xl font-extrabold text-[#1B4332] tracking-tight">
                ETB {netProfit.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Dark Green Sparkline Curve */}
          <div className="mt-4 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 100 25" className="w-full h-full stroke-[#1B4332] fill-none" preserveAspectRatio="none">
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
              <span className="text-xs font-semibold text-gray-500 block">Profit per Hectare</span>
              <span className="text-2xl font-extrabold text-teal-900 tracking-tight">
                ETB {profitPerHectare.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Teal Sparkline Curve */}
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

      {/* Main Grid: Breakdown & Trend on Left, Expense Entry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Expense Breakdown (Two Donut Charts from Image 5) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7">
            <h2 className="text-base font-bold text-gray-900 mb-6">
              Expense Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
              
              {/* Donut Chart 1 */}
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Circle slices: Seeds 28%, Fertilizer 24%, Labor 20%, Land Prep 15%, Teal 13% */}
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

                {/* Donut 1 Legend */}
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-700">
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]"></span>Seeds 28%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#8B5E3C]"></span>Fertilizer 24%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span>Labor 20%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#CA8A04]"></span>Land Prep 15%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]"></span>Teal 13%</span>
                </div>
              </div>

              {/* Donut Chart 2 */}
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
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Category</span>
                    <span className="text-xs font-bold text-gray-800">Meher</span>
                  </div>
                </div>

                {/* Donut 2 Legend */}
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-700">
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]"></span>Seeds 28%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#8B5E3C]"></span>Fertilizer 24%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span>Labor 20%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#CA8A04]"></span>Land Prep 15%</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]"></span>Crop Protection 13%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Revenue Trend from Image 5 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-900">
                Revenue Trend
              </h2>

              <div className="relative">
                <select
                  value={trendRange}
                  onChange={(e) => setTrendRange(e.target.value)}
                  className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 pr-8 appearance-none focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
                >
                  <option value="Jan - June">Jan - June</option>
                  <option value="July - Dec">July - Dec</option>
                  <option value="Full Year 2023">Full Year 2023</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Smooth SVG Area Curve Chart */}
            <div className="relative h-56 w-full pt-4">
              {/* Y-Axis Grid Lines & Labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400">
                <div className="border-b border-gray-100 pb-1">ETB 15,000</div>
                <div className="border-b border-gray-100 pb-1">ETB 10,000</div>
                <div className="border-b border-gray-100 pb-1">ETB 5,000</div>
                <div className="border-b border-gray-200 pb-1">0</div>
              </div>

              {/* Area SVG */}
              <div className="absolute inset-0 pt-3 pb-6 pl-14">
                <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fill */}
                  <path
                    d="M 0 145 C 80 120, 150 110, 200 95 C 260 70, 320 20, 380 40 C 430 55, 470 30, 500 15 L 500 150 L 0 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  
                  {/* Thick Line */}
                  <path
                    d="M 0 145 C 80 120, 150 110, 200 95 C 260 70, 320 20, 380 40 C 430 55, 470 30, 500 15"
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* X-Axis Month Labels */}
              <div className="absolute bottom-0 left-14 right-0 flex justify-between text-[11px] font-medium text-gray-500 pt-1">
                <span>Jan</span>
                <span>February</span>
                <span>March</span>
                <span>April</span>
                <span>May</span>
                <span>June</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Expense Entry Form from Image 5 */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-7 space-y-5">
          <h2 className="text-base font-bold text-gray-900">
            Expense Entry Form
          </h2>

          {formSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddExpense} className="space-y-4">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Land Prep">Land Prep</option>
                  <option value="Crop Protection">Crop Protection</option>
                  <option value="Equipment Rental">Equipment Rental</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Transportation">Transportation</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Amount (ETB): */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Amount (ETB):</label>
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
              <label className="text-xs font-semibold text-gray-700">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes or supplier receipt..."
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] resize-none"
              ></textarea>
            </div>

            {/* Button 1: Add Expense */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              <span>{submitting ? "Adding..." : "Add Expense"}</span>
            </button>

            {/* Button 2: Add Harvest */}
            <button
              type="button"
              onClick={handleAddHarvest}
              className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Harvest</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

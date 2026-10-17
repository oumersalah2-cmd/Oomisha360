"use client";

import { useState } from "react";
import {
  calculateExpenseTotal,
  calculateCostPerHectare,
  calculateRevenue,
  calculateProfit,
  calculateProfitPerHectare,
  VolumeUnit,
} from "@gebere/shared";
import {
  Calculator,
  Coins,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function ProfitCalculatorPage() {
  // Scenario inputs
  const [cropName, setCropName] = useState("White Teff (Magna)");
  const [areaHectares, setAreaHectares] = useState<string>("3.5");
  const [harvestQuantity, setHarvestQuantity] = useState<string>("38");
  const [harvestUnit, setHarvestUnit] = useState<VolumeUnit>("Quintals");
  const [unitSellingPrice, setUnitSellingPrice] = useState<string>("6800");

  // Dynamic cost item breakdown
  const [expenseItems, setExpenseItems] = useState<Array<{ id: string; label: string; amount: string }>>([
    { id: "1", label: "Land Preparation & Plowing", amount: "8500" },
    { id: "2", label: "Seeds & Seedlings", amount: "6200" },
    { id: "3", label: "Fertilizer (NPSB & Urea)", amount: "14800" },
    { id: "4", label: "Labor & Field Weeding", amount: "9000" },
    { id: "5", label: "Transportation to Union", amount: "4500" },
  ]);

  const handleExpenseChange = (id: string, newAmount: string) => {
    setExpenseItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: newAmount } : item))
    );
  };

  const handleAddExpenseRow = () => {
    setExpenseItems((prev) => [
      ...prev,
      { id: String(Date.now()), label: "Additional Operational Cost", amount: "0" },
    ]);
  };

  const handleRemoveExpenseRow = (id: string) => {
    setExpenseItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Perform Calculations
  const parsedArea = parseFloat(areaHectares) || 0;
  const parsedQuantity = parseFloat(harvestQuantity) || 0;
  const parsedPrice = parseFloat(unitSellingPrice) || 0;

  const totalCosts = calculateExpenseTotal(
    expenseItems.map((e) => ({ amount: parseFloat(e.amount) || 0 }))
  );
  const costPerHa = calculateCostPerHectare(totalCosts, parsedArea);
  const totalRevenue = calculateRevenue(parsedQuantity, parsedPrice);
  const netProfit = calculateProfit(totalRevenue, totalCosts);
  const profitPerHa = calculateProfitPerHectare(netProfit, parsedArea);
  const isProfitable = netProfit >= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
          Harvest Profit Simulator
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Interactive yield scenario planner, unit economics, and profit-per-hectare modeling in ETB.
        </p>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Total Expenditure</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            ETB {totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {costPerHa.toLocaleString(undefined, { maximumFractionDigits: 1 })} ETB / Ha
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Gross Revenue</span>
          <div className="text-2xl font-extrabold text-[#2D6A4F] mt-1">
            ETB {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {parsedQuantity} {harvestUnit} @ {parsedPrice} ETB
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Estimated Net Profit</span>
          <div className={`text-2xl font-extrabold mt-1 ${isProfitable ? "text-[#1B4332]" : "text-red-600"}`}>
            ETB {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {isProfitable ? "Positive margin" : "Operational deficit"}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Profit per Hectare</span>
          <div className={`text-2xl font-extrabold mt-1 ${isProfitable ? "text-teal-800" : "text-red-500"}`}>
            ETB {profitPerHa.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Over {parsedArea} Hectares
          </span>
        </div>
      </div>

      {/* Grid: Scenario Form on Left, Cost Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Yield & Price Variables */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-gray-900">
            Yield & Market Parameters
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Crop Variety</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Cultivated Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={areaHectares}
                onChange={(e) => setAreaHectares(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Harvest Yield</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={harvestQuantity}
                  onChange={(e) => setHarvestQuantity(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Unit</label>
                <select
                  value={harvestUnit}
                  onChange={(e) => setHarvestUnit(e.target.value as VolumeUnit)}
                  className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none"
                >
                  <option value="Quintals">Quintals</option>
                  <option value="Metric Tons">Metric Tons</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Selling Price per {harvestUnit} (ETB)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={unitSellingPrice}
                onChange={(e) => setUnitSellingPrice(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cost Center Inputs */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Operating Expenditure Inputs
            </h2>
            <button
              type="button"
              onClick={handleAddExpenseRow}
              className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {expenseItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.label}
                  readOnly
                  className="flex-1 bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                />
                <div className="relative w-36">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                    ETB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExpenseRow(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
            <span className="text-gray-700">Subtotal Production Cost:</span>
            <span className="text-[#1A1A2E]">ETB {totalCosts.toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}

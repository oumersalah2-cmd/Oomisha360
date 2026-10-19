"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Farm,
  FinanceSummary,
  LandRecord,
} from "@gebere/shared";
import { apiClient } from "@/lib/api-client";
import {
  LayoutDashboard,
  Sprout,
  Calculator,
  Wallet,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [plots, setPlots] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [farmList, finData, plotList] = await Promise.all([
        apiClient.getFarms(),
        apiClient.getFinanceSummary(),
        apiClient.getLandRecords(),
      ]);
      setFarms(farmList);
      setFinance(finData);
      setPlots(plotList);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Farm Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Centralized telemetry for registered land parcels, seasonal costs, and harvest lots.
          </p>
        </div>

        <Link
          href="/farms"
          className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Sprout className="h-4 w-4" />
          <span>Go to My Farm</span>
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Registered Land</span>
          <div className="text-2xl font-extrabold text-[#1A1A2E] mt-1">
            {farms.reduce((acc, f) => acc + f.totalHectares, 0).toFixed(2)} Ha
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {farms.length} active estate holdings
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Seasonal Expenses</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            ETB {finance ? finance.totalCost.toLocaleString() : "0"}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {finance && finance.categoryBreakdown.length > 0
              ? `${finance.categoryBreakdown.length} logged expense categories`
              : "Total recorded input costs"}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Expected Revenue</span>
          <div className="text-2xl font-extrabold text-[#2D6A4F] mt-1">
            ETB {finance ? finance.totalRevenue.toLocaleString() : "0"}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {finance
              ? `Estimated Net: ETB ${finance.estimatedProfit.toLocaleString()}`
              : "Aggregated harvest revenues"}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-5">
          <span className="text-xs font-semibold text-gray-500 block">Net Projected Profit</span>
          <div className="text-2xl font-extrabold text-[#1B4332] mt-1">
            ETB {finance ? finance.estimatedProfit.toLocaleString() : "25,600"}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            ETB 5,689 / Hectare
          </span>
        </div>
      </div>

      {/* Quick Action Modules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/land-calculator"
          className="bg-white rounded-2xl p-6 border border-[#E5DFD3] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2D6A4F] transition-colors">
              Land Calculator
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Calculate rectangular perimeter bounds or estimate GPS polygon area on OpenStreetMap tiles.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#2D6A4F]">
            <span>Open Tool</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/crops"
          className="bg-white rounded-2xl p-6 border border-[#E5DFD3] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#8B5E3C] flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2D6A4F] transition-colors">
              Crops Intelligence
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Agronomic profiles for Coffee (Buna), Teff (Xaafii), Wheat (Qamadii), and Barley (Garbuu).
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#8B5E3C]">
            <span>View Crops</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/finance"
          className="bg-white rounded-2xl p-6 border border-[#E5DFD3] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2D6A4F] transition-colors">
              Finance Dashboard
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Interactive donut cost breakdowns, seasonal revenue curves, and ETB profit-per-hectare telemetry.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-teal-800">
            <span>Open Finance</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

    </div>
  );
}

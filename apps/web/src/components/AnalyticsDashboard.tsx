"use client";

import { useApp } from "@/context/AppContext";
import { TrendingUp, Users, Sprout, Activity, AlertTriangle, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";
import { useState } from "react";

export default function AnalyticsDashboard() {
  const { listings, diagnoses } = useApp();
  const [activeTab, setActiveTab] = useState<"outbreaks" | "prices">("outbreaks");

  // Calculate metrics
  const totalVolume = listings.reduce((acc, curr) => {
    // If unit is Quintals, convert to MT for display consistency (1 MT = 10 Quintals)
    const amt = curr.volume.unit === "Quintals" ? curr.volume.amount / 10 : curr.volume.amount;
    return acc + amt;
  }, 0);

  const avgMoisture = (listings.reduce((acc, curr) => acc + curr.moistureLevel, 0) / listings.length).toFixed(1);

  // Group diagnoses by crop for outbreak chart
  const cropCounts = diagnoses.reduce((acc, curr) => {
    acc[curr.crop] = (acc[curr.crop] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const crops = ["Coffee", "Wheat", "Maize", "Teff"];
  const maxCount = Math.max(...crops.map(c => cropCounts[c] || 0), 1);

  // Mock commodity prices history for Sparklines
  const commodityPrices = [
    { name: "Specialty Coffee (Yirgacheffe)", price: "$6.20 / kg", trend: "+4.2%", type: "up", history: [40, 45, 42, 48, 55, 62] },
    { name: "Durum Wheat", price: "85 ETB / kg", trend: "-1.5%", type: "down", history: [90, 88, 87, 89, 86, 85] },
    { name: "White Teff (Magna)", price: "110 ETB / kg", trend: "+6.8%", type: "up", history: [95, 98, 100, 104, 107, 110] },
    { name: "Red Sorghum", price: "60 ETB / kg", trend: "0.0%", type: "neutral", history: [60, 60, 60, 60, 60, 60] }
  ];

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-charcoal border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-green/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">
              Total AI Diagnoses
            </span>
            <Activity className="h-4 w-4 text-emerald-green" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {5120 + diagnoses.length}
            </span>
            <span className="text-[10px] text-emerald-green font-bold">+12% this wk</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Real-time vector grounded queries via Telegram.</p>
        </div>

        <div className="bg-charcoal border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-green/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">
              Active Farmers
            </span>
            <Users className="h-4 w-4 text-emerald-green" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">2,482</span>
            <span className="text-[10px] text-emerald-green font-bold">+8.4% growth</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Registered smallholders and union co-op leaders.</p>
        </div>

        <div className="bg-charcoal border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-green/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">
              Verified Volume
            </span>
            <Sprout className="h-4 w-4 text-emerald-green" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {totalVolume.toFixed(0)} MT
            </span>
            <span className="text-[10px] text-zinc-400 font-bold">in marketplace</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Directly listed from certified union storehouses.</p>
        </div>

        <div className="bg-charcoal border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-green/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">
              Avg Moisture Level
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-green" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">{avgMoisture}%</span>
            <span className="text-[10px] text-emerald-green font-bold">Safe Storage</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">CABI benchmark moisture standard limit: 13.5%.</p>
        </div>
      </div>

      {/* Main Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Disease Outbreaks map and trend */}
        <div className="lg:col-span-7 bg-[#0d0d0f]/90 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider block">
                  Regional Crop Epidemic Monitoring
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Active Disease Diagnostic Spikes
                </h3>
              </div>
              <div className="flex bg-obsidian border border-zinc-850 p-0.5 rounded-lg">
                <button
                  onClick={() => setActiveTab("outbreaks")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    activeTab === "outbreaks" ? "bg-emerald-green text-obsidian" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Outbreaks
                </button>
                <button
                  onClick={() => setActiveTab("prices")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    activeTab === "prices" ? "bg-emerald-green text-obsidian" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Market Prices
                </button>
              </div>
            </div>

            {activeTab === "outbreaks" ? (
              <div className="space-y-6">
                {/* Visual Chart */}
                <div className="h-44 flex items-end justify-around pb-2 border-b border-zinc-800/80 pt-4">
                  {crops.map((c) => {
                    const count = cropCounts[c] || 0;
                    const percent = Math.max((count / maxCount) * 100, 10);
                    return (
                      <div key={c} className="flex flex-col items-center w-1/5 group">
                        <span className="text-[10px] text-zinc-400 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {count} Cases
                        </span>
                        <div 
                          style={{ height: `${percent * 1.1}px` }}
                          className="w-full bg-emerald-green/20 border-t-2 border-emerald-green rounded-t-md hover:bg-emerald-green/45 transition-all duration-500 shadow-lg shadow-emerald-green/5"
                        />
                        <span className="text-[10px] text-zinc-500 mt-2 font-bold">{c}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-charcoal/50 border border-zinc-850 p-4 rounded-xl">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Highest Alert Zone</span>
                    <span className="text-sm font-bold text-white block mt-1">Bale Zone, Oromia</span>
                    <span className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>Wheat Rust Spreads (+14% scans)</span>
                    </span>
                  </div>
                  <div className="bg-charcoal/50 border border-zinc-850 p-4 rounded-xl">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Safest Yield Forecast</span>
                    <span className="text-sm font-bold text-white block mt-1">Ada'a Union, East Shewa</span>
                    <span className="text-[9px] text-emerald-green font-bold flex items-center gap-1 mt-1">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span>98% Disease-Free Teff Harvest</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Commodity price grid */}
                <div className="divide-y divide-zinc-850">
                  {commodityPrices.map((cp, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{cp.name}</span>
                        <span className="text-[10px] text-zinc-500 block">Grade 1 Export Standard</span>
                      </div>
                      
                      {/* Mini Sparkline Chart */}
                      <div className="h-6 w-20 flex items-end gap-[2px]">
                        {cp.history.map((h, hIdx) => {
                          const min = Math.min(...cp.history);
                          const max = Math.max(...cp.history);
                          const range = max - min || 1;
                          const height = 4 + ((h - min) / range) * 16;
                          return (
                            <div
                              key={hIdx}
                              style={{ height: `${height}px` }}
                              className={`w-[2px] rounded-full ${
                                cp.type === "up" ? "bg-emerald-green" : cp.type === "down" ? "bg-red-500" : "bg-zinc-500"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">{cp.price}</span>
                        <span className={`text-[10px] font-bold ${
                          cp.type === "up" ? "text-emerald-green" : cp.type === "down" ? "text-red-500" : "text-zinc-500"
                        }`}>
                          {cp.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Scan Log */}
        <div className="lg:col-span-5 bg-charcoal border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider block mb-1">
              Live Diagnostic Feeds
            </span>
            <h3 className="text-lg font-bold text-white mb-6">
              Recent AI Bot Submissions
            </h3>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {diagnoses.map((d) => (
                <div key={d.id} className="bg-obsidian/60 border border-zinc-800/80 p-3 rounded-xl flex items-start justify-between gap-3 group hover:border-emerald-green/10 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        d.severity === "high" ? "bg-red-500" : d.severity === "medium" ? "bg-yellow-500" : "bg-emerald-green"
                      }`} />
                      <span className="text-[10px] font-extrabold text-white">
                        {d.crop} &bull; {d.diseaseName}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-500">
                      Location: {d.woreda}, {d.region} &bull; Lang: {d.language}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-green block">{d.confidence}% conf</span>
                    <span className="text-[8px] text-zinc-650 font-mono">
                      {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[9px] text-zinc-500">Real-time data synced directly with B2B marketplace maps.</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-green hover:underline cursor-pointer">
              <span>View Outbreak Map</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
          <Activity className="h-3.5 w-3.5" />
          <span>Real-time Agricultural Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Regional Outbreak & Yield Telemetry
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
          Aggregating regional voice and visual diagnostics from the Telegram Bot. Tracking disease progression vectors, crop health levels, and disintermediated marketplace pricing trends across cooperative unions.
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}

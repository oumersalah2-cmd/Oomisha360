"use client";

import CooperativePortal from "@/components/CooperativePortal";
import { ShieldCheck } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Union Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Cooperative Union Portal
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
          Administer and list union storehouse produce directly on the B2B marketplace. Every listing is graded and verified with simulated moisture analyses to ensure buyers receive standard, premium agricultural commodities.
        </p>
      </div>

      <CooperativePortal />
    </div>
  );
}

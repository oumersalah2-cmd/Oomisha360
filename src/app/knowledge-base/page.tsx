"use client";

import { useState } from "react";
import { diseases } from "@/data/diseases";
import DiseaseCard from "@/components/DiseaseCard";
import { Search, Filter, ShieldAlert } from "lucide-react";

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");

  const cropOptions = ["All", "Coffee", "Wheat", "Maize", "Teff"];

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.name.am.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.symptoms.en.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop = selectedCrop === "All" || disease.crop === selectedCrop;

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>CABI Plantwise Grounded RAG</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Agronomic Disease Encyclopedia
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
          Access verified crop protection advice, biological remedies, and restricted chemical therapies. Grounded directly in CABI Plantwise standards to ensure zero hallucination.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-charcoal p-4 rounded-2xl border border-zinc-800/80 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by scientific name, symptoms, coffee, rust..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-emerald-green focus:outline-none placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-emerald-green shrink-0" />
          <div className="flex gap-1.5 overflow-x-auto">
            {cropOptions.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                  selectedCrop === crop
                    ? "bg-emerald-green text-obsidian border-emerald-green"
                    : "bg-obsidian border-zinc-850 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results grid */}
      {filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDiseases.map((d) => (
            <DiseaseCard key={d.id} disease={d} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-charcoal border border-dashed border-zinc-800 rounded-2xl">
          <span className="text-3xl">🔍</span>
          <h3 className="text-base font-bold text-white mt-3">No diseases found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or checking for spelling errors. Supported crops include Coffee, Wheat, Maize, and Teff.
          </p>
        </div>
      )}
    </div>
  );
}

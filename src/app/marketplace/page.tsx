"use client";

import { useState } from "react";
import { marketplaceListings } from "@/data/marketplace";
import ListingCard from "@/components/ListingCard";
import { Search, Filter, ShieldCheck, HelpCircle } from "lucide-react";

export default function Marketplace() {
  const [selectedCommodity, setSelectedCommodity] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const commodities = ["All", "Specialty Coffee", "Wheat", "White Teff", "Sorghum"];
  const regions = ["All", "Oromia", "Sidama", "SNNPR / Sidama"];

  const filteredListings = marketplaceListings.filter((listing) => {
    const matchesSearch =
      listing.cooperativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommodity =
      selectedCommodity === "All" || listing.commodityName === selectedCommodity;

    const matchesRegion =
      selectedRegion === "All" || listing.location.region.includes(selectedRegion);

    return matchesSearch && matchesCommodity && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Broker-Free Supply Chain Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            B2B Produce Marketplace
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
            Connecting verified Ethiopian agricultural cooperative unions directly with food processors, grain millers, and global coffee exporters. Built to eliminate predatory intermediary fees.
          </p>
        </div>

        <div className="bg-charcoal/50 border border-zinc-800 p-4 rounded-xl flex items-start gap-3 max-w-sm">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="text-xs font-bold text-white">How it works</h4>
            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
              When farmers diagnose crop diseases, we collect harvest forecasts. Verified listings include guaranteed moisture levels and volume certified at union storehouses.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-charcoal border border-zinc-800/80 rounded-2xl p-5 space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by cooperative name, variety, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-emerald-green focus:outline-none placeholder-zinc-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Commodity:</span>
            <div className="flex gap-1 overflow-x-auto">
              {commodities.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedCommodity(item)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedCommodity === item
                      ? "bg-emerald-green text-obsidian border-emerald-green"
                      : "bg-obsidian border-zinc-850 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Region:</span>
            <div className="flex gap-1 overflow-x-auto">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedRegion === region
                      ? "bg-emerald-green text-obsidian border-emerald-green"
                      : "bg-obsidian border-zinc-850 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {region === "SNNPR / Sidama" ? "Sidama Union" : region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-charcoal border border-dashed border-zinc-800 rounded-2xl">
          <span className="text-3xl">🌾</span>
          <h3 className="text-base font-bold text-white mt-3">No active listings</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your commodity or regional filter. Farmers list harvests as soon as moisture analysis completes.
          </p>
        </div>
      )}
    </div>
  );
}

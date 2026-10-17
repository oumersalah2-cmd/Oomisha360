"use client";

import { useState, useEffect } from "react";
import {
  MarketplaceListing,
  CommodityCategory,
  COMMODITY_CATEGORY_LABELS,
  VolumeUnit,
} from "@gebere/shared";
import { apiClient } from "@/lib/api-client";
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Send,
  X,
  AlertCircle,
  ChevronDown
} from "lucide-react";

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [myOnly, setMyOnly] = useState(false);

  // Create Listing Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newCommodity, setNewCommodity] = useState("White Teff");
  const [newVariety, setNewVariety] = useState("Magna Grade 1");
  const [newCategory, setNewCategory] = useState<CommodityCategory>("cereals_grains");
  const [newDescription, setNewDescription] = useState("");
  const [newVolume, setNewVolume] = useState("100");
  const [newVolumeUnit, setNewVolumeUnit] = useState<VolumeUnit>("Quintals");
  const [newPrice, setNewPrice] = useState("110");
  const [newPriceUnit, setNewPriceUnit] = useState<"kg" | "Quintal" | "Metric Ton">("kg");
  const [newRegion, setNewRegion] = useState("Oromia");
  const [newZone, setNewZone] = useState("East Shewa");
  const [newWoreda, setNewWoreda] = useState("Bishoftu");
  const [newCoop, setNewCoop] = useState("Ada'a Agricultural Cooperative");
  const [newContactPerson, setNewContactPerson] = useState("Abebe Demisse");
  const [newPhone, setNewPhone] = useState("+251 91 123 4567");
  const [newHarvestYear, setNewHarvestYear] = useState(2023);

  // Inquiry Modal State
  const [inquiryListing, setInquiryListing] = useState<MarketplaceListing | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerMessage, setBuyerMessage] = useState("");
  const [buyerOfferPrice, setBuyerOfferPrice] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await apiClient.getListings();
      setListings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const vol = parseFloat(newVolume);
    const prc = parseFloat(newPrice);

    if (!newCommodity || isNaN(vol) || vol <= 0 || isNaN(prc) || prc <= 0) {
      setStatusMsg("Please enter valid volume and asking price.");
      return;
    }

    try {
      const created = await apiClient.createListing({
        commodityName: newCommodity,
        variety: newVariety,
        category: newCategory,
        description: newDescription,
        volumeAmount: vol,
        volumeUnit: newVolumeUnit,
        moistureLevel: 11.2,
        askingPriceAmount: prc,
        priceUnit: newPriceUnit,
        currency: "ETB",
        region: newRegion,
        zone: newZone,
        woreda: newWoreda,
        cooperativeName: newCoop,
        contactPerson: newContactPerson,
        contactPhone: newPhone,
        certifications: [],
        status: "active",
        imageUrls: [],
        isVerified: true,
        harvestYear: newHarvestYear,
      });

      if (created) {
        setListings((prev) => [created, ...prev]);
      }
      setIsCreating(false);
      setStatusMsg("Harvest lot listed successfully on Oomisha360 Marketplace!");
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg(err.message || "Failed to create listing.");
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryListing || !buyerName || !buyerPhone || !buyerMessage) return;

    try {
      await apiClient.submitInquiry(inquiryListing.id, {
        senderName: buyerName,
        senderPhone: buyerPhone,
        senderEmail: buyerEmail || null,
        message: buyerMessage,
        offeredPrice: buyerOfferPrice ? parseFloat(buyerOfferPrice) : null,
      });

      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setInquiryListing(null);
        setBuyerMessage("");
        setBuyerOfferPrice("");
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { key: "All", label: "All Commodities" },
    ...Object.entries(COMMODITY_CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
  ];

  const regions = [
    "All",
    "Oromia",
    "Amhara",
    "Sidama",
    "South Ethiopia",
    "Central Ethiopia",
    "Southwest Ethiopia",
    "Tigray",
    "Somali",
    "Afar",
    "Benishangul-Gumuz",
    "Gambela",
    "Harari",
    "Dire Dawa",
    "Addis Ababa",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            Agricultural Marketplace
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Direct B2B trade connecting cooperative unions with grain millers, exporters, and processors.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreating ? "Close Form" : "List Harvest Lot"}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Post Listing Form Card */}
      {isCreating && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DFD3] shadow-md space-y-5 animate-fade-in">
          <h2 className="text-base font-bold text-gray-900">
            Post Harvest Listing for B2B Buyers
          </h2>

          <form onSubmit={handleCreateListing} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Commodity</label>
              <input
                type="text"
                value={newCommodity}
                onChange={(e) => setNewCommodity(e.target.value)}
                placeholder="e.g. Magna White Teff"
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Variety / Grade</label>
              <input
                type="text"
                value={newVariety}
                onChange={(e) => setNewVariety(e.target.value)}
                placeholder="e.g. Export Grade 1"
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Volume</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newVolume}
                  onChange={(e) => setNewVolume(e.target.value)}
                  className="flex-1 bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
                <select
                  value={newVolumeUnit}
                  onChange={(e) => setNewVolumeUnit(e.target.value as VolumeUnit)}
                  className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                >
                  <option value="Quintals">Quintals</option>
                  <option value="Metric Tons">Metric Tons</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Asking Price (ETB)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="flex-1 bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
                <select
                  value={newPriceUnit}
                  onChange={(e) => setNewPriceUnit(e.target.value as any)}
                  className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-2 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                >
                  <option value="kg">per kg</option>
                  <option value="Quintal">per Quintal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Region</label>
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Cooperative Union</label>
              <input
                type="text"
                value={newCoop}
                onChange={(e) => setNewCoop(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Moisture content, warehouse silo location, bag quality..."
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl p-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F] resize-none"
                required
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-sm"
              >
                Publish Lot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD3] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search teff, wheat, coffee, cooperative..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-gray-500">Region:</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Listings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((l) => (
          <div
            key={l.id}
            className="bg-white rounded-2xl p-6 border border-[#E5DFD3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider block">
                    {COMMODITY_CATEGORY_LABELS[l.category] || l.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">{l.commodityName}</h3>
                  <p className="text-xs text-gray-500">{l.variety}</p>
                </div>

                {l.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2D6A4F] border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {l.description}
              </p>

              {/* Volume & Price Box */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F5F0E8] border border-[#E5DFD3] p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-500 block">Available Volume</span>
                  <span className="font-bold text-gray-900">
                    {l.volumeAmount} {l.volumeUnit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Asking Price</span>
                  <span className="font-bold text-[#2D6A4F]">
                    {l.askingPriceAmount} {l.currency} / {l.priceUnit}
                  </span>
                </div>
                {l.moistureLevel && (
                  <div className="col-span-2 pt-1 border-t border-gray-200/60 flex justify-between text-[11px]">
                    <span className="text-gray-500">Moisture Content:</span>
                    <span className="text-gray-800 font-semibold">{l.moistureLevel}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0" />
                <span className="truncate">
                  {l.region}, {l.zone} ({l.cooperativeName || "Union"})
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setInquiryListing(l)}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-[#40916C] hover:bg-[#2D6A4F] py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Inquire to Cooperative</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      {inquiryListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5DFD3] shadow-2xl relative space-y-4 animate-scale-up">
            <button
              onClick={() => setInquiryListing(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                Direct Union Inquiry
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                {inquiryListing.commodityName} — {inquiryListing.cooperativeName}
              </h2>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-[#2D6A4F] mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-gray-500">
                  The cooperative trade manager has received your notice.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Full Name / Company</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Al-Nour Grain Millers"
                    className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+251 9..."
                      className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Counter-Offer Price (ETB)</label>
                    <input
                      type="number"
                      value={buyerOfferPrice}
                      onChange={(e) => setBuyerOfferPrice(e.target.value)}
                      placeholder={inquiryListing.askingPriceAmount.toString()}
                      className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Inquiry Message</label>
                  <textarea
                    rows={3}
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                    placeholder="Inquire on delivery schedule, payment terms, quality certificates..."
                    className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#2D6A4F] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-md shadow-[#2D6A4F]/20"
                >
                  Transmit Inquiry to Cooperative
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

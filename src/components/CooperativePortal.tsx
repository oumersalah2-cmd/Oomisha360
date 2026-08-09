"use client";

import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { BadgeCheck, Scale, Droplet, Sprout, PlusCircle, CheckCircle, RefreshCw, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CooperativePortal() {
  const { addListing } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moistureScore, setMoistureScore] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newListingId, setNewListingId] = useState("");

  const [form, setForm] = useState({
    commodityName: "Specialty Coffee",
    variety: "",
    cooperativeName: "",
    region: "Oromia",
    zone: "",
    woreda: "",
    volumeAmount: "",
    volumeUnit: "Metric Tons" as "Metric Tons" | "Quintals",
    askingPrice: "",
    currency: "USD" as "USD" | "ETB",
    contactPerson: "",
    description: "",
    certifications: [] as string[]
  });

  const availableCrops = ["Specialty Coffee", "Wheat", "White Teff", "Sorghum"];
  const certOptions = ["Fairtrade Certified", "Organic USDA", "Rainforest Alliance", "CABI High Yield Certified", "Non-GMO"];

  // Handle moisture analysis simulation
  const runMoistureTest = () => {
    setIsAnalyzing(true);
    setMoistureScore(null);
    setTimeout(() => {
      // Grains/Coffee generally need 10.5% - 13.5%
      const val = parseFloat((10.5 + Math.random() * 2.5).toFixed(1));
      setMoistureScore(val);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!moistureScore) {
      alert("Please perform the Simulated Moisture Quality Analysis first!");
      return;
    }

    const listingData = {
      commodityName: form.commodityName,
      variety: form.variety || `${form.commodityName} Premium Grade`,
      cooperativeName: form.cooperativeName || "Local Farmers Cooperative Union",
      location: {
        region: form.region,
        zone: form.zone || "Central Zone",
        woreda: form.woreda || "District A"
      },
      volume: {
        amount: parseFloat(form.volumeAmount) || 10,
        unit: form.volumeUnit
      },
      moistureLevel: moistureScore,
      askingPrice: {
        amount: parseFloat(form.askingPrice) || 5,
        currency: form.currency,
        unit: "kg" as const
      },
      certifications: form.certifications.length > 0 ? form.certifications : ["Verified Cooperatives"],
      isVerified: moistureScore <= 13.5, // Standard moisture threshold
      harvestYear: new Date().getFullYear(),
      contactPerson: form.contactPerson || "Union Admin",
      imagePlaceholder: getCropImage(form.commodityName),
      description: form.description || `Premium quality ${form.commodityName} harvest with guaranteed moisture level of ${moistureScore}%.`
    };

    addListing(listingData);
    setIsSuccess(true);
    
    // Reset form after submission
    setTimeout(() => {
      setIsSuccess(false);
      setMoistureScore(null);
      setForm({
        commodityName: "Specialty Coffee",
        variety: "",
        cooperativeName: "",
        region: "Oromia",
        zone: "",
        woreda: "",
        volumeAmount: "",
        volumeUnit: "Metric Tons",
        askingPrice: "",
        currency: "USD",
        contactPerson: "",
        description: "",
        certifications: []
      });
    }, 3000);
  };

  const getCropImage = (crop: string) => {
    switch (crop) {
      case "Specialty Coffee":
        return "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80";
      case "Wheat":
        return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80";
      case "White Teff":
        return "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80";
      default:
        return "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80";
    }
  };

  const handleCheckboxChange = (cert: string) => {
    setForm((prev) => {
      const exists = prev.certifications.includes(cert);
      const certifications = exists
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert];
      return { ...prev, certifications };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Registration Form (Left) */}
      <div className="lg:col-span-7 bg-[#0d0d0f]/90 border border-zinc-800/80 rounded-2xl p-6 relative">
        {isSuccess ? (
          <div className="absolute inset-0 bg-[#0d0d0f] rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-4 z-20">
            <CheckCircle className="h-16 w-16 text-emerald-green animate-bounce" />
            <h3 className="text-2xl font-black text-white">Harvest Registry Successful!</h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Your harvest has been graded, verified, and listed directly on the B2B Produce Marketplace. Moisture content was certified at {moistureScore}%.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="/marketplace"
                className="bg-emerald-green text-obsidian px-5 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-green/10 hover:shadow-emerald-green/20 transition-all"
              >
                Go to Marketplace
              </Link>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Union Produce Registry</h3>
            <p className="text-xs text-zinc-400">
              Cooperative unions register harvests directly from secure storehouses. Listings require lab analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Commodity Crop
              </label>
              <select
                value={form.commodityName}
                onChange={(e) => setForm({ ...form, commodityName: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
              >
                {availableCrops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Specific Variety / Grade
              </label>
              <input
                type="text"
                required
                value={form.variety}
                onChange={(e) => setForm({ ...form, variety: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                placeholder="e.g. Harar G3 (Natural)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Cooperative Union Name
              </label>
              <input
                type="text"
                required
                value={form.cooperativeName}
                onChange={(e) => setForm({ ...form, cooperativeName: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                placeholder="e.g. Chercher Highlands Union"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Contact Officer Name
              </label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                placeholder="e.g. Chala Tolossa"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
              >
                <option value="Oromia">Oromia</option>
                <option value="Sidama">Sidama</option>
                <option value="Amhara">Amhara</option>
                <option value="SNNPR">SNNPR</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">Zone</label>
              <input
                type="text"
                required
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                placeholder="e.g. Arsi"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">Woreda</label>
              <input
                type="text"
                required
                value={form.woreda}
                onChange={(e) => setForm({ ...form, woreda: e.target.value })}
                className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                placeholder="e.g. Tiyo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Produce Volume
              </label>
              <div className="flex bg-obsidian border border-zinc-800 rounded-lg overflow-hidden focus-within:border-emerald-green">
                <input
                  type="number"
                  required
                  value={form.volumeAmount}
                  onChange={(e) => setForm({ ...form, volumeAmount: e.target.value })}
                  className="flex-1 bg-transparent p-2.5 text-xs text-white focus:outline-none"
                  placeholder="e.g. 24"
                />
                <select
                  value={form.volumeUnit}
                  onChange={(e) => setForm({ ...form, volumeUnit: e.target.value as any })}
                  className="bg-charcoal text-[10px] font-bold border-l border-zinc-800 px-3 py-1 focus:outline-none text-zinc-400"
                >
                  <option value="Metric Tons">MT</option>
                  <option value="Quintals">Quintals</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
                Asking Price / kg
              </label>
              <div className="flex bg-obsidian border border-zinc-800 rounded-lg overflow-hidden focus-within:border-emerald-green">
                <input
                  type="number"
                  required
                  step="0.01"
                  value={form.askingPrice}
                  onChange={(e) => setForm({ ...form, askingPrice: e.target.value })}
                  className="flex-1 bg-transparent p-2.5 text-xs text-white focus:outline-none"
                  placeholder="e.g. 5.80"
                />
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as any })}
                  className="bg-charcoal text-[10px] font-bold border-l border-zinc-800 px-3 py-1 focus:outline-none text-zinc-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="ETB">ETB (Br)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
              Cooperative Certifications
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {certOptions.map((cert) => {
                const checked = form.certifications.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleCheckboxChange(cert)}
                    className={`py-1.5 px-2.5 rounded-lg text-[9px] font-bold border transition-all text-left ${
                      checked
                        ? "bg-emerald-green/10 border-emerald-green text-emerald-green"
                        : "bg-obsidian border-zinc-800 text-zinc-500 hover:text-zinc-400"
                    }`}
                  >
                    {cert}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550 mb-1">
              Produce Description & Traceability Details
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none resize-none"
              placeholder="Provide floral notes, moisture silos, community size, or transport schedules..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-green hover:bg-emerald-green/90 text-obsidian py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-emerald-green/10 hover:shadow-emerald-green/25 transition-all"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Submit Verified Produce Listing</span>
          </button>
        </form>
      </div>

      {/* Lab Verification Quality Control (Right) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-charcoal p-6 rounded-2xl border border-emerald-green/10">
        <div className="space-y-4">
          <div className="p-3 bg-emerald-green/10 border border-emerald-green/20 rounded-xl w-fit">
            <Droplet className="h-6 w-6 text-emerald-green" />
          </div>
          <h3 className="text-base font-bold text-white">Lab moisture analysis simulation</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Gebere Vision guarantees trade safety by analyzing grains. Safe moisture prevents mold and toxigenic fungal spores (e.g. Aspergillus). Grains with over 13.5% moisture cannot get the **Verified Union** badge.
          </p>

          <div className="bg-obsidian border border-zinc-850 p-4 rounded-xl flex flex-col items-center justify-center py-8 text-center min-h-[160px]">
            {isAnalyzing ? (
              <div className="space-y-3">
                <RefreshCw className="h-8 w-8 text-emerald-green animate-spin mx-auto" />
                <span className="text-xs font-bold text-zinc-400 block">Calibrating moisture sensor probe...</span>
              </div>
            ) : moistureScore !== null ? (
              <div className="space-y-3">
                <div className="text-3xl font-black text-white">{moistureScore}%</div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  moistureScore <= 13.5 ? "bg-emerald-green/10 text-emerald-green border border-emerald-green/30" : "bg-red-500/10 text-red-500 border border-red-500/30"
                }`}>
                  {moistureScore <= 13.5 ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      <span>Passed Quality Cert</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>High Moisture Risk</span>
                    </>
                  )}
                </span>
                <p className="text-[10px] text-zinc-500 max-w-[200px] mx-auto">
                  {moistureScore <= 13.5 
                    ? "Safe for bulk shipping. Union storehouse certified." 
                    : "High risk of spoilage. Dry harvest further before listing."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs font-bold text-zinc-450 block">Probe Sensor Offline</span>
                <button
                  type="button"
                  onClick={runMoistureTest}
                  className="bg-emerald-green text-obsidian text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-green/90 transition-all shadow-md"
                >
                  Trigger Moisture Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Traceability Checklist */}
        <div className="bg-obsidian/40 border border-zinc-800 p-4 rounded-xl space-y-3">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block flex items-center gap-1">
            <FileText className="h-3 w-3 text-emerald-green" />
            <span>Registry Checklist</span>
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={moistureScore !== null} readOnly className="rounded border-zinc-700 text-emerald-green focus:ring-emerald-green h-3 w-3" />
              <span className="text-[10px] text-zinc-450">Grain Moisture analysis completed</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.cooperativeName.length > 3} readOnly className="rounded border-zinc-700 text-emerald-green focus:ring-emerald-green h-3 w-3" />
              <span className="text-[10px] text-zinc-450">Cooperative Union details fully declared</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.volumeAmount !== ""} readOnly className="rounded border-zinc-700 text-emerald-green focus:ring-emerald-green h-3 w-3" />
              <span className="text-[10px] text-zinc-450">Volume amount and pricing entered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MarketplaceListing } from "@/data/marketplace";
import { BadgeCheck, Scale, Droplet, User, MapPin, CheckCircle } from "lucide-react";

interface ListingCardProps {
  listing: MarketplaceListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    quantity: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setShowQuoteModal(false);
      setIsSubmitted(false);
      setFormData({ buyerName: "", buyerEmail: "", quantity: "", notes: "" });
    }, 2000);
  };

  return (
    <>
      <div className="rounded-2xl border border-emerald-green/10 bg-charcoal overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-emerald-green/20 hover:shadow-lg hover:shadow-emerald-green/5">
        {/* Listing Image */}
        <div className="h-48 w-full relative bg-zinc-900">
          <img
            src={listing.imagePlaceholder}
            alt={listing.variety}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {listing.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-green text-obsidian text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg">
                <BadgeCheck className="h-3.5 w-3.5" />
                <span>Verified Union</span>
              </span>
            )}
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent h-20" />
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider">
                {listing.commodityName} &bull; {listing.variety}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{listing.cooperativeName}</h3>
              <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-green shrink-0" />
                <span>
                  {listing.location.woreda}, {listing.location.region}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              {listing.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 bg-obsidian/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Scale className="h-3 w-3 text-emerald-green" />
                  <span>Available</span>
                </span>
                <p className="text-sm font-bold text-white">
                  {listing.volume.amount} {listing.volume.unit}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Droplet className="h-3 w-3 text-emerald-green" />
                  <span>Moisture</span>
                </span>
                <p className="text-sm font-bold text-white">{listing.moistureLevel}%</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">Price / kg</span>
              <p className="text-lg font-extrabold text-white">
                {listing.askingPrice.currency === "USD" ? "$" : ""}
                {listing.askingPrice.amount}{" "}
                {listing.askingPrice.currency === "ETB" ? "ETB" : "USD"}
              </p>
            </div>

            <button
              onClick={() => setShowQuoteModal(true)}
              className="bg-emerald-green/10 hover:bg-emerald-green border border-emerald-green/20 hover:border-emerald-green text-emerald-green hover:text-obsidian px-4 py-2 rounded-lg text-xs font-bold transition-all"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
          <div className="bg-charcoal border border-emerald-green/20 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Request Purchase Quote</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Direct connection to <strong>{listing.cooperativeName}</strong>. All communications are broker-free.
            </p>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-emerald-green animate-bounce" />
                <h4 className="text-base font-bold text-white">Quote Request Sent!</h4>
                <p className="text-xs text-zinc-400">
                  The cooperative and agricultural union will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                    placeholder="e.g. Harar Exporters Ltd"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                    className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                    placeholder="e.g. buyer@company.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Quantity Needed ({listing.volume.unit === "Metric Tons" ? "MT" : "Quintals"})
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none"
                    placeholder={`e.g. 5`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Negotiation / Delivery Terms
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-obsidian border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-emerald-green focus:outline-none resize-none"
                    placeholder="e.g. Looking for FOB Djibouti delivery by end of month."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-green text-obsidian py-2 rounded-lg text-xs font-bold hover:bg-emerald-green/90"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

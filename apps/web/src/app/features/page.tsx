import Link from "next/link";
import {
  Compass,
  Calculator,
  Coins,
  ShoppingBag,
  HeartPulse,
  ShieldCheck,
  MapPin,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Platform Capabilities & Modules — Gebere Vision AI",
  description: "Comprehensive agricultural tools built for Ethiopian farmers, cooperatives, and agribusinesses.",
};

export default function FeaturesPage() {
  const features = [
    {
      title: "Land-Area Calculator & Mapping",
      icon: Compass,
      tag: "Plot Estimation",
      desc: "Measure agricultural plots accurately across metric and imperial systems. Normalizes meters, kilometers, and feet into square meters, hectares, and acres with clear boundary disclaimers.",
      bullets: [
        "Rectangular plot calculator (Length × Width with unit normalization)",
        "Leaflet & OpenStreetMap interactive boundary polygon drawer",
        "Geodesic area estimation using spherical projection on WGS84",
        "Save and link plot records to individual farms",
      ],
      link: "/land-calculator",
      linkText: "Open Land Calculator",
    },
    {
      title: "Farm Cost & Profit Calculator",
      icon: Coins,
      tag: "Financial Math",
      desc: "Track cultivation expenses across 9 standardized agricultural categories. Prevent division-by-zero, compute exact cost-per-hectare, revenue, and net profit margins in ETB.",
      bullets: [
        "9 categories: Land Prep, Seeds, Fertilizer, Labor, Irrigation, Equipment, etc.",
        "Scaled integer decimal-safe arithmetic to eliminate floating-point drift",
        "Cost per hectare and estimated profit per hectare metrics",
        "Categorical percentage breakdown for seasonal budget reviews",
      ],
      link: "/profit-calculator",
      linkText: "Try Profit Calculator",
    },
    {
      title: "Fair-Trade B2B Marketplace",
      icon: ShoppingBag,
      tag: "Direct Market",
      desc: "Connect smallholder cooperatives and grain producers directly with millers, beverage companies, and global exporters. No predatory brokers, honest communication.",
      bullets: [
        "Full support for Ethiopian cash crops: Teff, Coffee, Durum Wheat, Sorghum",
        "Filter by Region (Oromia, Sidama, Amhara, SNNPR) and Volume (Quintals, Tons)",
        "Direct inquiry submission directly to union contact persons",
        "Honest B2B architecture: no fabricated payment gateways or escrow claims",
      ],
      link: "/marketplace",
      linkText: "Explore Marketplace",
    },
    {
      title: "Crop Health & Bot Synchronization",
      icon: HeartPulse,
      tag: "AI Telemetry",
      desc: "Bridge the field and platform. Connected directly with our existing Telegram Bot (@gebere_vision_bot) to deliver crop diagnostics in Amharic, Afaan Oromo, English, and Arabic.",
      bullets: [
        "Decoupled CropDiagnosisService interface for external AI inference",
        "Webhook endpoint for real-time Telegram Bot telemetry ingestion",
        "Curated symptom guides without dangerous fabricated chemical dosages",
        "Upcoming direct web camera diagnosis module interface",
      ],
      link: "/crop-health",
      linkText: "View Crop Health",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Agricultural Technology for Ethiopia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Modern Tools for Every Stage of the <span className="text-emerald-green">Agricultural Season</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
          From precise plot boundary measurements and input budgeting to harvest revenue estimation and direct B2B market linkage.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between hover:border-emerald-green/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-emerald-green/10 rounded-2xl border border-emerald-green/20 text-emerald-green group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-green/40 text-emerald-accent border border-forest-light">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{item.desc}</p>

                <ul className="space-y-2.5 mb-8">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <span className="text-emerald-green font-bold">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={item.link}
                className="inline-flex items-center justify-center gap-2 bg-forest-green/50 hover:bg-forest-green/80 text-white border border-forest-light px-5 py-3 rounded-xl font-semibold text-xs transition-colors w-full"
              >
                <span>{item.linkText}</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-green" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Telegram Bot Callout */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-emerald-green/25 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-emerald-green uppercase tracking-wider">Separate Bot Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Already Using the Telegram Bot?
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Gebere Vision AI Bot operates independently for field smallholders on low-bandwidth 2G/3G networks, and syncs diagnostics directly to this management platform via secured backend APIs.
          </p>
          <div className="pt-2">
            <Link
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-green hover:bg-emerald-green/90 text-obsidian px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-green/20 transition-all"
            >
              <span>Connect with @gebere_vision_bot</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Calculator,
  Home as HomeIcon,
  Sprout,
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Compass,
  DollarSign,
  Sparkles
} from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Gebere Vision AI",
      subtitle: "Computer-Vision Crop Disease Diagnostics",
      desc: "Specialized agricultural AI assistant detecting Coffee Leaf Rust, Wheat Stem Rust, Teff Rust, and Barley Net Blotch with EIAR & CABI validated management.",
      href: "/gebere-vision-ai",
      icon: Sparkles,
      tag: "Neural AI Assistant",
      badgeBg: "bg-emerald-100 text-[#1B4332]",
    },
    {
      title: "Land Calculator",
      subtitle: "3977.06 m² • 0.024 Ha • 0.677 Acres",
      desc: "Dual-panel rectangular dimensional calculations and interactive OpenStreetMap GPS polygon field measurement.",
      href: "/land-calculator",
      icon: Calculator,
      tag: "Precision Geometry",
      badgeBg: "bg-emerald-50 text-[#2D6A4F]",
    },
    {
      title: "My Farm",
      subtitle: "All-Ethiopia Telemetry & Field Mapping",
      desc: "Plot registry with coffee, teff, wheat, and barley crop selections across all 14 Ethiopian regions, weather telemetry, and live activity tracking.",
      href: "/farms",
      icon: HomeIcon,
      tag: "Field Management",
      badgeBg: "bg-amber-50 text-[#8B5E3C]",
    },
    {
      title: "Crops Intelligence",
      subtitle: "Buna, Xaafii, Qamadii, Garbuu",
      desc: "Agronomic profiles, phenological stage trackers, elevation requirements, and real-time market price indicators.",
      href: "/crops",
      icon: Sprout,
      tag: "Crop Pathology & Yield",
      badgeBg: "bg-emerald-50 text-[#2D6A4F]",
    },
    {
      title: "Finance Dashboard",
      subtitle: "ETB 12,400 Cost • ETB 38,000 Revenue",
      desc: "Decimal-safe ETB input tracking across 9 categories, dual donut breakdown charts, and smooth area revenue trends.",
      href: "/finance",
      icon: LayoutDashboard,
      tag: "Monetary Economics",
      badgeBg: "bg-teal-50 text-teal-800",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      
      {/* Hero Banner matching Image 1 & 4 brand */}
      <section className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Hero Content */}
        <div className="max-w-xl space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
            <Sprout className="h-4 w-4" />
            <span>Oomisha360 Precision AgTech</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Know Your Farm.
            <br />
            Control Your Costs.
            <br />
            <span className="text-emerald-300">Grow Your Profits.</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
            The unified agricultural operating platform for Ethiopian farmers, cooperative unions, and agronomists.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/auth/register"
              className="bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-black/20 flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/land-calculator"
              className="border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Test Land Calculator
            </Link>
          </div>
        </div>

        {/* Right Illustration Thumbnail */}
        <div className="w-full md:w-80 h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex-shrink-0 bg-emerald-950/60">
          <img
            src="/images/ethiopian_farmer_terrace.jpg"
            alt="Ethiopian farmer cultivating crops"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4 Core Design System Modules */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
              Platform Modules
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Designed according to the Oomisha360 design reference specification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5DFD3] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-[#F5F0E8] text-[#1B4332] flex items-center justify-center group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${m.badgeBg}`}>
                      {m.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A2E] group-hover:text-[#2D6A4F] transition-colors">
                      {m.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#8B5E3C] mt-0.5">
                      {m.subtitle}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2D6A4F]">
                  <span>Launch Module</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Access to Crop Catalog from Image 3 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD3] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#1A1A2E]">
              Featured Ethiopian Crops
            </h3>
            <p className="text-xs text-gray-500">
              High-yield varieties, market prices, and phenological stage trackers.
            </p>
          </div>
          <Link
            href="/crops"
            className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
          >
            <span>View All Crop Profiles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img src="/images/crops/coffee.jpg" alt="Coffee" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <span className="text-xs font-bold block">Coffee / Buna</span>
              <span className="text-[10px] text-emerald-200">110 ETB/kg</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img src="/images/crops/teff.jpg" alt="Teff" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <span className="text-xs font-bold block">Teff / Xaafii</span>
              <span className="text-[10px] text-emerald-200">Magna White</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img src="/images/crops/wheat.jpg" alt="Wheat" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <span className="text-xs font-bold block">Wheat / Qamadii</span>
              <span className="text-[10px] text-emerald-200">Bale Durum</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img src="/images/crops/barley.jpg" alt="Barley" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <span className="text-xs font-bold block">Barley / Garbuu</span>
              <span className="text-[10px] text-emerald-200">Highland Malt</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

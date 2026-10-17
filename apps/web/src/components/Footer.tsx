import Link from "next/link";
import { Sprout, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#070b08] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-green/15 p-2 rounded-xl border border-emerald-green/30">
                <Sprout className="h-5 w-5 text-emerald-green" />
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight text-white">
                Gebere<span className="text-emerald-green">Vision</span> <span className="text-xs text-emerald-accent">AI</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Agricultural technology platform for Ethiopia. Empowering smallholder farmers and cooperative unions with land measurement, financial math, and direct produce markets.
            </p>
          </div>

          {/* Farm Management */}
          <div>
            <h3 className="text-zinc-200 font-bold text-xs uppercase tracking-wider mb-3">Farm Management</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/farms" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  My Registered Farms
                </Link>
              </li>
              <li>
                <Link href="/land-calculator" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Land-Area Calculator
                </Link>
              </li>
              <li>
                <Link href="/expenses" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Farm Cost Tracking
                </Link>
              </li>
              <li>
                <Link href="/profit-calculator" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Crop Profit Simulator
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Financial Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Trade & Health */}
          <div>
            <h3 className="text-zinc-200 font-bold text-xs uppercase tracking-wider mb-3">Marketplace & Health</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  B2B Produce Marketplace
                </Link>
              </li>
              <li>
                <Link href="/crop-health" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Crop Pathology & Symptoms
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/gebere_vision_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-green transition-colors flex items-center gap-1"
                >
                  <span>Telegram Diagnostic Bot</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Geography */}
          <div className="space-y-3 text-xs">
            <h3 className="text-zinc-200 font-bold text-xs uppercase tracking-wider mb-2">Regional Hub</h3>
            <div className="flex items-center space-x-2 text-zinc-400">
              <MapPin className="h-4 w-4 text-emerald-green shrink-0" />
              <span>Oromia &bull; Sidama &bull; Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400">
              <Mail className="h-4 w-4 text-emerald-green shrink-0" />
              <span>contact@geberevision.et</span>
            </div>
            <div className="p-3 bg-obsidian rounded-xl border border-border text-[11px] text-zinc-400">
              Telegram Bot: <strong>@gebere_vision_bot</strong>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Gebere Vision AI Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Land measurements are estimates for farm planning.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

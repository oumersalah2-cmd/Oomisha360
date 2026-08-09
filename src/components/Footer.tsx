import Link from "next/link";
import { Sprout, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-green/10 bg-[#0c0c0e] py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-emerald-green/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-green/20 p-2 rounded-lg border border-emerald-green/30">
                <Sprout className="h-5 w-5 text-emerald-green" />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-white">
                Gebere<span className="text-emerald-green">Vision</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Empowering smallholder farmers in Ethiopia and beyond with multimodal AI crop disease diagnosis and direct B2B produce markets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-200 font-bold text-sm uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/knowledge-base" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  CABI Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  B2B Marketplace
                </Link>
              </li>
              <li>
                <Link href="/pitch" className="text-zinc-400 hover:text-emerald-green transition-colors">
                  Pitch & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* External / Resources */}
          <div>
            <h3 className="text-zinc-200 font-bold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://t.me/gebere_vision_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-green transition-colors flex items-center space-x-1"
                >
                  <span>Telegram Bot</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cabi.org/publishing-products/plantwise-knowledge-bank/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-green transition-colors flex items-center space-x-1"
                >
                  <span>CABI Plantwise</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://plantvillage.psu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-green transition-colors flex items-center space-x-1"
                >
                  <span>PlantVillage</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-zinc-200 font-bold text-sm uppercase tracking-wider mb-2">Contact Info</h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4 text-emerald-green" />
              <span>info@geberevision.ai</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <Phone className="h-4 w-4 text-emerald-green" />
              <span>+251 (0) 11 654 3210</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <MapPin className="h-4 w-4 text-emerald-green" />
              <span>Ethiopia & Beyond</span>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-green/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Gebere Vision AI. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-emerald-green">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-green">Terms of Service</a>
            <a href="#" className="hover:text-emerald-green">Farmer Fair-Trade Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

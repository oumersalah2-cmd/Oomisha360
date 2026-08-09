"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sprout, Send } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "CABI Knowledge Base", href: "/knowledge-base" },
    { name: "B2B Marketplace", href: "/marketplace" },
    { name: "Pitch Deck", href: "/pitch" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-green/10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-green/20 p-2 rounded-lg border border-emerald-green/30 group-hover:bg-emerald-green/30 transition-all">
                <Sprout className="h-6 w-6 text-emerald-green text-glow" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-white group-hover:text-emerald-green transition-all">
                Gebere<span className="text-emerald-green">Vision</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-medium text-sm transition-all duration-200 hover:text-emerald-green ${
                      isActive ? "text-emerald-green font-semibold" : "text-zinc-400"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Telegram CTA */}
          <div className="hidden md:block">
            <Link
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-green hover:bg-emerald-green/90 text-obsidian px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/35 transition-all group"
            >
              <Send className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Launch Bot</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-green/10 bg-obsidian/95 backdrop-blur-lg px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "text-emerald-green bg-emerald-green/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 pb-2 px-3">
            <Link
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full bg-emerald-green text-obsidian px-4 py-3 rounded-lg font-bold text-center transition-all shadow-lg shadow-emerald-green/10"
            >
              <Send className="h-4 w-4" />
              <span>Launch Telegram Bot</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

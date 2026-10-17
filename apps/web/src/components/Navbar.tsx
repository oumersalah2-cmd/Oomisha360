"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sprout,
  Send,
  Calculator,
  LayoutDashboard,
  Coins,
  TrendingUp,
  ShoppingBag,
  HeartPulse,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const demo = localStorage.getItem("gebere_demo_mode") !== "false";
    setIsDemo(demo);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Crop Health", href: "/crop-health", icon: HeartPulse },
  ];

  const toolsDropdown = [
    { name: "My Farms", href: "/farms", desc: "Manage registered land and crops" },
    { name: "Land Calculator", href: "/land-calculator", desc: "Rectangular & Leaflet polygon area" },
    { name: "Farm Expenses", href: "/expenses", desc: "Multi-category cost tracking" },
    { name: "Profit Calculator", href: "/profit-calculator", desc: "Interactive yield scenario planner" },
    { name: "Financial Analytics", href: "/finance", desc: "Seasonal margins & cost breakdown" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-green/15 p-2 rounded-xl border border-emerald-green/30 group-hover:bg-emerald-green/25 transition-all">
                <Sprout className="h-5 w-5 text-emerald-green" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-lg tracking-tight text-white leading-tight">
                  Gebere<span className="text-emerald-green">Vision</span> <span className="text-xs text-emerald-accent font-semibold ml-1">AI</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Agricultural Platform of Ethiopia</span>
              </div>
            </Link>

            {/* Demo Mode Badge */}
            {isDemo && (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-green/10 border border-emerald-green/20 text-emerald-green">
                <Sparkles className="h-2.5 w-2.5" />
                Demo / Local API Mode
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold tracking-wide transition-all duration-150 hover:text-emerald-green ${
                    isActive ? "text-emerald-green font-bold" : "text-zinc-300"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Farm Management Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
                className={`flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors hover:text-emerald-green ${
                  pathname.includes("/farms") ||
                  pathname.includes("/land-calculator") ||
                  pathname.includes("/expenses") ||
                  pathname.includes("/profit-calculator") ||
                  pathname.includes("/finance")
                    ? "text-emerald-green font-bold"
                    : "text-zinc-300"
                }`}
              >
                <span>Farm Tools</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-card border border-border p-2 shadow-2xl z-50">
                  {toolsDropdown.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setToolsOpen(false)}
                      className={`block px-3 py-2 rounded-xl text-xs transition-colors hover:bg-forest-green/30 ${
                        pathname === tool.href ? "bg-forest-green/40 text-emerald-green font-semibold" : "text-zinc-200"
                      }`}
                    >
                      <div className="font-semibold text-white">{tool.name}</div>
                      <div className="text-[10px] text-zinc-400">{tool.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <Link
              href="/profile"
              className={`p-2 rounded-xl border transition-all ${
                pathname === "/profile"
                  ? "border-emerald-green text-emerald-green bg-emerald-green/10"
                  : "border-border text-zinc-400 hover:text-white hover:border-emerald-green/40"
              }`}
              title="Farmer Profile"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>

          {/* Telegram Bot Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-emerald-green hover:bg-emerald-green/90 text-obsidian px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-green/20 transition-all group"
            >
              <Send className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Telegram Bot</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-forest-green/30 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "text-emerald-green bg-emerald-green/10"
                  : "text-zinc-300 hover:text-white hover:bg-card"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-2 pb-1 border-t border-border">
            <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider px-3">
              Farm Management Tools
            </span>
            <div className="mt-1 space-y-1">
              {toolsDropdown.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-xs transition-colors ${
                    pathname === tool.href ? "bg-forest-green/40 text-emerald-green font-semibold" : "text-zinc-300 hover:bg-card"
                  }`}
                >
                  <div className="font-semibold text-white">{tool.name}</div>
                  <div className="text-[10px] text-zinc-400">{tool.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:bg-card"
            >
              <User className="h-4 w-4 text-emerald-green" />
              <span>User Profile & Settings</span>
            </Link>
            <Link
              href="https://t.me/gebere_vision_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full bg-emerald-green text-obsidian px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all text-center"
            >
              <Send className="h-4 w-4" />
              <span>Open Telegram Bot (@gebere_vision_bot)</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

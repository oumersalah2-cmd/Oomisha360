"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  Home,
  Sprout,
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  Settings,
  HelpCircle,
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  Compass,
  DollarSign,
  Sparkles
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Teff");
  const [selectedFarm, setSelectedFarm] = useState("Farm Alpha");
  const [selectedSeason, setSelectedSeason] = useState("Meher 2023");

  // If on auth routes, don't wrap with dashboard shell
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <main className="min-h-screen bg-[#1B4332]">{children}</main>;
  }

  const navItems = [
    { name: "Land Calculator", href: "/land-calculator", icon: Calculator },
    { name: "My Farm", href: "/farms", icon: Home },
    { name: "Crops", href: "/crops", icon: Sprout },
    { name: "Gebere Vision AI", href: "/gebere-vision-ai", icon: Sparkles, badge: "AI Assistant" },
    { name: "Finance Dashboard", href: "/finance", icon: LayoutDashboard },
    { name: "Expenses", href: "/expenses", icon: Wallet },
    { name: "Markets", href: "/marketplace", icon: ShoppingBag },
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/profile", icon: Settings },
    { name: "Help", href: "/features", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col md:flex-row font-sans text-[#1A1A2E]">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#1B4332] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white font-bold">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Oomisha360</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Left Sidebar (Deep Forest Green #1B4332) */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1B4332] text-white p-5 flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out shadow-xl flex-shrink-0`}
      >
        <div className="space-y-8">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 px-2 group">
            <div className="h-10 w-10 rounded-full bg-[#2D6A4F] border border-emerald-400/30 flex items-center justify-center text-white shadow-md">
              <Sprout className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                Oomisha360
              </span>
              <span className="text-[10px] text-emerald-200/60 font-medium">
                Agricultural Tech Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/farms" && pathname === "/my-farm");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2D6A4F] text-white shadow-md font-semibold"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-emerald-300/70"}`} />
                    <span>{item.name}</span>
                  </div>
                  {(item as any).badge && (
                    <span className="text-[9px] uppercase font-extrabold tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings & Help */}
        <div className="pt-6 border-t border-white/10 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#2D6A4F] text-white font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 text-emerald-300/70" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-2 px-3 text-[11px] text-white/40">
            v1.0.0 • Ethiopia
          </div>
        </div>
      </aside>

      {/* Main Content View with Top Bar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar on Warm Cream Background */}
        <header className="bg-transparent px-6 sm:px-8 pt-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Quick Filter Controls from Image 5 (Crop, Farm, Season) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Crop Filter */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-500 mr-2 font-medium">Crop:</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="Teff">Teff</option>
                <option value="Maize">Maize</option>
                <option value="Wheat">Wheat</option>
                <option value="Coffee">Coffee</option>
                <option value="Barley">Barley</option>
              </select>
            </div>

            {/* Farm Filter */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-500 mr-2 font-medium">Farm:</span>
              <select
                value={selectedFarm}
                onChange={(e) => setSelectedFarm(e.target.value)}
                className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="Farm Alpha">Farm Alpha</option>
                <option value="Beta">Beta (Bishoftu)</option>
                <option value="Bale South">Bale South</option>
              </select>
            </div>

            {/* Season Filter */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-500 mr-2 font-medium">Season:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="Meher 2023">Meher 2023</option>
                <option value="Belg 2024">Belg 2024</option>
                <option value="Meher 2024">Meher 2024</option>
              </select>
            </div>
          </div>

          {/* Right Header Controls: Search, Notifications, Profile */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white border border-[#D8D2C4] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] w-48 shadow-sm"
              />
            </div>

            {/* Notifications Bell */}
            <button
              type="button"
              className="p-2 rounded-xl bg-white border border-[#D8D2C4] text-gray-600 hover:text-[#1B4332] shadow-sm relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-600"></span>
            </button>

            {/* User Profile Pill */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 shadow-sm hover:border-[#2D6A4F] transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#1A1A2E] leading-none">Abebe</span>
                <span className="text-[10px] text-gray-500 leading-tight">Profile</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Body on Warm Cream Canvas */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

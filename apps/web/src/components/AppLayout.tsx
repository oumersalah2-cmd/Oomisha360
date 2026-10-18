"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Check,
  CheckCheck,
  Trash2,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/api-client";
import { Language } from "@/lib/i18n";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Teff");
  const [selectedFarm, setSelectedFarm] = useState("Farm Alpha");
  const [selectedSeason, setSelectedSeason] = useState("Meher 2024");
  
  // Real Dynamic User & Notification Dropdown State
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState<{ fullName?: string; email?: string } | null>(null);
  const [farmsList, setFarmsList] = useState<{ id: string; name: string }[]>([]);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // If on auth routes, don't wrap with dashboard shell
  const isAuthRoute = pathname.startsWith("/auth");

  // Load user session & real farms
  useEffect(() => {
    if (isAuthRoute) return;

    try {
      const stored = localStorage.getItem("gebere_user");
      if (stored) {
        setUserProfile(JSON.parse(stored));
      }
    } catch {}

    async function fetchFarms() {
      try {
        const farms = await apiClient.getFarms();
        if (farms && farms.length > 0) {
          setFarmsList(farms);
          setSelectedFarm(farms[0].name);
        }
      } catch {}
    }
    fetchFarms();
  }, [pathname, isAuthRoute]);

  // Click outside listener for notification popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  if (isAuthRoute) {
    return <main className="min-h-screen bg-[#1B4332]">{children}</main>;
  }

  const navItems = [
    {
      name: language === "om" ? "Shakallii Lafaa" : language === "am" ? "የመሬት ስሌት" : "Land Calculator",
      href: "/land-calculator",
      icon: Calculator,
    },
    {
      name: language === "om" ? "Maasii Koo" : language === "am" ? "ማሳዬ" : "My Farm",
      href: "/farms",
      icon: Home,
    },
    {
      name: language === "om" ? "Oomishaalee" : language === "am" ? "ሰብሎች" : "Crops",
      href: "/crops",
      icon: Sprout,
    },
    {
      name: "Gebere Vision AI",
      href: "/gebere-vision-ai",
      icon: Sparkles,
      badge: language === "om" ? "Gargaaraa AI" : language === "am" ? "የAI ረዳት" : "AI Assistant",
    },
    {
      name: language === "om" ? "Eegumsa Oomishaa" : language === "am" ? "የሰብል ጥበቃ" : "Crop Protection",
      href: "/crop-protection",
      icon: ShieldCheck,
      badge: language === "om" ? "Qoricha" : language === "am" ? "መድኃኒቶች" : "Medicines",
    },
    {
      name: language === "om" ? "Fayinaansii" : language === "am" ? "ፋይናንስ" : "Finance Dashboard",
      href: "/finance",
      icon: LayoutDashboard,
    },
    {
      name: language === "om" ? "Baasiiwwan" : language === "am" ? "ወጪዎች" : "Expenses",
      href: "/expenses",
      icon: Wallet,
    },
    {
      name: language === "om" ? "Gabaa" : language === "am" ? "ገበያ" : "Markets",
      href: "/marketplace",
      icon: ShoppingBag,
    },
  ];

  const bottomNavItems = [
    {
      name: language === "om" ? "Qindaa'ina" : language === "am" ? "ቅንብሮች" : "Settings",
      href: "/profile",
      icon: Settings,
    },
    {
      name: language === "om" ? "Gargaarsa" : language === "am" ? "እርዳታ" : "Help",
      href: "/features",
      icon: HelpCircle,
    },
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

        <div className="flex items-center gap-2">
          {/* Mobile Language Selector */}
          <select
            value={language}
            aria-label="Language"
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-white/15 border border-white/20 text-white rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
          >
            <option value="om" className="text-gray-900">🌳 ORM</option>
            <option value="am" className="text-gray-900">🇪🇹 አማ</option>
            <option value="en" className="text-gray-900">🇬🇧 EN</option>
          </select>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2D6A4F] text-white shadow-sm font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-emerald-200" : "text-emerald-300/80"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">
                      {item.badge}
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
          
          {/* Quick Filter Controls */}
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

            {/* Farm Filter (Dynamically Loaded from Real API/DB) */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-500 mr-2 font-medium">Farm:</span>
              {farmsList.length > 0 ? (
                <select
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer pr-1"
                >
                  {farmsList.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Link href="/farms" className="font-semibold text-[#2D6A4F] hover:underline">
                  + Add Farm
                </Link>
              )}
            </div>

            {/* Season Filter */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-500 mr-2 font-medium">Season:</span>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent font-semibold text-[#1A1A2E] focus:outline-none cursor-pointer pr-1"
              >
                <option value="Meher 2024">Meher 2024</option>
                <option value="Belg 2024">Belg 2024</option>
                <option value="Meher 2023">Meher 2023</option>
              </select>
            </div>
          </div>

          {/* Right Header Controls: Search, Language Switcher, Notifications, Profile */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            
            {/* Desktop Language Switcher (Afaan Oromoo / አማርኛ / English) */}
            <div className="flex items-center bg-white border border-[#D8D2C4] rounded-xl px-2.5 py-1 text-xs shadow-sm">
              <Globe className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
              <select
                value={language}
                aria-label="Language selector"
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent font-bold text-[#1B4332] focus:outline-none cursor-pointer text-xs"
              >
                <option value="om">🌳 Afaan Oromoo</option>
                <option value="am">🇪🇹 አማርኛ</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white border border-[#D8D2C4] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] w-48 shadow-sm"
              />
            </div>

            {/* Notifications Bell with Dynamic Signal Indicator */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white border border-[#D8D2C4] text-gray-600 hover:text-[#1B4332] shadow-sm relative transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                
                {/* Dynamic Unread Signal - Renders ONLY when unreadNotificationsCount > 0 */}
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Real Interactive Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#D8D2C4] z-50 overflow-hidden animate-fade-in">
                  <div className="p-3.5 bg-[#FAF7F2] border-b border-[#E5DFD3] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#2D6A4F]" />
                      <span className="text-xs font-extrabold text-[#1A1A2E]">
                        Notifications
                      </span>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadNotificationsCount} unread
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-semibold text-[#2D6A4F] hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="h-3 w-3" />
                        <span>Mark all as read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 transition-colors flex items-start gap-3 ${
                            n.read ? "bg-white hover:bg-gray-50/50" : "bg-emerald-50/40 hover:bg-emerald-50/70"
                          }`}
                        >
                          <div
                            className={`h-7 w-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                              n.type === "diagnosis"
                                ? "bg-purple-100 text-purple-700"
                                : n.type === "farm"
                                ? "bg-emerald-100 text-emerald-700"
                                : n.type === "marketplace"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {n.type === "diagnosis" ? "🔬" : n.type === "farm" ? "🌱" : n.type === "marketplace" ? "🌾" : "ℹ️"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-gray-400">
                              <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className="flex items-center gap-2">
                                {n.link && (
                                  <Link
                                    href={n.link}
                                    onClick={() => {
                                      markNotificationAsRead(n.id);
                                      setShowNotifications(false);
                                    }}
                                    className="font-bold text-[#2D6A4F] hover:underline"
                                  >
                                    View &rarr;
                                  </Link>
                                )}
                                <button
                                  type="button"
                                  onClick={() => dismissNotification(n.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic User Profile Pill */}
            {userProfile ? (
              <Link
                href="/profile"
                className="flex items-center gap-2.5 bg-white border border-[#D8D2C4] rounded-xl px-3 py-1.5 shadow-sm hover:border-[#2D6A4F] transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {userProfile.fullName ? userProfile.fullName.charAt(0) : userProfile.email?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col text-left max-w-[110px]">
                  <span className="text-xs font-bold text-[#1A1A2E] leading-none truncate">
                    {userProfile.fullName || userProfile.email?.split("@")[0] || "Farmer"}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold leading-tight">
                    Farmer
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

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

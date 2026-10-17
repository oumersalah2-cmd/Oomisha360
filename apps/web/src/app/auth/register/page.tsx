"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { ZoneItem } from "@gebere/shared";
import { setAuthToken, setDemoMode, apiClient } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [farmLocation, setFarmLocation] = useState("Bale");
  const [language, setLanguage] = useState("Afaan Oromoo");
  const [topLanguage, setTopLanguage] = useState("English");
  const [isTopLangOpen, setIsTopLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadZones() {
      try {
        const list = await apiClient.getZones();
        if (list && list.length > 0) {
          setZones(list);
        }
      } catch (err) {
        console.error("Failed to load zones for registration", err);
      }
    }
    loadZones();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setAuthToken("demo-user-farmer-1");
      setDemoMode(true);

      const matched = zones.find((z) => z.name === farmLocation);
      await apiClient.updateProfile({
        fullName: fullName || "Farmer Abebe",
        phone: identifier.includes("@") ? undefined : identifier,
        region: (matched as any)?.region || "Ethiopia",
        zone: farmLocation,
      });

      router.push("/farms");
    } catch (err) {
      console.error("Registration failed", err);
      router.push("/farms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B4332]/90 md:bg-[#23533E] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Split Auth Modal Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Green Brand Panel */}
        <div className="md:w-1/2 bg-[#1B4332] p-8 sm:p-10 text-white flex flex-col justify-between relative">
          
          {/* Top Language Dropdown */}
          <div className="flex justify-end relative">
            <button
              type="button"
              onClick={() => setIsTopLangOpen(!isTopLangOpen)}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-1.5 text-xs text-white/90 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Language</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
            {isTopLangOpen && (
              <div className="absolute top-10 right-0 bg-[#163628] border border-white/20 rounded-xl py-1 w-32 shadow-xl z-20 text-xs">
                {["English", "Afaan Oromoo", "Amharic"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setTopLanguage(l);
                      setIsTopLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white/90"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Brand Title & Tagline */}
          <div className="my-8 text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              Oomisha360
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xs mx-auto">
              Know Your Farm. Control Your Costs.
              <br />
              Grow Your Profits.
            </p>
          </div>

          {/* Farmer Terraced Fields Illustration */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-emerald-950/40">
            <img
              src="/images/ethiopian_farmer_terrace.jpg"
              alt="Ethiopian farmer cultivating terraced crop fields"
              className="w-full h-52 sm:h-64 object-cover object-center"
            />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Phone Number or Email */}
            <div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Phone Number (primary) or Email (optional)"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1 pl-1">
                No email required — phone number accepted.
              </p>
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Farm Location */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Farm Location</label>
              <div className="relative">
                <select
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  {zones.length > 0 ? (
                    zones.map((z) => (
                      <option key={z.id} value={z.name}>
                        {z.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Bale">Bale</option>
                      <option value="West Arsi">West Arsi</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Preferred Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="Afaan Oromoo">Afaan Oromoo</option>
                  <option value="Amharic">Amharic</option>
                  <option value="English">English</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-medium py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-[#2D6A4F] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

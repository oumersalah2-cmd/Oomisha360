"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { ZoneItem } from "@gebere/shared";
import { setAuthToken, setDemoMode, apiClient } from "@/lib/api-client";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hasSupabaseKeys, setHasSupabaseKeys] = useState(false);

  useEffect(() => {
    setHasSupabaseKeys(isSupabaseConfigured());
  }, []);

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
    setErrorMsg(null);
    setSuccessMsg(null);

    const email = identifier.includes("@") ? identifier.trim() : `${identifier.trim()}@oomisha360.et`;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName: fullName.trim() || "Farmer Member",
              zone: farmLocation,
              language,
              role: "farmer",
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          setAuthToken(data.session.access_token);
          setDemoMode(false);

          const matched = zones.find((z) => z.name === farmLocation);
          await apiClient.updateProfile({
            fullName: fullName || "Farmer Abebe",
            phone: identifier.includes("@") ? undefined : identifier,
            region: (matched as any)?.region || "Ethiopia",
            zone: farmLocation,
          });

          router.push("/farms");
          return;
        }

        if (data.user) {
          setSuccessMsg("Registration successful! If confirmation is required, please check your email inbox to verify your account before logging in.");
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create Supabase account.");
        setLoading(false);
        return;
      }
    } else {
      // Development demo fallback
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
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}
            {hasSupabaseKeys ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Connected to Supabase Auth GoTrue</span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Development demo mode (Supabase keys pending)</span>
              </div>
            )}

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

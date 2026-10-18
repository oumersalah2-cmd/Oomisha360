"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe, AlertCircle, Info } from "lucide-react";
import { setAuthToken, setDemoMode } from "@/lib/api-client";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("farmer@oomisha360.et");
  const [password, setPassword] = useState("password123");
  const [isTopLangOpen, setIsTopLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSupabaseKeys, setHasSupabaseKeys] = useState(false);

  useEffect(() => {
    setHasSupabaseKeys(isSupabaseConfigured());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const email = identifier.includes("@") ? identifier.trim() : `${identifier.trim()}@oomisha360.et`;

    // 1. Real Supabase Authentication
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          setAuthToken(data.session.access_token);
          setDemoMode(false);
          router.push("/farms");
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to authenticate with Supabase Auth.");
        setLoading(false);
        return;
      }
    } else {
      // Supabase Anon Key is not yet configured in web .env.local
      setErrorMsg(
        "Supabase Auth keys are not yet configured in NEXT_PUBLIC_SUPABASE_ANON_KEY. Use Quick Demo Sign-In below or provide your Supabase anon key."
      );
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setAuthToken("demo-user-farmer-1");
    setDemoMode(true);
    router.push("/farms");
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
                    onClick={() => setIsTopLangOpen(false)}
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
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
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

            {/* Phone Number or Email */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="0911... or farmer@oomisha360.et"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-[#2D6A4F] hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-medium py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>

            {/* Fast Demo Mode Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full bg-[#F5F0E8] hover:bg-[#EAE4D9] text-[#1B4332] font-semibold py-2.5 rounded-xl text-xs transition-all border border-[#D8D2C4]"
            >
              Quick Demo Sign-In (Pre-loaded Farmer Profile)
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link
              href="/auth/register"
              className="text-[#2D6A4F] font-semibold hover:underline"
            >
              Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

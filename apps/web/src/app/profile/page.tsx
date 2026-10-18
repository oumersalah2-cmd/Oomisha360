"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@gebere/shared";
import { apiClient, isDemoMode, setDemoMode, setAuthToken, clearAuthSession } from "@/lib/api-client";
import { supabase } from "@/lib/supabase/client";
import {
  User,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
  LogOut,
  ChevronDown,
  Key
} from "lucide-react";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("Abebe Demisse");
  const [phone, setPhone] = useState("+251 91 123 4567");
  const [region, setRegion] = useState("Oromia");
  const [zone, setZone] = useState("Bale");
  const [woreda, setWoreda] = useState("Goba");
  const [cooperativeName, setCooperativeName] = useState("Bale Agricultural Cooperative Union");
  const [role, setRole] = useState<UserProfile["role"]>("farmer");
  const [demoActive, setDemoActive] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    clearAuthSession();
    router.push("/auth/login");
  };

  useEffect(() => {
    async function load() {
      const p = await apiClient.getProfile();
      if (p) {
        setProfile(p);
        setFullName(p.fullName);
        setPhone(p.phone || "");
        setRegion(p.region || "Oromia");
        setZone(p.zone || "");
        setWoreda(p.woreda || "");
        setCooperativeName(p.cooperativeName || "");
        setRole(p.role);
      }
      setDemoActive(isDemoMode());
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await apiClient.updateProfile({
      fullName,
      phone,
      region,
      zone,
      woreda,
      cooperativeName,
      role,
    });

    if (updated) {
      setProfile(updated);
      setStatusMsg("Profile updated successfully!");
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleRoleToggle = (newRole: "farmer" | "cooperative_manager") => {
    setRole(newRole);
    if (newRole === "cooperative_manager") {
      setAuthToken("demo-user-coop-manager");
    } else {
      setAuthToken("demo-user-farmer-1");
    }
    setStatusMsg(`Switched persona to ${newRole === "farmer" ? "Farmer" : "Cooperative Trade Manager"}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
          Farmer Profile & Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Oomisha360 account settings, cooperative union affiliations, and evaluation persona.
        </p>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Persona Switcher Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#2D6A4F]">
          <Sparkles className="h-4 w-4" />
          <h2 className="text-sm font-bold text-gray-900">
            Interactive Persona Simulation
          </h2>
        </div>

        <p className="text-xs text-gray-500">
          Switch roles to experience Oomisha360 from either smallholder farmer or cooperative union perspectives:
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleRoleToggle("farmer")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              role === "farmer"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "bg-[#F5F0E8] text-gray-700 hover:bg-[#EAE4D9]"
            }`}
          >
            Farmer Persona (Abebe Demisse - Bale Estate)
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle("cooperative_manager")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              role === "cooperative_manager"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "bg-[#F5F0E8] text-gray-700 hover:bg-[#EAE4D9]"
            }`}
          >
            Cooperative Union Persona (Trade Manager - Ada'a Union)
          </button>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
              >
                <option value="Oromia">Oromia</option>
                <option value="Sidama">Sidama</option>
                <option value="Amhara">Amhara</option>
                <option value="SNNPR">SNNPR</option>
                <option value="Tigray">Tigray</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Zone</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Woreda</label>
              <input
                type="text"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Affiliated Cooperative Union</label>
              <input
                type="text"
                value={cooperativeName}
                onChange={(e) => setCooperativeName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#D8D2C4] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#40916C] hover:bg-[#2D6A4F] text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Session & Security Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD3] p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <Key className="h-4 w-4 text-[#2D6A4F]" />
          <h2 className="text-sm font-bold">Account Session & Security</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F5F0E8] border border-[#D8D2C4]">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-900 block">
              {profile?.email || "No active email"}
            </span>
            <span className="text-[11px] text-gray-500 block">
              User ID: <code className="font-mono text-gray-700">{profile?.id || "Unregistered"}</code>
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold px-4 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out & End Session</span>
          </button>
        </div>
      </div>

    </div>
  );
}

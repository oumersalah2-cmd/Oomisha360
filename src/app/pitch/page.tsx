"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Terminal, ShieldAlert, Cpu, Sparkles, UserCheck } from "lucide-react";

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "The Problem: Agricultural Crisis in Ethiopia & Beyond",
      type: "problem",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
          {/* Main Chart Column */}
          <div className="lg:col-span-7 bg-[#0d0d0f]/90 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                Annual Global Cost: $220B (FAO)
              </span>
              <h3 className="text-xl font-bold text-white mb-6">
                Escalating Crop Disease & Epidemics
              </h3>
            </div>

            {/* Custom Bar Chart */}
            <div className="flex items-end justify-around h-48 pt-6 border-b border-zinc-800">
              <div className="flex flex-col items-center w-1/4 group">
                <div className="w-full bg-blue-500 rounded-t-lg transition-all duration-1000 h-16 shadow-lg shadow-blue-500/20" />
                <span className="text-[10px] text-zinc-555 mt-2 font-bold">Coffee Rust</span>
              </div>
              <div className="flex flex-col items-center w-1/4 group">
                <div className="w-full bg-purple-500 rounded-t-lg transition-all duration-1000 h-32 shadow-lg shadow-purple-500/20" />
                <span className="text-[10px] text-zinc-555 mt-2 font-bold">Wheat Rust</span>
              </div>
              <div className="flex flex-col items-center w-1/4 group">
                <div className="w-full bg-red-500 rounded-t-lg transition-all duration-1000 h-44 shadow-lg shadow-red-500/20 animate-pulse" />
                <span className="text-[10px] text-zinc-555 mt-2 font-bold">Maize MLN</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] text-zinc-500 italic">
                Source: Peer-reviewed research and FAO data indicating regional epidemics.
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Story Card */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-green/10 to-transparent rounded-bl-full pointer-events-none" />
              <h4 className="text-xs font-bold text-emerald-green uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>From the Founder</span>
              </h4>
              <p className="text-xs text-zinc-350 leading-relaxed italic">
                &ldquo;Growing up in a farming family, I saw the realities firsthand. Farmers lose their crops because they don't have access to timely expertise. This is where the idea of a digital agronomist was born.&rdquo;
              </p>
            </div>

            {/* Diagnosis Gap Card */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl flex-1">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                <span>The Diagnosis Gap</span>
              </h4>
              <p className="text-xs text-zinc-350 leading-relaxed">
                Smallholder farmers lack the tools for real-time crop disease monitoring, leading to late-stage diagnostics, crop failures, and financial distress.
              </p>
            </div>

            {/* Metric Card */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Potential Damage</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Yield loss in affected fields without intervention</p>
              </div>
              <div className="text-2xl font-black text-red-500 tracking-tight shrink-0">100%</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Product Overview: Telegram AI Bot",
      type: "solution",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
          {/* Main Description */}
          <div className="lg:col-span-7 bg-[#0d0d0f]/90 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider block mb-1">
                Zero-Friction Crop Care Platform
              </span>
              <h3 className="text-xl font-bold text-white mb-4">
                Instant Multilingual Disease Diagnosis
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Gebere Vision AI provides an instant, 100% free diagnosis service directly via Telegram. Farmers simply take a photo of the infected crop leaf, and our system returns localized, CABI-grounded remedies in under 30 seconds.
              </p>
            </div>

            {/* Feature Steps */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div className="bg-charcoal/50 border border-zinc-850 p-3.5 rounded-xl text-center">
                <span className="text-lg block mb-1">📸</span>
                <span className="text-[10px] font-bold text-white block">1. Take Photo</span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">Leaf symptoms</span>
              </div>
              <div className="bg-charcoal/50 border border-zinc-850 p-3.5 rounded-xl text-center">
                <span className="text-lg block mb-1">🤖</span>
                <span className="text-[10px] font-bold text-white block">2. AI Diagnosis</span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">Under 30 seconds</span>
              </div>
              <div className="bg-charcoal/50 border border-zinc-850 p-3.5 rounded-xl text-center">
                <span className="text-lg block mb-1">🌿</span>
                <span className="text-[10px] font-bold text-white block">3. Cure Remedy</span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">CABI Grounded</span>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Value Wedge */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl flex-1">
              <h4 className="text-xs font-bold text-emerald-green uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                <span>Multimodal Support</span>
              </h4>
              <p className="text-xs text-zinc-355 leading-relaxed">
                Seamless support for photo diagnostics combined with voice messages in Amharic, Afaan Oromo, English, and Arabic, making it fully accessible.
              </p>
            </div>

            {/* High Trust Card */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl flex-1">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-emerald-green" />
                <span>Zero Installation Barrier</span>
              </h4>
              <p className="text-xs text-zinc-355 leading-relaxed">
                By leveraging Telegram, we avoid app store downloads, updates, or logins, enabling immediate usage even on older smartphones and low-bandwidth connections.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-charcoal border border-zinc-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Access Price</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Always free for smallholder farmers</p>
              </div>
              <div className="text-xl font-black text-emerald-green tracking-tight shrink-0">100% FREE</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-6 mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-3">
            <Terminal className="h-3.5 w-3.5" />
            <span>Interactive Pitch Deck</span>
          </span>
          <h1 className="text-3xl font-black text-white leading-none">
            Gebere Vision AI Slide Deck
          </h1>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2.5 rounded-xl border border-zinc-800 bg-charcoal text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-zinc-400 font-mono">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-2.5 rounded-xl border border-zinc-800 bg-charcoal text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slides Tab Selector */}
      <div className="flex gap-2 mb-8 bg-charcoal border border-zinc-850 p-1 rounded-xl w-fit">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              currentSlide === idx
                ? "bg-emerald-green text-obsidian shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Slide {idx + 1}: {slide.type === "problem" ? "The Problem" : "The Solution"}
          </button>
        ))}
      </div>

      {/* Active Slide Body Area */}
      <div className="min-h-[460px] transition-all duration-300">
        {slides[currentSlide].content}
      </div>
    </div>
  );
}

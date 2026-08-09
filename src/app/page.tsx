import Link from "next/link";
import BotSimulator from "@/components/BotSimulator";
import { Send, ArrowRight, ShieldCheck, Cpu, MessageSquareCode, Truck, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-muted-emerald/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-6">
          <span>🌱</span>
          <span>Empowering African Smallholders with Multimodal AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
          A Digital Agronomist in <br />
          Every Farmer's Pocket — <span className="text-emerald-green text-glow">For Free.</span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Delivering instant crop disease diagnostics in Amharic, Afaan Oromo, English, and Arabic in under 30 seconds via Telegram, while connecting verified harvests directly to B2B buyers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link
            href="https://t.me/gebere_vision_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-emerald-green hover:bg-emerald-green/90 text-obsidian px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-emerald-green/20 hover:shadow-emerald-green/30 transition-all w-full sm:w-auto"
          >
            <Send className="h-5 w-5" />
            <span>Launch Telegram Bot</span>
          </Link>
          <Link
            href="/marketplace"
            className="flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all w-full sm:w-auto"
          >
            <span>Explore B2B Supply Chain</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Live Simulator Interface widget */}
        <div className="max-w-5xl mx-auto bg-[#0d0d0f]/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-green text-obsidian font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            Live Diagnostic Simulator
          </div>
          <BotSimulator />
        </div>
      </section>

      {/* The Problem & Wedge Strategy Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-green uppercase tracking-wider">The Challenge</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            The Fragmented African Value Chain
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
            African agriculture is hindered by lack of expertise and predatory intermediaries. We build trust by solving the immediate agronomic problems first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-charcoal p-8 rounded-2xl border border-zinc-800/60 relative overflow-hidden">
            <div className="text-3xl font-black text-emerald-green mb-4">30%</div>
            <h3 className="text-lg font-bold text-white mb-2">Annual Crop Loss</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ethiopian coffee and wheat farmers lose close to a third of their yield due to lack of timely access to agricultural extension workers.
            </p>
          </div>

          <div className="bg-charcoal p-8 rounded-2xl border border-zinc-800/60 relative overflow-hidden">
            <div className="text-3xl font-black text-emerald-green mb-4">40%</div>
            <h3 className="text-lg font-bold text-white mb-2">Broker Exploitation</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Informal middlemen control logistics and markets, absorbing up to 40% of the margins of smallholder farmers and cooperative unions.
            </p>
          </div>

          <div className="bg-charcoal p-8 rounded-2xl border border-zinc-800/60 relative overflow-hidden">
            <div className="text-emerald-green text-xl font-bold uppercase tracking-wider mb-4">The Wedge</div>
            <h3 className="text-lg font-bold text-white mb-2">Free AI Engagement</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              By giving cooperatives and farmers a free diagnostic bot, we naturally map harvest locations, forecast yields, and grade quality at source.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="bg-[#0c0c0e] py-24 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-green uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Built for Pan-African Realities
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-4">
              A lightweight tech stack optimized for low bandwidth, rural deployment, and local oral traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-charcoal/50 border border-zinc-800/60 p-6 rounded-2xl space-y-4">
              <div className="p-3 bg-emerald-green/10 rounded-xl border border-emerald-green/20 w-fit">
                <Cpu className="h-6 w-6 text-emerald-green" />
              </div>
              <h3 className="text-base font-bold text-white">Multimodal Vision AI</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Utilizing Gemini/Llama vision models optimized for micro-imagery of crop lesions, rust pustules, and leaf spots.
              </p>
            </div>

            <div className="bg-charcoal/50 border border-zinc-800/60 p-6 rounded-2xl space-y-4">
              <div className="p-3 bg-emerald-green/10 rounded-xl border border-emerald-green/20 w-fit">
                <ShieldCheck className="h-6 w-6 text-emerald-green" />
              </div>
              <h3 className="text-base font-bold text-white">CABI RAG Grounding</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero-hallucination vector search grounded in CABI Plantwise and PlantVillage agronomic encyclopedias for approved remedies.
              </p>
            </div>

            <div className="bg-charcoal/50 border border-zinc-800/60 p-6 rounded-2xl space-y-4">
              <div className="p-3 bg-emerald-green/10 rounded-xl border border-emerald-green/20 w-fit">
                <MessageSquareCode className="h-6 w-6 text-emerald-green" />
              </div>
              <h3 className="text-base font-bold text-white">Multilingual Voice</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empowering illiterate farmers through Whisper STT/TTS models translated into Amharic, Afaan Oromo, English, and Arabic.
              </p>
            </div>

            <div className="bg-charcoal/50 border border-zinc-800/60 p-6 rounded-2xl space-y-4">
              <div className="p-3 bg-emerald-green/10 rounded-xl border border-emerald-green/20 w-fit">
                <Truck className="h-6 w-6 text-emerald-green" />
              </div>
              <h3 className="text-base font-bold text-white">Direct B2B Marketplace</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Disintermediating brokers by listing harvests with verified moisture levels and volume directly to global food processors and mills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Team & Pan-African Expansion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-emerald-green uppercase tracking-wider">Our Team & Vision</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Pan-African Scale & Deep Local Roots
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Gebere Vision was founded by developers, agronomists, and supply chain specialists from the Horn of Africa. We combine deep local trust with state-of-the-art applied machine learning.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-emerald-green/10 border border-emerald-green/20 text-emerald-green font-bold text-xs flex items-center justify-center rounded-xl shrink-0 mt-1">
                  ET
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ethiopia Hub (Current)</h4>
                  <p className="text-xs text-zinc-500">Active piloting in Sidama, Oromia, and Amhara regions.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold text-xs flex items-center justify-center rounded-xl shrink-0 mt-1">
                  EA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">East & North Africa Roadmap (2026/2027)</h4>
                  <p className="text-xs text-zinc-500">Expanding models to target cash crops in Kenya, Egypt, Morocco, Nigeria, and Ghana.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Team member 1 */}
            <div className="bg-charcoal border border-zinc-800 p-6 rounded-2xl text-center space-y-3">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-green to-muted-emerald rounded-full mx-auto flex items-center justify-center text-white font-extrabold text-lg">
                AO
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Abdusalam Oumer</h4>
                <p className="text-[10px] text-emerald-green font-medium">Co-Founder & AI Lead</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ex-Google Africa ML Fellow, specializing in localized Whisper speech models and agricultural vision.
              </p>
            </div>

            {/* Team member 2 */}
            <div className="bg-charcoal border border-zinc-800 p-6 rounded-2xl text-center space-y-3">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-green to-muted-emerald rounded-full mx-auto flex items-center justify-center text-white font-extrabold text-lg">
                MH
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Makako Hamu</h4>
                <p className="text-[10px] text-emerald-green font-medium">Agronomic Director</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ph.D. in Crop Science from Haramaya University, ex-CABI Regional Extension Lead.
              </p>
            </div>

            {/* Team member 3 */}
            <div className="bg-charcoal border border-zinc-800 p-6 rounded-2xl text-center space-y-3">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-green to-muted-emerald rounded-full mx-auto flex items-center justify-center text-white font-extrabold text-lg">
                EA
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ekram Ahmed</h4>
                <p className="text-[10px] text-emerald-green font-medium">Operations & B2B</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ex-Commodity Exchange (ECX) Specialist, managing fair-trade exporter contracts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

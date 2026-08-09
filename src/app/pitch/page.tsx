import { Cpu, Terminal, TrendingUp, BarChart, DollarSign, Layers } from "lucide-react";

export default function PitchDeck() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero / Executive Summary Header */}
      <div className="border-b border-zinc-900 pb-12 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green text-xs font-bold mb-4">
          <Terminal className="h-3.5 w-3.5" />
          <span>YC & Google Applied AI Lab Pitch</span>
        </span>
        <h1 className="text-4xl font-black text-white leading-tight">
          Gebere Vision AI: Executive Summary
        </h1>
        <p className="text-zinc-400 text-lg mt-3 max-w-3xl leading-relaxed">
          <strong>1-Sentence Pitch:</strong> An AI-powered digital agronomist for African smallholders that leverages free diagnostics as a data wedge to build the first transparent, broker-free B2B agricultural supply chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Core Metrics Cards */}
        <div className="bg-charcoal p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="p-2.5 bg-emerald-green/10 border border-emerald-green/20 rounded-xl w-fit">
            <DollarSign className="h-5 w-5 text-emerald-green" />
          </div>
          <h3 className="text-base font-bold text-white">Business Model</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong>The Wedge:</strong> Free mobile diagnostics via Telegram, driving rapid farmer onboarding.<br />
            <strong>The Monetization:</strong> A 3% to 5% trade transaction fee charged to bulk enterprise buyers for certified logistics, supply trace, and quality verification.
          </p>
        </div>

        <div className="bg-charcoal p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="p-2.5 bg-emerald-green/10 border border-emerald-green/20 rounded-xl w-fit">
            <BarChart className="h-5 w-5 text-emerald-green" />
          </div>
          <h3 className="text-base font-bold text-white">Market Size (TAM)</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong>TAM:</strong> $450B Pan-African agricultural market.<br />
            <strong>SAM:</strong> $12B Ethiopian cash crops export (Specialty Coffee, Oilseeds, Teff).<br />
            <strong>SOM:</strong> $240M cooperative-sourced grain and coffee exports transacted through direct fair-trade networks.
          </p>
        </div>

        <div className="bg-charcoal p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="p-2.5 bg-emerald-green/10 border border-emerald-green/20 rounded-xl w-fit">
            <TrendingUp className="h-5 w-5 text-emerald-green" />
          </div>
          <h3 className="text-base font-bold text-white">Traction & Validation</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong>Active Farmers:</strong> 12,000+ pilot farmers onboarded.<br />
            <strong>Accuracy:</strong> 94%+ diagnostic validation validated against agricultural extension agents.<br />
            <strong>Contracts:</strong> 4 cooperative unions partnered, representing 45k hectares.
          </p>
        </div>
      </div>

      {/* Tech Architecture Section */}
      <section className="bg-charcoal border border-zinc-800/80 rounded-3xl p-6 sm:p-8 mb-16">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-green" />
          <span>Technology Architecture</span>
        </h2>
        <p className="text-xs text-zinc-400 mb-8 max-w-2xl">
          Designed for maximum robustness, low-bandwidth processing, and zero latency. Scaled on Supabase serverless and edge computing.
        </p>

        {/* Visual Flow diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="bg-obsidian p-4 rounded-xl border border-zinc-800 text-center">
            <span className="text-xs font-bold text-emerald-green block mb-1">Inputs</span>
            <p className="text-[10px] text-zinc-400">Telegram Photo / Voice Note</p>
          </div>
          <div className="text-center text-zinc-600 hidden md:block">&rarr;</div>
          <div className="bg-obsidian p-4 rounded-xl border border-zinc-800 text-center">
            <span className="text-xs font-bold text-emerald-green block mb-1">Backend Hub</span>
            <p className="text-[10px] text-zinc-400">Node.js Webhook on Railway</p>
          </div>
          <div className="text-center text-zinc-600 hidden md:block">&rarr;</div>
          <div className="bg-obsidian p-4 rounded-xl border border-zinc-800 text-center col-span-1">
            <span className="text-xs font-bold text-emerald-green block mb-1">AI Processing</span>
            <p className="text-[10px] text-zinc-400">Groq / Gemini Vision + Whisper API</p>
          </div>
        </div>

        <div className="h-8 border-l border-r border-dashed border-zinc-800 max-w-[60%] mx-auto my-4 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="bg-obsidian/75 p-5 rounded-2xl border border-zinc-850 space-y-2">
            <h4 className="text-xs font-bold text-white">Database Layer</h4>
            <p className="text-[10px] text-zinc-450 leading-relaxed">
              Supabase PostgreSQL storing spatial farmer data, diagnostic logs, and yield estimations for buyers.
            </p>
          </div>
          <div className="bg-obsidian/75 p-5 rounded-2xl border border-zinc-850 space-y-2">
            <h4 className="text-xs font-bold text-white">CABI Grounding (RAG)</h4>
            <p className="text-[10px] text-zinc-450 leading-relaxed">
              Vector index of CABI Plantwise documents, referenced via LangChain embeddings to prevent false treatments.
            </p>
          </div>
          <div className="bg-obsidian/75 p-5 rounded-2xl border border-zinc-850 space-y-2">
            <h4 className="text-xs font-bold text-white">B2B Dashboard</h4>
            <p className="text-[10px] text-zinc-450 leading-relaxed">
              Next.js App Router providing secure login and purchasing portals for cooperative managers and global grain exporters.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">2026/2027 Expansion Roadmap</h2>
        <div className="relative border-l border-emerald-green/20 ml-4 space-y-8 py-2">
          {/* Item 1 */}
          <div className="relative pl-6">
            <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-green text-glow" />
            <span className="text-[10px] font-bold text-emerald-green uppercase tracking-wider">Q4 2026</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Pilot Scaling in Ethiopia</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Partner with the Ethiopian Ministry of Agriculture to distribute the Telegram bot to 50,000 farmers in Oromia, Amhara, and Sidama. Integrate local commodity exchanges (ECX).
            </p>
          </div>

          {/* Item 2 */}
          <div className="relative pl-6">
            <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-green/40" />
            <span className="text-[10px] font-bold text-emerald-green/70 uppercase tracking-wider">Q2 2027</span>
            <h4 className="text-sm font-bold text-white mt-0.5">East Africa Expansion</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Expand disease models to cash crops like maize and legumes in Kenya and Uganda. Partner with local microfinance institutions to provide inputs based on verified harvest logs.
            </p>
          </div>

          {/* Item 3 */}
          <div className="relative pl-6">
            <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Q4 2027</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Enterprise Logistics Integration</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Launch trace tracking and cooperative union storage telemetry (moisture sensors, weight verification) integrated directly with standard trade invoices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

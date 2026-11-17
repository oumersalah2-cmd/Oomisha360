import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Map,
  ScanLine,
  ShieldCheck,
  Sprout,
  Store,
  Tractor,
} from "lucide-react";

const services = [
  {
    icon: ScanLine,
    eyebrow: "01 / Intelligence",
    title: "See problems earlier",
    description:
      "Turn a crop photo into a practical scouting brief with Gebere Vision AI, built for the realities of Ethiopian fields.",
    href: "/gebere-vision-ai",
  },
  {
    icon: Map,
    eyebrow: "02 / Field operations",
    title: "Know every plot",
    description:
      "Map land, register farms, and keep crop activity in one dependable workspace your team can use every season.",
    href: "/farms",
  },
  {
    icon: BarChart3,
    eyebrow: "03 / Farm economics",
    title: "Grow with clarity",
    description:
      "Track expenses, harvests, and margins in ETB so each decision is grounded in your own numbers.",
    href: "/finance",
  },
  {
    icon: Store,
    eyebrow: "04 / Market access",
    title: "Move harvest forward",
    description:
      "Connect quality produce with buyers and cooperative partners through a focused B2B marketplace.",
    href: "/marketplace",
  },
];

export default function Home() {
  return (
    <main className="space-y-24 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#123b2b] text-white shadow-[0_24px_70px_rgba(18,59,43,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(176,216,105,0.22),transparent_34%),linear-gradient(115deg,rgba(18,59,43,0.98)_0%,rgba(18,59,43,0.86)_45%,rgba(18,59,43,0.3)_100%)]" />
        <div className="relative grid min-h-[620px] items-end gap-12 p-7 sm:p-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:p-16">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9f99d] backdrop-blur-sm">
              <Sprout className="h-4 w-4" />
              Built for Ethiopia&apos;s growers
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              Better farming starts with a clearer view.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#d6e7dc] sm:text-lg">
              Oomisha360 brings farm intelligence, field operations, crop health, and market access into one calm, practical workspace.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/auth/register" className="group inline-flex items-center gap-3 rounded-full bg-[#d9f99d] px-6 py-3.5 text-sm font-bold text-[#123b2b] transition-transform hover:-translate-y-0.5">
                Start your farm workspace
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Explore the platform
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#b8d2c2]">
              {["Simple by design", "Data you control", "Made for field teams"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#d9f99d]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/15" />
            <div className="relative overflow-hidden rounded-[1.5rem] border-8 border-white/90 bg-white shadow-2xl">
              <img src="/images/agriculture-collage.png" alt="A collage of Ethiopian crops, farmers, irrigation, and harvest" className="aspect-square w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 text-[#123b2b] shadow-xl sm:-left-10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#e8f4d0] p-2.5"><Tractor className="h-5 w-5" /></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#69806f]">One connected view</p><p className="mt-0.5 text-sm font-bold">From soil to sale</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b927e]">The Oomisha360 approach</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#123b2b] sm:text-5xl">
            Less guesswork. More progress.
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-[#64736a] lg:ml-auto">
          Your farm is a living system. We designed the platform to keep the important signals together, so farmers, cooperatives, and agronomists can act with confidence.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {services.map(({ icon: Icon, ...service }) => (
          <Link key={service.href} href={service.href} className="group rounded-[1.5rem] border border-[#dfe8df] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#9bbf8d] hover:shadow-[0_18px_40px_rgba(18,59,43,0.08)]">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-[#edf6e3] p-3.5 text-[#286344]"><Icon className="h-6 w-6" /></div>
              <ArrowUpRight className="h-5 w-5 text-[#9caf9f] transition-colors group-hover:text-[#286344]" />
            </div>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9d8c]">{service.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#123b2b]">{service.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#68776d]">{service.description}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-[#286344]">Open workspace <ChevronRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </section>

      <section className="grid gap-8 rounded-[1.75rem] bg-[#e8f1df] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-[#286344]"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Start with what matters</span></div>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#123b2b] sm:text-4xl">A professional operating layer for every growing season.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c7261]">Create your account, add your first farm, and build a reliable record of the decisions that move your harvest forward.</p>
        </div>
        <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123b2b] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#286344]">Create your account <ArrowUpRight className="h-4 w-4" /></Link>
      </section>
    </main>
  );
}

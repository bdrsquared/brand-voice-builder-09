import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Zap, Crown, Rocket } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";
import { useLocale } from "@/contexts/LocaleContext";
import { gbpToUsd } from "@/lib/fx";

/* ──────────────────────────────────────────────────────────────
   PRICING RENEWALS PAGE — /pricing/renewals
   Internal-facing. Noindexed. Reframes the pricing model around
   contract renewals: onboarding/launch work is already done, so
   the only variable is term length (6 / 12 / 18 months) and the
   production setup. Longer terms attract larger commitment
   discounts off the monthly retainer.
   ────────────────────────────────────────────────────────────── */

type Currency = "GBP" | "USD" | "EUR";
type ProdType = "location" | "studio" | "virtual";
type Term = 6 | 12 | 18;
type EpsPerMonth = 1 | 2 | 4;

const CURRENCY_SYMBOLS: Record<Currency, string> = { GBP: "£", USD: "$", EUR: "€" };
const FX_RATES: Record<Currency, number> = { GBP: 1, USD: 1.27, EUR: 1.17 };

/* Base monthly retainers in GBP at the standard 2 episodes/month cadence
   (no launch fee — that's already paid). */
const BASE_MONTHLY_GBP: Record<ProdType, { t1: number; t2: number; t3: number }> = {
  location: { t1: 3250, t2: 5000, t3: 8500 },
  studio:   { t1: 2630, t2: 4000, t3: 6900 },
  virtual:  { t1: 2330, t2: 3500, t3: 6000 },
};

/* Cadence multiplier — applied to the base 2-ep monthly retainer.
   1 ep/mo is lighter production load; 4 ep/mo earns mild economies of scale. */
const EPS_MULTIPLIER: Record<EpsPerMonth, number> = { 1: 0.6, 2: 1.0, 4: 1.75 };

/* Renewal discount on monthly retainer by term length. */
const TERM_DISCOUNT: Record<Term, number> = { 6: 0, 12: 0.05, 18: 0.10 };
const TERM_LABEL: Record<Term, string> = {
  6: "6-month renewal",
  12: "12-month renewal",
  18: "18-month renewal",
};

/* Convert GBP → active currency with neat rounding for USD via fx.ts. */
const convert = (gbp: number, currency: Currency): number => {
  if (currency === "USD") return gbpToUsd(gbp);
  if (currency === "EUR") {
    const eur = gbp * FX_RATES.EUR;
    return eur >= 1000 ? Math.round(eur / 100) * 100 : Math.round(eur / 50) * 50;
  }
  return gbp;
};

const fmt = (gbp: number, currency: Currency): string =>
  `${CURRENCY_SYMBOLS[currency]}${convert(gbp, currency).toLocaleString("en-US")}`;

/* ── Palette tokens (matches main pricing page) ── */
const C = {
  plum: "#4e2d7a", plumBg: "#f0eaf8",
  greenDk: "#1a5c2a", greenBg: "#e8f5ec",
  blueDk: "#1649a0", blueBg: "#eaeffa",
};

/* ── Tier card config ── */
const tierCards = [
  {
    id: "t3" as const,
    num: "Global Leader",
    name: "Keep owning the\nconversation\nyou built.",
    hook: "You've built the platform. Renew to protect the position — and compound the authority your team's already established in market.",
    dopamine: "Category ownership compounds. Every month you keep going makes you harder to displace.",
    icon: Crown,
  },
  {
    id: "t2" as const,
    num: "Launch & Scale",
    name: "Same engine.\nLess setup.\nMore output.",
    hook: "The strategy is set, the rhythm is established, the team knows your business. Renew and let the flywheel keep turning — sharper every quarter.",
    dopamine: "Year two is when the content library starts working harder than the content you're shipping.",
    icon: Zap,
    featured: true,
  },
  {
    id: "t1" as const,
    num: "Continue",
    name: "Another series.\nReady to ship.",
    hook: "Run a fresh series of 6 episodes on the format we've already proven works for your brand — no re-onboarding, no setup time.",
    dopamine: "The fastest path back to market with a series that's already proven for your audience.",
    icon: Rocket,
  },
];

/* ── Renewals: what's included (rewritten for renewing clients) ── */
type SvcRow = { name: string; desc: string; status: "included"; label: string } | { name: string; desc: string; status: "not-included" };
type SvcSection = { section: string; rows: SvcRow[] };

const RENEWAL_NOTE = "Already established at onboarding";

const T1_RENEWAL: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "ICP, concept, format, positioning", desc: "All defined and locked in at original onboarding. We carry it forward and refresh only where the market has moved.", status: "included", label: `${RENEWAL_NOTE} — refreshed where needed` },
    { name: "Series planning", desc: "We plan the next series of 6 episodes around what's worked, what hasn't, and where you want the brand to push next.", status: "included", label: "Fresh series of 6 episodes scoped to your goals" },
    { name: "Host coaching refresher", desc: "Light-touch coaching to keep your host sharp — no need to rebuild from scratch.", status: "included", label: "Included" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Another complete series, delivered to the rhythm and quality bar we've already set together.", status: "included", label: "6 episodes — fresh series" },
    { name: "Recording, editing, publishing", desc: "Same team, same standards, same systems — nothing to re-learn.", status: "included", label: "Full production end-to-end" },
    { name: "PodPlanner access", desc: "Your existing PodPlanner workspace carries forward with the new series.", status: "included", label: "Continued access" },
  ]},
  { section: "Content & Distribution", rows: [
    { name: "Clips, captions, thumbnails, show notes", desc: "Same full content package per episode you had before.", status: "included", label: "4–6 clips, captions, thumbnails and SEO show notes per episode" },
    { name: "Repurposing & social management", desc: "Stays on the package you originally chose.", status: "not-included" },
  ]},
];

const T2_RENEWAL: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "ICP, concept, format, positioning", desc: "All carried forward from your existing setup. Annual refresh built into the renewal.", status: "included", label: `${RENEWAL_NOTE} — annual strategic refresh included` },
    { name: "Roadmap & content pillars", desc: "We rebuild the next 12 months of editorial direction based on what's working and where your buyer is moving.", status: "included", label: "Refreshed roadmap for the renewal term" },
    { name: "Marketing stack integration", desc: "Your CRM, email and automation hooks already exist. We monitor and adjust as your stack evolves.", status: "included", label: "Maintained and optimised" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Same cadence. Same team. Same systems. No ramp.", status: "included", label: "2 episodes per month, every month" },
    { name: "Recording, editing, publishing", desc: "The producers who know your guests, your tone, your story.", status: "included", label: "Full video & audio production, fully managed" },
    { name: "PodPlanner", desc: "Your existing workspace continues, with renewal-period rituals built in.", status: "included", label: "Continued access" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Clips, hooks, captions, copy", desc: "Same package per episode — but now informed by 12 months of data on what your audience actually engages with.", status: "included", label: "4–6 clips with full social copy per episode" },
    { name: "Thumbnails & visuals", desc: "Episode artwork and graphics continue to your existing visual system.", status: "included", label: "Episode thumbnails, cover art and social graphics" },
    { name: "Show notes & SEO", desc: "Long-form notes that keep compounding your back catalogue's search value.", status: "included", label: "Long-form show notes with SEO" },
    { name: "Content repurposing", desc: "LinkedIn posts, articles, email copy and quote cards from every episode.", status: "included", label: "Full repurposing across formats" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "We post on your behalf across every channel, every week.", status: "included", label: "Fully managed across LinkedIn, YouTube and social" },
    { name: "Email & newsletter distribution", desc: "Each episode goes out through your existing newsletter integration.", status: "included", label: "Integrated into your newsletter" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest pipeline", desc: "Your existing guest list now carries network effects — every booked guest opens doors to the next ones.", status: "included", label: "Ongoing pipeline of ICP-aligned guests" },
    { name: "Outreach & booking", desc: "End-to-end booking continues, with the warm relationships we've built on your behalf.", status: "included", label: "End-to-end outreach and booking" },
    { name: "PR & press amplification", desc: "Active outreach to press and trade media around marquee episodes.", status: "included", label: "Active PR outreach" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "Renewal year is where this gets sharp — we now know which episodes actually move deals.", status: "included", label: "Themes mapped to your sales cycle, refined with year-one data" },
    { name: "Sales team content toolkit", desc: "Continuously updated library your sales team can drop into outreach.", status: "included", label: "Maintained and expanded each month" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Monthly reporting continues — with year-on-year benchmarks now available.", status: "included", label: "Monthly report with YoY benchmarking" },
    { name: "Ongoing optimisation", desc: "Monthly review and adjustment — the show keeps getting sharper.", status: "included", label: "Monthly review across content, format and distribution" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Senior account management", desc: "The same named senior contact who already knows your business inside out.", status: "included", label: "Continuity guaranteed — same lead, same team" },
  ]},
];

const T3_RENEWAL: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Category positioning & roadmap", desc: "Carried forward and refreshed quarterly. Year two is when the agenda you set in year one starts paying off.", status: "included", label: "Quarterly strategic refresh built in" },
    { name: "Target account mapping", desc: "Your target account list updated against current pipeline priorities.", status: "included", label: "Refreshed against current pipeline targets" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Consistent cadence, no ramp.", status: "included", label: "2 episodes per month, every month" },
    { name: "Full production stack", desc: "Studio or remote, editing, publishing — fully managed by the team you already know.", status: "included", label: "End-to-end production" },
    { name: "PodPlanner", desc: "Your existing workspace continues.", status: "included", label: "Continued access" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Clips, hooks, captions, copy", desc: "Full content package per episode.", status: "included", label: "6–10 clips with full social copy per episode" },
    { name: "Thumbnails & visuals", desc: "Episode artwork and graphics.", status: "included", label: "Episode thumbnails, cover art and social graphics" },
    { name: "Show notes & SEO", desc: "Long-form notes — your back catalogue now ranks for terms it didn't a year ago.", status: "included", label: "Long-form show notes with SEO" },
    { name: "Content repurposing", desc: "Every episode becomes LinkedIn posts, articles, email copy and quote cards.", status: "included", label: "Full repurposing across formats" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "Fully managed across every channel.", status: "included", label: "Fully managed across all channels" },
    { name: "Email & newsletter distribution", desc: "Episode distribution through your newsletter.", status: "included", label: "Integrated into your newsletter" },
    { name: "Paid media", desc: "Globally targeted campaigns continue. Your existing pixel data and audience profiles make this more efficient in year two.", status: "included", label: "Paid campaigns across LinkedIn, YouTube and Spotify — globally targeted" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Target account guest pipeline", desc: "Year-two pipeline is shorter and warmer — your existing guest list is already opening the doors you want.", status: "included", label: "Guests chosen from your target account list" },
    { name: "Outreach & booking", desc: "End-to-end booking, with the warmer network you've now built.", status: "included", label: "End-to-end outreach and booking" },
    { name: "PR & press amplification", desc: "Full PR engine continues.", status: "included", label: "Full PR engine — press and trade media" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC programme", desc: "Structured UGC continues around every episode.", status: "included", label: "Structured UGC programme around every episode" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "Now informed by 12 months of attribution data — episodes planned around what actually moves deals.", status: "included", label: "Themes mapped to your sales cycle, refined with year-one data" },
    { name: "Sales team content toolkit", desc: "Curated library expands each month.", status: "included", label: "Maintained and expanded each month" },
    { name: "Lead capture & landing pages", desc: "Existing landing pages maintained, optimised and added to as the show grows.", status: "included", label: "Maintained and optimised" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Monthly reporting with YoY benchmarks now available.", status: "included", label: "Monthly report with YoY benchmarking" },
    { name: "Pipeline & revenue attribution", desc: "Year-two attribution is where the board-level numbers start to land.", status: "included", label: "Attribution tracking from content to closed revenue" },
    { name: "Ongoing optimisation", desc: "Monthly review and adjustment.", status: "included", label: "Monthly review across content, format and distribution" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Quarterly senior strategy sessions continue.", status: "included", label: "Quarterly sessions with senior strategic lead" },
    { name: "Senior account management", desc: "Same named senior contact. Continuity guaranteed for the renewal term.", status: "included", label: "Continuity guaranteed — same lead, same team" },
  ]},
];

const SECTIONS_BY_TIER: Record<"t1" | "t2" | "t3", SvcSection[]> = {
  t1: T1_RENEWAL,
  t2: T2_RENEWAL,
  t3: T3_RENEWAL,
};

/* ── Service table ── */
const ServiceTable = ({ sections }: { sections: SvcSection[] }) => (
  <div className="overflow-x-auto -mx-6 sm:-mx-8">
    <table className="w-full border-collapse min-w-[500px]">
      {sections.map((sec) => (
        <tbody key={sec.section}>
          <tr><td colSpan={2} className="bg-secondary/40 px-5 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary border-y border-border">{sec.section}</td></tr>
          {sec.rows.map((row) => (
            <tr key={row.name} className="group hover:bg-secondary/20 transition-colors">
              <td className="px-5 py-3 border-b border-border align-top min-w-[200px]">
                <div className="text-[13px] font-medium text-text-primary mb-0.5">{row.name}</div>
                <div className="text-xs text-text-tertiary leading-snug">{row.desc}</div>
              </td>
              <td className="px-5 py-3 border-b border-border align-top min-w-[160px]">
                {row.status === "included" ? (
                  <div className="flex items-start gap-2">
                    <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 bg-white/10 text-text-secondary">✓</span>
                    <span className="text-[13px] leading-snug text-text-secondary font-medium">{row.label}</span>
                  </div>
                ) : (
                  <span className="text-xs text-text-tertiary/50 pt-1 block">Not on this tier</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  </div>
);

/* ── Toggles ── */
const CurrencyToggle = ({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) => (
  <div className="inline-flex items-center rounded-full border border-border bg-card p-1 gap-0.5">
    {(["GBP", "USD", "EUR"] as Currency[]).map((c) => (
      <button
        key={c}
        onClick={() => onChange(c)}
        className={`text-xs font-medium tracking-wide px-4 py-1.5 rounded-full transition-all duration-200 ${
          value === c ? "bg-white/10 text-text-primary shadow-sm" : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        {CURRENCY_SYMBOLS[c]} {c}
      </button>
    ))}
  </div>
);

const TermToggle = ({ value, onChange }: { value: Term; onChange: (t: Term) => void }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card">
    {([6, 12, 18] as Term[]).map((t, i) => {
      const active = value === t;
      const discount = TERM_DISCOUNT[t];
      return (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`text-left p-5 transition-colors ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-border" : ""} ${active ? "bg-background" : ""}`}
        >
          <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary block mb-1">Renewal term</span>
          <span className={`font-heading text-lg block mb-1 ${active ? "text-text-primary" : "text-text-secondary"}`}>
            {t} months
          </span>
          <span className="text-xs text-text-tertiary leading-relaxed block">
            {t === 6 && "Short cycle. Keep momentum without a longer commitment."}
            {t === 12 && "The standard renewal — covers a full annual planning cycle."}
            {t === 18 && "Lock in rates and roadmap through a full strategic period."}
          </span>
          {discount > 0 && (
            <span className="inline-block mt-2 text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: "rgba(28,250,118,0.15)", color: "hsl(145,60%,55%)" }}>
              Save {Math.round(discount * 100)}% on monthly
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const CadenceToggle = ({ value, onChange }: { value: EpsPerMonth; onChange: (e: EpsPerMonth) => void }) => (
  <div className="grid grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card">
    {([1, 2, 4] as EpsPerMonth[]).map((n, i) => {
      const active = value === n;
      const sub: Record<EpsPerMonth, string> = {
        1: "Lighter cadence",
        2: "Standard cadence",
        4: "High output",
      };
      return (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`text-center py-3 px-2 transition-colors ${i < 2 ? "border-r border-border" : ""} ${active ? "bg-background text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
        >
          <div className="text-xs font-medium">{n} episode{n > 1 ? "s" : ""}/mo</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">{sub[n]}</div>
        </button>
      );
    })}
  </div>
);

const ProductionToggle = ({ value, onChange }: { value: ProdType; onChange: (p: ProdType) => void }) => (
  <div className="grid grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card">
    {(["location", "studio", "virtual"] as ProdType[]).map((p, i) => {
      const active = value === p;
      const labels: Record<ProdType, string> = { location: "On Location", studio: "Studio", virtual: "Virtual" };
      return (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`text-center py-3 px-2 text-xs font-medium transition-colors ${i < 2 ? "border-r border-border" : ""} ${active ? "bg-background text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
        >
          {labels[p]}
        </button>
      );
    })}
  </div>
);

/* ── Modal scaffolding ── */
const ModalHeader = ({ children, accentColor }: { children: React.ReactNode; accentColor: string }) => (
  <div className="relative overflow-hidden border-b border-border">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, hsl(246,27%,65%), transparent)` }} />
    <motion.div
      animate={{ x: [0, 30, -20, 0], y: [0, -15, 10, 0], scale: [1, 1.2, 0.9, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
      style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
    />
    <div className="relative p-6 sm:p-8 pb-5">{children}</div>
  </div>
);

const tierAccent: Record<string, string> = { t1: "hsl(184,22%,53%)", t2: "hsl(140,24%,62%)", t3: "hsl(246,27%,65%)" };

/* ── Compute prices ── */
const useRenewalPrice = (tier: "t1" | "t2" | "t3", prodType: ProdType, term: Term, currency: Currency) => {
  return useMemo(() => {
    const baseMonthly = BASE_MONTHLY_GBP[prodType][tier];
    const discount = TERM_DISCOUNT[term];
    const monthlyGbp = Math.round(baseMonthly * (1 - discount));
    const totalGbp = monthlyGbp * term;
    return {
      monthly: fmt(monthlyGbp, currency),
      total: fmt(totalGbp, currency),
      monthlyRaw: convert(monthlyGbp, currency),
      totalRaw: convert(totalGbp, currency),
      savingGbp: (baseMonthly - monthlyGbp) * term,
      saving: fmt((baseMonthly - monthlyGbp) * term, currency),
    };
  }, [tier, prodType, term, currency]);
};

/* ── Main page ── */
const PricingRenewals = () => {
  useMetaTags();

  useEffect(() => {
    window.scrollTo(0, 0);
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    document.title = "Contract Renewal Pricing | Earworm";
    return () => { meta.remove(); };
  }, []);

  const { isUS } = useLocale();
  const [currency, setCurrency] = useState<Currency>(isUS ? "USD" : "GBP");
  const [prodType, setProdType] = useState<ProdType>("location");
  const [term, setTerm] = useState<Term>(12);
  const [eps, setEps] = useState<EpsPerMonth>(2);
  const [activeModal, setActiveModal] = useState<"t1" | "t2" | "t3" | null>(null);

  const priceFor = (tier: "t1" | "t2" | "t3") => {
    const baseMonthly = BASE_MONTHLY_GBP[prodType][tier];
    // T1 is a finite series of 6 episodes — cadence only changes pace, not cost.
    const cadenceMult = tier === "t1" ? 1 : EPS_MULTIPLIER[eps];
    const adjustedBase = baseMonthly * cadenceMult;
    const monthlyGbp = Math.round(adjustedBase * (1 - TERM_DISCOUNT[term]));
    const totalGbp = monthlyGbp * term;
    return {
      monthly: fmt(monthlyGbp, currency),
      total: fmt(totalGbp, currency),
      baseMonthly: fmt(Math.round(adjustedBase), currency),
      saving: TERM_DISCOUNT[term] > 0 ? fmt((Math.round(adjustedBase) - monthlyGbp) * term, currency) : null,
    };
  };

  // T1 series duration in months depending on cadence (always 6 episodes total).
  const t1Months = eps === 1 ? 6 : eps === 2 ? 3 : 2;

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-foreground">
      <Navbar />

      {/* ── HERO ── */}
      <header className="relative bg-card overflow-hidden pt-24 md:pt-32 pb-36 md:pb-44 px-6 rounded-b-[40px] md:rounded-b-[60px]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px)" }} />
        <div className="blob-green absolute -top-40 -right-40 w-[500px] h-[500px]" />
        <div className="blob-blue absolute -bottom-32 -left-32 w-[400px] h-[400px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="mb-6 mt-6 flex justify-center">
            <SectionPill>Contract renewal</SectionPill>
          </div>
          <h1 className="text-3xl md:text-6xl lg:text-7xl mb-6">
            Renewing your<br />
            <span className="bg-gradient-to-r from-veneer-teal via-veneer-purple to-veneer-rose bg-clip-text text-transparent">contract.</span><br />
            No reset. No ramp.
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed mb-8">
            The strategy is set. The systems are running. The team knows your business.
            Renewal pricing reflects that — and rewards longer commitment.
          </p>
        </div>
      </header>

      {/* ── BODY ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-10 -mt-20 md:-mt-24 relative z-10">
        {!isUS && (
          <div className="flex justify-center mb-4">
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </div>
        )}

        {/* Term toggle (primary) */}
        <div className="mb-3">
          <TermToggle value={term} onChange={setTerm} />
        </div>

        {/* Production toggle */}
        <div className="mb-3">
          <ProductionToggle value={prodType} onChange={setProdType} />
        </div>

        {/* Episodes-per-month cadence toggle */}
        <div className="mb-6">
          <CadenceToggle value={eps} onChange={setEps} />
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden items-stretch">
          {tierCards.map((tier, i) => {
            const Icon = tier.icon;
            const price = priceFor(tier.id);
            const tierAccents: Record<string, { gradient: string; border: string; glow: string; btn: string }> = {
              t3: { gradient: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,89,234,0.15), transparent 70%)", border: "hsl(243,79%,63%)", glow: "0 -1px 30px rgba(99,89,234,0.2)", btn: "rgba(99,89,234,0.15)" },
              t2: { gradient: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(28,250,118,0.12), transparent 70%)", border: "hsl(145,96%,55%)", glow: "0 -1px 30px rgba(28,250,118,0.18)", btn: "rgba(28,250,118,0.15)" },
              t1: { gradient: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,179,71,0.15), transparent 70%)", border: "hsl(30,100%,65%)", glow: "0 -1px 30px rgba(255,179,71,0.2)", btn: "rgba(255,179,71,0.15)" },
            };
            const ac = tierAccents[tier.id];
            const featured = (tier as any).featured;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-6 sm:p-8 flex flex-col transition-all duration-200 ${featured ? "bg-background" : "bg-card"}`}
                style={{ boxShadow: ac.glow }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${ac.border}, transparent)` }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: ac.gradient }} />

                <div className="relative flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg"
                    style={{ background: ac.btn, boxShadow: `0 4px 16px ${ac.border}33, inset 0 1px 0 rgba(255,255,255,0.1)` }}>
                    <Icon className="w-5 h-5" style={{ color: ac.border }} />
                  </div>
                  <span className="text-[10px] font-medium tracking-[0.08em] uppercase px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-text-secondary">
                    {tier.num}
                  </span>
                </div>

                <div className="relative flex flex-col flex-1">
                  <h2 className="font-heading text-xl sm:text-2xl text-text-primary mb-3 whitespace-pre-line leading-tight">{tier.name}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">{tier.hook}</p>
                  <hr className="border-border mb-5 mt-auto" />

                  <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">
                    {tier.id === "t1" ? "Series investment" : "Monthly retainer"}
                  </div>

                  {tier.id === "t1" ? (
                    <>
                      <div className="font-heading text-2xl sm:text-3xl text-text-primary mb-1">{price.total}</div>
                      <div className="text-xs text-text-tertiary mb-5">
                        Fresh series of 6 episodes · delivered over {t1Months} months at {eps} ep{eps > 1 ? "s" : ""}/mo · no setup fees
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-heading text-2xl sm:text-3xl text-text-primary mb-1">
                        {price.monthly}<span className="text-base text-text-tertiary font-normal">/mo</span>
                      </div>
                      <div className="text-xs text-text-tertiary mb-2">
                        {eps} episode{eps > 1 ? "s" : ""}/mo · {price.total} total over {term} months
                        {tier.id === "t3" && " · + ad spend"}
                      </div>
                      {price.saving && (
                        <div className="text-xs mb-3" style={{ color: "hsl(145,60%,55%)" }}>
                          Saving {price.saving} vs. month-to-month
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-xs leading-relaxed p-3 rounded-lg border border-white/[0.08] mb-5 text-text-secondary backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                    {tier.dopamine}
                  </div>

                  <button
                    onClick={() => setActiveModal(tier.id)}
                    className="w-full text-xs font-medium tracking-wide py-2.5 px-4 rounded-lg border border-white/[0.08] text-text-primary hover:bg-white/[0.06] transition-all flex items-center justify-center gap-1.5 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.04)", boxShadow: `0 0 20px ${ac.border}11` }}
                  >
                    See what's included on renewal <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Renewal terms summary card */}
        <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Renewal terms</div>
            <h3 className="font-heading text-lg text-text-primary">How renewal pricing works</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">No setup fees</div>
              <p className="text-sm text-text-secondary leading-relaxed">Strategy, positioning, host coaching, marketing stack integration — all already done at original onboarding. Nothing to pay for twice.</p>
            </div>
            <div className="p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Term discounts</div>
              <p className="text-sm text-text-secondary leading-relaxed">6 months at the standard rate. 12 months saves 5% on the monthly. 18 months saves 10%. Discount applies for the full renewal term.</p>
            </div>
            <div className="p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Team continuity</div>
              <p className="text-sm text-text-secondary leading-relaxed">Same producers, same senior lead, same systems. The team that knows your business stays on the account for the renewal period.</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center py-12 md:py-16">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Questions on the renewal?</strong> Speak to your account lead directly, or reach the senior team for any commercial adjustments.
          </p>
        </div>
      </main>

      {/* ── Tier modal ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[620px] my-auto rounded-2xl border border-border overflow-hidden bg-card"
            >
              <ModalHeader accentColor={tierAccent[activeModal]}>
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-10 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-secondary">
                  <X className="w-4 h-4" />
                </button>
                <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">
                  {tierCards.find(t => t.id === activeModal)?.num} · {TERM_LABEL[term]}
                </div>
                <h3 className="font-heading text-2xl text-text-primary mb-2">What's included on renewal</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Everything below carries forward from your existing setup. The onboarding work is already done — this is the ongoing engine.
                </p>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-heading text-3xl text-text-primary">
                    {activeModal === "t1" ? priceFor(activeModal).total : priceFor(activeModal).monthly}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {activeModal === "t1" ? `for ${term === 6 ? "this series" : "renewed series"}` : `per month · ${term}-month term`}
                  </span>
                </div>
              </ModalHeader>
              <div className="p-6 sm:p-8">
                <ServiceTable sections={SECTIONS_BY_TIER[activeModal]} />
                <div className="mt-6 bg-secondary/40 rounded-xl p-5">
                  <p className="text-sm text-text-secondary leading-relaxed m-0">
                    <strong className="text-text-primary">Renewal note:</strong>{" "}
                    {activeModal === "t1" && "A fresh series on the format we've already validated together — no concept work, no host search, no learning curve."}
                    {activeModal === "t2" && `Year two is when the content engine compounds. Your back catalogue keeps working, your guest network keeps opening doors, and your team keeps getting sharper at what already works for your buyer.`}
                    {activeModal === "t3" && "Category positions are built over years, not quarters. Renewal protects what you've established and lets the attribution data from year one sharpen everything you do in year two."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PricingRenewals;

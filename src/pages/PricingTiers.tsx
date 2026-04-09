import { useEffect, useState, useMemo, lazy, Suspense, memo } from "react";

/* ── currency conversion ── */
type Currency = "GBP" | "USD" | "EUR";
const CURRENCY_SYMBOLS: Record<Currency, string> = { GBP: "£", USD: "$", EUR: "€" };
const RATES: Record<Currency, number> = { GBP: 1, USD: 1.27, EUR: 1.17 };

const convertPrice = (gbpAmount: number, currency: Currency): string => {
  const converted = Math.round(gbpAmount * RATES[currency]);
  return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString()}`;
};
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";

/* ── palette tokens (mirrors Content Playbook) ── */
const C = {
  sage: "#7BAF8E",
  purple: "#8B83C7",
  teal: "#6A9FA3",
  amber: "#C9A96E",
  rose: "#C484C9",
  plum: "#4e2d7a",
  plumBg: "#f0eaf8",
  greenDk: "#1a5c2a",
  greenBg: "#e8f5ec",
  blueDk: "#1649a0",
  blueBg: "#eaeffa",
  amberDk: "#8a4f0a",
  amberBg: "#fdf0e0",
};

/* ── tiny reusable pieces ── */
const InsightChip = ({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) => (
  <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium" style={{ background: bg, color }}>{children}</span>
);

const SectionTitle = ({ children }: { children: string }) => (
  <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-3 pb-2 border-b border-border">{children}</div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item} className="text-sm text-text-secondary flex gap-2.5 leading-relaxed">
        <span className="text-text-tertiary text-xs mt-0.5 shrink-0">→</span>{item}
      </li>
    ))}
  </ul>
);

/* ── Service table row types ── */
type SvcRow = { name: string; desc: string; status: "included"; label: string } | { name: string; desc: string; status: "not-included" };
type SvcSection = { section: string; rows: SvcRow[] };

const tierDotClass: Record<string, string> = {
  t1: "bg-primary/15 text-primary",
  t2: "bg-primary/15 text-primary",
  t3: "bg-primary/15 text-primary",
};
const tierLabelClass: Record<string, string> = {
  t1: "text-primary font-medium",
  t2: "text-primary font-medium",
  t3: "text-primary font-medium",
};

const ServiceTable = ({ sections, tier }: { sections: SvcSection[]; tier: string }) => (
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
                    <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ${tierDotClass[tier]}`}>✓</span>
                    <span className={`text-[13px] leading-snug ${tierLabelClass[tier]}`}>{row.label}</span>
                  </div>
                ) : (
                  <span className="text-xs text-text-tertiary/50 pt-1 block">Not included in this tier</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  </div>
);

/* ── tier data (base prices in GBP) ── */
const baseTiers = [
  {
    id: "t3",
    num: "Tier 03 · Category Engine",
    name: "Become the only\nname your market\nthinks of.",
    hook: "We build the infrastructure for your brand to own the conversation in your category across every channel, in every market, at a scale your competitors can't match without starting from scratch.",
    modalPitch: "In 18 months, anyone who matters in your market will associate your brand with the conversation not just a participant in it. This is the infrastructure that makes that happen: paid, organic, creator, UGC and PR firing simultaneously, across every channel your buyers are on, globally.",
    modalTitle: "Category Engine",
    basePrice: 125000,
    priceSuffix: "/yr",
    basePriceNote: (c: Currency) => `+ min ${convertPrice(3000, c)}/month ad spend`,
    dopamine: "Your competitors will feel this before they understand what's happening.",
    modalDopamine: "Your competitors will feel this before they understand what's happening.",
    featured: false,
  },
  {
    id: "t2",
    num: "Tier 02 · Launch & Scale",
    name: "Your brand,\nin front of your\nbuyer. Every month.",
    hook: "A fully managed content engine that puts you in front of the right people consistently, professionally, without your team lifting a finger.",
    modalPitch: "Your podcast becomes part of how your company shows up in the market consistently, professionally, and without your team carrying the operational weight.",
    modalTitle: "Launch & Scale",
    basePrice: 75000,
    priceSuffix: "/yr",
    basePriceNote: (c: Currency) => `${convertPrice(15000, c)} onboarding · ${convertPrice(5750, c)}/month · 2 episodes/month`,
    dopamine: "The equivalent of a senior content hire without the salary, overhead, or learning curve.",
    modalDopamine: "What does a single warm conversation with a dream client cost you through paid channels? This builds a system that generates them every month.",
    featured: true,
    popular: true,
  },
  {
    id: "t1",
    num: "Tier 01",
    name: "A show your\nmarket notices.",
    hook: "A polished, credible podcast built from the ground up with the strategy, production and content to establish real authority in your space.",
    modalPitch: "You go from \"we keep saying we should start a podcast\" to a polished, credible show your team is proud to share with the strategy to ensure it's built on something real.",
    modalTitle: "Launch",
    basePrice: 19500,
    priceSuffix: "",
    basePriceNote: (_c: Currency) => "One-time fee · 6 episodes · strategy included",
    dopamine: "If you're not proud of what we build, we'll be the first to say so.",
    featured: false,
  },
];

/* ── Currency toggle component ── */
const CurrencyToggle = ({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) => (
  <div className="inline-flex items-center rounded-full border border-border bg-card p-1 gap-0.5">
    {(["GBP", "USD", "EUR"] as Currency[]).map((c) => (
      <button
        key={c}
        onClick={() => onChange(c)}
        className={`text-xs font-medium tracking-wide px-4 py-1.5 rounded-full transition-all duration-200 ${
          value === c
            ? "bg-white/10 text-text-primary shadow-sm"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        {CURRENCY_SYMBOLS[c]} {c}
      </button>
    ))}
  </div>
);

/* ── Modal content: Tier 1 ── */
const T1_SECTIONS: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "Define exactly who you're talking to, what they care about, and why your show is relevant to them.", status: "included", label: "Included" },
    { name: "Podcast concept & positioning", desc: "Shape the format, name, tone and market position of the show so it stands out from day one.", status: "included", label: "Included" },
    { name: "Content pillars & roadmap", desc: "Identify the core themes and topics that will drive consistent engagement across every episode.", status: "included", label: "Included" },
    { name: "Distribution strategy", desc: "A clear plan for how and where the show reaches your audience from launch.", status: "included", label: "Included" },
    { name: "Host sourcing & training", desc: "Identify and prepare the right on-screen talent — internal leadership or external host.", status: "not-included" },
    { name: "Marketing stack integration", desc: "Connect the podcast into your CRM, email and marketing automation so content feeds the funnel.", status: "not-included" },
  ]},
  { section: "Production", rows: [
    { name: "Episode volume", desc: "Fully produced episodes, end-to-end from brief to published.", status: "included", label: "6 episodes total" },
    { name: "Video & audio recording", desc: "High-quality recording with full technical direction and setup support — studio or remote.", status: "included", label: "Studio & remote" },
    { name: "Professional editing", desc: "Full post-production for video and audio — paced, polished, broadcast standard.", status: "included", label: "Video + audio" },
    { name: "Publishing & distribution", desc: "Published across all major podcast platforms from day one.", status: "included", label: "All platforms" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form social clips", desc: "Platform-optimised video clips cut from each episode to drive reach and engagement.", status: "included", label: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Written content for every clip — crafted to stop the scroll and stay on-brand.", status: "included", label: "Captions per episode" },
    { name: "Branded thumbnails & visuals", desc: "On-brand visual assets for every episode — thumbnails, cover art and social graphics.", status: "included", label: "Thumbnails & cover art" },
    { name: "SEO-optimised show notes", desc: "Long-form written show notes built to rank in search and extend the life of every episode.", status: "included", label: "Full SEO show notes" },
    { name: "Multi-format content repurposing", desc: "Each episode turned into multiple formats — articles, LinkedIn posts, email copy, quote cards.", status: "not-included" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media posting & management", desc: "We write and publish content across LinkedIn, YouTube and social on your behalf.", status: "not-included" },
    { name: "Newsletter & email distribution", desc: "Episode content distributed through your email list and newsletter.", status: "not-included" },
    { name: "Paid media amplification", desc: "Targeted paid campaigns across LinkedIn, YouTube and Spotify.", status: "not-included" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "Research and identify the right guests — aligned to your ICP and relevant to your content pillars.", status: "included", label: "Launch guest targeting" },
    { name: "Personalised outreach & booking", desc: "Tailored outreach to every guest — managed end-to-end from first contact to recording.", status: "included", label: "Outreach & booking" },
    { name: "PR & industry amplification", desc: "Turn key episodes into PR moments — press coverage and third-party amplification.", status: "not-included" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "Turn hosts, guests and your team into active content contributors around every episode.", status: "not-included" },
    { name: "Creator & influencer partnerships", desc: "Partner with relevant creators to carry your content to new audiences through trusted voices.", status: "not-included" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales content alignment", desc: "Episodes and clips built around the exact challenges your buyers face.", status: "not-included" },
    { name: "Outbound content toolkit", desc: "A library of clips and written assets your sales team can use in outreach sequences.", status: "not-included" },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads and feed your funnel.", status: "not-included" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Regular reporting on audience, engagement, content performance and channel breakdown.", status: "included", label: "End-of-pilot report" },
    { name: "Pipeline & revenue attribution", desc: "Track the journey from content impression to pipeline influence.", status: "not-included" },
    { name: "Continuous optimisation", desc: "Ongoing refinement of content, format and distribution based on performance data.", status: "not-included" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight treating the podcast as a board-level commercial asset.", status: "not-included" },
    { name: "Senior strategic account management", desc: "A named senior contact who understands your business and the commercial context behind every decision.", status: "not-included" },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "All deliverables guaranteed against agreed brief and quality standards. If it's not right, we fix it.", status: "included", label: "Fully guaranteed" },
    { name: "90-day review with exit rights", desc: "Formal performance review with contractual exit rights if agreed indicators aren't met.", status: "not-included" },
    { name: "Client reference access", desc: "Introduction to a current client at the same tier before you commit.", status: "not-included" },
  ]},
];

const Tier1Content = () => (
  <>
    <ServiceTable sections={T1_SECTIONS} tier="t1" />
    <div className="mt-6 bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "A credible show in market. Your brand sounds like it means it. Your audience starts to notice."
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mt-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Making the case internally:</strong> Six episodes at £19,500 costs less than one month of a mid-level content hire — and produces a permanent asset your brand owns. It ships on a fixed timeline with a proven system you can scale into.</p>
    </div>
  </>
);

/* ── Modal content: Tier 2 ── */
const T2_SECTIONS: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "Define exactly who you're talking to, what they care about, and why your show is relevant to them.", status: "included", label: "Full ICP & buyer mapping" },
    { name: "Podcast concept & positioning", desc: "Shape the format, name, tone and market position of the show so it stands out from day one.", status: "included", label: "Full concept & positioning" },
    { name: "Content pillars & roadmap", desc: "Identify the core themes and topics that will drive consistent engagement across every episode.", status: "included", label: "Full content roadmap" },
    { name: "Multi-channel distribution strategy", desc: "A clear plan for how the show reaches your audience across LinkedIn, YouTube, email and beyond.", status: "included", label: "Multi-channel strategy" },
    { name: "Host sourcing & training", desc: "Identify and prepare the right on-screen talent — internal leadership or external host.", status: "included", label: "Full sourcing & training" },
    { name: "Marketing stack integration", desc: "Connect the podcast into your CRM, email and marketing automation so content feeds the funnel.", status: "included", label: "Full stack integration" },
  ]},
  { section: "Production", rows: [
    { name: "Episode volume", desc: "Fully produced episodes, end-to-end from brief to published.", status: "included", label: "2 per month, ongoing" },
    { name: "Video & audio recording", desc: "High-quality recording with full technical direction — studio or remote.", status: "included", label: "Studio & remote" },
    { name: "Professional editing", desc: "Full post-production for video and audio — paced, polished, broadcast standard.", status: "included", label: "Video + audio" },
    { name: "Publishing & distribution", desc: "Published and optimised across all major podcast platforms — fully managed.", status: "included", label: "All platforms, fully managed" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form social clips", desc: "Platform-optimised video clips cut from each episode to drive reach and engagement.", status: "included", label: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Written content for every clip and post — crafted to stop the scroll and stay on-brand.", status: "included", label: "Full copywriting suite" },
    { name: "Branded thumbnails & visuals", desc: "On-brand visual assets for every episode — thumbnails, cover art and social graphics.", status: "included", label: "Full visual suite" },
    { name: "SEO-optimised show notes", desc: "Long-form written show notes built to rank in search and extend the life of every episode.", status: "included", label: "Full SEO show notes" },
    { name: "Multi-format content repurposing", desc: "Each episode turned into multiple formats — articles, LinkedIn posts, email copy, quote cards.", status: "included", label: "Multi-format repurposing" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media posting & management", desc: "We write and publish content across LinkedIn, YouTube and social on your behalf — every week.", status: "included", label: "Full managed posting" },
    { name: "Newsletter & email distribution", desc: "Episode content distributed through your email list and newsletter.", status: "included", label: "Newsletter integration" },
    { name: "Paid media amplification", desc: "Targeted paid campaigns across LinkedIn, YouTube and Spotify.", status: "not-included" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "Research and identify the right guests — aligned to your ICP and credible to your audience.", status: "included", label: "Ongoing guest pipeline" },
    { name: "Personalised outreach & booking", desc: "Tailored outreach to every guest — no generic booking emails. End-to-end management.", status: "included", label: "Full outreach management" },
    { name: "PR & industry amplification", desc: "Turn key episodes into PR moments — press coverage and third-party amplification.", status: "included", label: "PR amplification" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "Turn hosts, guests and your team into active content contributors around every episode.", status: "not-included" },
    { name: "Creator & influencer partnerships", desc: "Partner with creators to carry your content to new audiences through trusted voices.", status: "not-included" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales content alignment", desc: "Episodes and clips built around the exact challenges and objections your buyers face.", status: "included", label: "Sales content alignment" },
    { name: "Outbound content toolkit", desc: "A library of assets your sales team can use in outreach sequences to warm prospects.", status: "included", label: "Outbound toolkit" },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads and feed your funnel.", status: "not-included" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Regular reporting on audience, engagement, content performance and channel breakdown.", status: "included", label: "Monthly reporting" },
    { name: "Pipeline & revenue attribution", desc: "Track the journey from content impression to pipeline influence.", status: "not-included" },
    { name: "Continuous optimisation", desc: "Ongoing refinement of content, format and distribution based on performance data.", status: "included", label: "Ongoing optimisation" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight treating the podcast as a board-level commercial asset.", status: "not-included" },
    { name: "Senior strategic account management", desc: "A named senior contact who understands your business and the commercial context behind every decision.", status: "included", label: "Dedicated senior contact" },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "All deliverables guaranteed against agreed brief and quality standards. If it's not right, we fix it.", status: "included", label: "Fully guaranteed" },
    { name: "90-day review with exit rights", desc: "Formal performance review with contractual exit rights if agreed indicators aren't met.", status: "included", label: "Included" },
    { name: "Client reference access", desc: "Introduction to a current client at the same tier before you commit.", status: "included", label: "On request" },
  ]},
];

const Tier2Content = () => (
  <>
    <ServiceTable sections={T2_SECTIONS} tier="t2" />
    <div className="mt-6 bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "Your brand stops being invisible between sales cycles. Prospects recognise you before your team ever reaches out."
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mt-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Making the case internally:</strong> A senior content strategist + producer + social manager costs £90–120k in salary alone. This delivers equivalent output — fully coordinated, immediately operational — for £75k, with no recruitment, no onboarding, no management overhead.</p>
    </div>
  </>
);

/* ── Modal content: Tier 3 ── */
const T3_SECTIONS: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "Define exactly who you're talking to, what they care about, and why your show is relevant to them.", status: "included", label: "Deep buyer & account mapping" },
    { name: "Podcast concept & positioning", desc: "Shape the format, name, tone and market position of the show so it stands out from day one.", status: "included", label: "Category-level positioning" },
    { name: "Content pillars & roadmap", desc: "Identify the core themes and topics that will drive consistent engagement across every episode.", status: "included", label: "Category agenda roadmap" },
    { name: "Multi-channel distribution strategy", desc: "A clear plan for how the show reaches your audience across every channel, globally.", status: "included", label: "Global multi-channel strategy" },
    { name: "Host sourcing & training", desc: "Identify and prepare the right on-screen talent — internal leadership or external host.", status: "included", label: "Full sourcing & training" },
    { name: "Marketing stack integration", desc: "Connect the podcast into your CRM, email and marketing automation so content feeds the funnel.", status: "included", label: "Full stack integration" },
  ]},
  { section: "Production", rows: [
    { name: "Episode volume", desc: "Fully produced episodes, end-to-end from brief to published.", status: "included", label: "2 per month, ongoing" },
    { name: "Video & audio recording", desc: "High-quality recording with full technical direction — studio or remote.", status: "included", label: "Studio & remote" },
    { name: "Professional editing", desc: "Full post-production for video and audio — paced, polished, broadcast standard.", status: "included", label: "Video + audio" },
    { name: "Publishing & distribution", desc: "Published and optimised across all major podcast platforms — fully managed.", status: "included", label: "All platforms, fully managed" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form social clips", desc: "Platform-optimised video clips cut from each episode to drive reach and engagement.", status: "included", label: "6–10 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Written content for every clip and post — crafted to stop the scroll and stay on-brand.", status: "included", label: "Full copywriting suite" },
    { name: "Branded thumbnails & visuals", desc: "On-brand visual assets for every episode — thumbnails, cover art and social graphics.", status: "included", label: "Full visual suite" },
    { name: "SEO-optimised show notes", desc: "Long-form written show notes built to rank in search and extend the life of every episode.", status: "included", label: "Full SEO show notes" },
    { name: "Multi-format content repurposing", desc: "Each episode turned into multiple formats — articles, LinkedIn posts, email copy, quote cards.", status: "included", label: "Full repurposing engine" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media posting & management", desc: "We write and publish content across LinkedIn, YouTube and social on your behalf — every week.", status: "included", label: "Full managed posting" },
    { name: "Newsletter & email distribution", desc: "Episode content distributed through your email list and newsletter.", status: "included", label: "Full newsletter integration" },
    { name: "Paid media amplification", desc: "Targeted paid campaigns across LinkedIn, YouTube, Spotify and display — globally scaled.", status: "included", label: "Multi-channel, global scale" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "Research and identify the right guests — aligned to your ICP and your category ownership strategy.", status: "included", label: "Strategic account targeting" },
    { name: "Personalised outreach & booking", desc: "Tailored outreach to every guest — no generic booking emails. End-to-end management.", status: "included", label: "Full outreach management" },
    { name: "PR & industry amplification", desc: "Turn key episodes into PR moments — press coverage, industry citations and third-party amplification.", status: "included", label: "Full PR engine" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "Turn hosts, guests and your team into active content contributors — reactions, insights, commentary around every episode.", status: "included", label: "Full UGC activation" },
    { name: "Creator & influencer partnerships", desc: "Partner with relevant creators and industry voices to carry your content to new audiences through trusted channels.", status: "included", label: "Available as add-on" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales content alignment", desc: "Episodes and clips built around the exact challenges and objections your buyers face.", status: "included", label: "Full sales alignment" },
    { name: "Outbound content toolkit", desc: "A library of assets your sales team can use in outreach sequences to warm prospects at every funnel stage.", status: "included", label: "Full outbound toolkit" },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads and feed your funnel.", status: "included", label: "Full lead capture system" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Regular reporting on audience, engagement, content performance and channel breakdown.", status: "included", label: "Monthly commercial reporting" },
    { name: "Pipeline & revenue attribution", desc: "Track the journey from content impression to pipeline influence — connecting podcast activity to commercial outcomes.", status: "included", label: "Full attribution model" },
    { name: "Continuous optimisation", desc: "Ongoing refinement of content, format and distribution based on performance data.", status: "included", label: "Ongoing optimisation" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight — quarterly planning, treating the podcast as a board-level commercial asset.", status: "included", label: "Quarterly strategy sessions" },
    { name: "Senior strategic account management", desc: "A named senior contact who understands your business and the commercial context behind every decision.", status: "included", label: "Dedicated senior contact" },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "All deliverables guaranteed against agreed brief and quality standards. If it's not right, we fix it.", status: "included", label: "Fully guaranteed" },
    { name: "90-day review with exit rights", desc: "Formal performance review with contractual exit rights if agreed leading indicators aren't met.", status: "included", label: "Included" },
    { name: "Client reference access", desc: "Introduction to a current Tier 3 client before you commit — hear it from someone already in the programme.", status: "included", label: "On request" },
  ]},
];

const Tier3Tabs = () => {
  const [tab, setTab] = useState<"services" | "guarantees">("services");
  return (
    <>
      <div className="flex border-b border-border mb-6">
        {([
          { key: "services" as const, label: "Services included" },
          { key: "guarantees" as const, label: "Guarantees" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-xs font-medium tracking-wide py-3 border-b-2 transition-colors ${tab === t.key ? "text-[#8B83C7] border-[#8B83C7]" : "text-text-tertiary border-transparent hover:text-text-secondary"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "services" && <Tier3Services />}
      {tab === "guarantees" && <Tier3Guarantees />}
    </>
  );
};

const Tier3Services = () => (
  <>
    <ServiceTable sections={T3_SECTIONS} tier="t3" />
    <div className="mt-6 bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "In 18 months, anyone who matters in your market will associate your brand with the conversation — not just a participant in it."
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mt-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Making the case to your CEO:</strong> Category ownership is a moat. At £160k/year all-in, you're not buying marketing. You're buying a defensible market position that's extraordinarily difficult for a competitor to undo.</p>
    </div>
  </>
);

const Tier3AdSpend = () => (
  <>
    <p className="text-sm text-text-secondary leading-relaxed mb-5">The minimum £3k/month is a starting point, not a recommended level. Here's what different budgets actually deliver.</p>
    {[
      { label: "Entry — foundation presence", amount: "£3,000/month", body: <>
        <strong className="text-text-primary">What this buys:</strong> 2–4 active campaigns across LinkedIn. Realistic reach of <strong className="text-text-primary">150,000–300,000 impressions/month</strong> — tightly targeted by job title, seniority and company size. Best for testing what content performs before scaling.
      </> },
      { label: "Growth — consistent market presence", amount: "£5,000–8,000/month", body: <>
        <strong className="text-text-primary">What this buys:</strong> Multi-format campaigns across LinkedIn and YouTube simultaneously. Reach of <strong className="text-text-primary">400,000–700,000 impressions/month</strong>. Retargeting activated — hitting warm audiences who have already engaged. Most clients move here within 3–6 months.
      </> },
      { label: "Scale — category saturation", amount: "£10,000+/month", body: <>
        <strong className="text-text-primary">What this buys:</strong> Aggressive multi-channel distribution across LinkedIn, YouTube, Spotify and display. <strong className="text-text-primary">1M+ impressions/month</strong> within a tightly defined audience. Your brand becomes genuinely unavoidable for anyone in your target market.
      </> },
    ].map((sc) => (
      <div key={sc.label} className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="flex justify-between items-center bg-secondary/40 px-4 py-2.5">
          <span className="text-[13px] font-medium text-text-primary">{sc.label}</span>
          <span className="font-heading text-base" style={{ color: C.plum }}>{sc.amount}</span>
        </div>
        <div className="px-4 py-3 text-[13px] text-text-secondary leading-relaxed border-t border-border">{sc.body}</div>
      </div>
    ))}
    <p className="text-[13px] font-medium text-text-primary mt-5 mb-3">How we report on ad spend</p>
    {[
      { label: "Reach within target accounts", desc: "Are you hitting the companies you want to work with — or accumulating views from people who will never buy?" },
      { label: "Engagement by content type", desc: "Which clips generate saves, shares and comments — not just passive plays." },
      { label: "Warm signal tracking", desc: "Profile visits, connection requests and DM responses that correlate with campaign exposure." },
      { label: "Pipeline influence", desc: "Did conversations or deals involve someone exposed to your content? Tracked and reported honestly." },
      { label: "Cost per meaningful engagement", desc: "Not cost-per-click. Cost per action that signals real commercial intent." },
    ].map((r) => (
      <div key={r.label} className="flex gap-3 py-2.5 border-b border-border last:border-b-0">
        <span className="text-xs font-medium text-text-primary min-w-[150px] shrink-0">{r.label}</span>
        <span className="text-xs text-text-secondary leading-relaxed">{r.desc}</span>
      </div>
    ))}
  </>
);

const Tier3Guarantees = () => (
  <>
    <p className="text-sm text-text-secondary leading-relaxed mb-5">Any agency promising specific pipeline numbers is telling you what you want to hear. Here's what we commit to in writing — and what we won't, and why.</p>
    <div className="rounded-xl overflow-hidden border border-[#7BAF8E]/20 mb-5">
      <div className="px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase" style={{ background: C.greenBg, color: C.greenDk }}>What we commit to in writing</div>
      <ul className="divide-y divide-[#7BAF8E]/10">
        {[
          "All production deliverables — episodes, clips, show notes — delivered on schedule to agreed quality standards",
          "All guests meet seniority and ICP criteria defined at onboarding — you have approval rights",
          "Monthly reporting on a fixed date — commercial metrics, not vanity numbers",
          "Senior point of contact accessible within 24 hours, always",
          "Quarterly strategy sessions in the diary before the quarter begins",
          "Transparent reporting — including what is not working, not just what is",
        ].map((item) => (
          <li key={item} className="px-4 py-2.5 text-sm text-text-secondary flex gap-2.5 leading-relaxed">
            <span className="text-[#7BAF8E] text-xs font-bold shrink-0 mt-0.5">✓</span>{item}
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded-xl overflow-hidden border border-border mb-5">
      <div className="px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary bg-secondary/60">What we won't guarantee — and why you should be suspicious of anyone who does</div>
      <ul className="divide-y divide-border">
        {[
          "Specific impression volumes — LinkedIn CPMs shift with targeting and algorithm changes. Anyone guaranteeing a number hasn't run these campaigns recently.",
          "Pipeline numbers — your offer, your sales team, your market timing, and a dozen variables outside content all play a role.",
        ].map((item) => (
          <li key={item} className="px-4 py-2.5 text-sm text-text-secondary flex gap-2.5 leading-relaxed">
            <span className="text-text-tertiary text-xs shrink-0 mt-0.5">✕</span>{item}
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mb-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">90-day performance review with exit rights.</strong> At 90 days we review agreed leading indicators together. If we're not hitting the bar we set, you have the right to exit with 30 days notice. We're confident enough to back that in writing.</p>
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mb-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Before you sign, ask us for references.</strong> A conversation with a current Tier 3 client tells you more than any contract clause. We'll arrange it.</p>
    </div>
    <div className="bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "We're not the right partner for every business. If we don't think this will work for you, we'll say so before you commit."
    </div>
  </>
);

/* ── Compare table data ── */
type CompareRow = { name: string; desc: string; t3: string | null; t2: string | null; t1: string | null };
type CompareSection = { section: string; rows: CompareRow[] };

const compareSections: CompareSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "Define who you're talking to, what they care about, and why your show is relevant.", t3: "Deep buyer & account mapping", t2: "Full ICP & buyer mapping", t1: "ICP definition" },
    { name: "Podcast concept & positioning", desc: "Shape the format, name, tone and market position of the show.", t3: "Category-level positioning", t2: "Full concept & positioning", t1: "Concept & positioning" },
    { name: "Content pillars & roadmap", desc: "Identify core themes and topics that will drive consistent engagement.", t3: "Category agenda roadmap", t2: "Full content roadmap", t1: "Core content pillars" },
    { name: "Multi-channel distribution strategy", desc: "How and where the show reaches your audience across all channels.", t3: "Global multi-channel strategy", t2: "Multi-channel strategy", t1: "Distribution plan" },
    { name: "Host sourcing & training", desc: "Identify and prepare the right on-screen talent.", t3: "Full sourcing & training", t2: "Full sourcing & training", t1: null },
    { name: "Marketing stack integration", desc: "Connect podcast into CRM, email and marketing automation.", t3: "Full stack integration", t2: "Full stack integration", t1: null },
  ]},
  { section: "Production", rows: [
    { name: "Episode volume", desc: "Fully produced episodes per period.", t3: "2 per month, ongoing", t2: "2 per month, ongoing", t1: "6 episodes total" },
    { name: "Video & audio recording", desc: "High-quality recording — studio or remote.", t3: "Studio & remote", t2: "Studio & remote", t1: "Studio & remote" },
    { name: "Professional editing", desc: "Full post-production — video and audio, broadcast standard.", t3: "Video + audio", t2: "Video + audio", t1: "Video + audio" },
    { name: "Publishing & distribution", desc: "Published across all major podcast platforms.", t3: "All platforms, fully managed", t2: "All platforms, fully managed", t1: "All platforms" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form social clips", desc: "Platform-optimised clips from each episode.", t3: "6–10 clips per episode", t2: "4–6 clips per episode", t1: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Written content for every clip and post.", t3: "Full copywriting suite", t2: "Full copywriting suite", t1: "Captions per episode" },
    { name: "Branded thumbnails & visuals", desc: "On-brand visual assets for every episode.", t3: "Full visual suite", t2: "Full visual suite", t1: "Thumbnails & cover art" },
    { name: "SEO-optimised show notes", desc: "Long-form show notes built to rank in search.", t3: "Full SEO show notes", t2: "Full SEO show notes", t1: "SEO show notes" },
    { name: "Multi-format content repurposing", desc: "Each episode turned into articles, posts, email copy and more.", t3: "Full repurposing engine", t2: "Multi-format repurposing", t1: null },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media posting & management", desc: "We write and publish content across all social channels on your behalf.", t3: "Full managed posting", t2: "Full managed posting", t1: null },
    { name: "Newsletter & email distribution", desc: "Episode content through your email list and newsletter.", t3: "Full newsletter integration", t2: "Newsletter integration", t1: null },
    { name: "Paid media amplification", desc: "Targeted paid campaigns across LinkedIn, YouTube, Spotify and display.", t3: "Multi-channel, global scale", t2: null, t1: null },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "Research and identify the right guests aligned to your ICP.", t3: "Strategic account targeting", t2: "Ongoing guest pipeline", t1: "Launch guest targeting" },
    { name: "Personalised outreach & booking", desc: "Tailored outreach — no generic booking emails. End-to-end management.", t3: "Full outreach management", t2: "Full outreach management", t1: "Outreach & booking" },
    { name: "PR & industry amplification", desc: "Turn key episodes into PR moments — press coverage and third-party amplification.", t3: "Full PR engine", t2: "PR amplification", t1: null },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "Turn hosts, guests and your team into active content contributors.", t3: "Full UGC activation", t2: null, t1: null },
    { name: "Creator & influencer partnerships", desc: "Partner with creators to carry your content to new audiences through trusted voices.", t3: "Available as add-on", t2: null, t1: null },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales content alignment", desc: "Episodes and clips built around the exact challenges your buyers face.", t3: "Full sales alignment", t2: "Sales content alignment", t1: null },
    { name: "Outbound content toolkit", desc: "Assets your sales team can use in outreach sequences to warm prospects.", t3: "Full outbound toolkit", t2: "Outbound toolkit", t1: null },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads.", t3: "Full lead capture system", t2: null, t1: null },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "Regular reporting on audience, engagement and content performance.", t3: "Monthly commercial reporting", t2: "Monthly reporting", t1: "End-of-pilot report" },
    { name: "Pipeline & revenue attribution", desc: "Connect podcast activity to commercial outcomes and pipeline influence.", t3: "Full attribution model", t2: null, t1: null },
    { name: "Continuous optimisation", desc: "Ongoing refinement of content, format and distribution based on data.", t3: "Ongoing", t2: "Ongoing", t1: null },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight at board level — quarterly planning sessions.", t3: "Quarterly strategy sessions", t2: null, t1: null },
    { name: "Senior strategic account management", desc: "A named senior contact who understands your business and commercial context.", t3: "Dedicated senior contact", t2: "Dedicated senior contact", t1: null },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "All deliverables guaranteed against agreed standards. If it's not right, we fix it.", t3: "Fully guaranteed", t2: "Fully guaranteed", t1: "Fully guaranteed" },
    { name: "90-day review with exit rights", desc: "Formal review with contractual exit rights if agreed indicators aren't met.", t3: "Included", t2: "Included", t1: null },
    { name: "Client reference access", desc: "Introduction to a current client at the same tier before you commit.", t3: "On request", t2: "On request", t1: null },
  ]},
];

const CompareCell = ({ value }: { value: string | null }) =>
  value ? (
    <div className="flex items-start gap-1.5">
      <span className="w-[16px] h-[16px] rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5 bg-primary/15 text-primary">✓</span>
      <span className="text-[11px] leading-snug text-primary font-medium">{value}</span>
    </div>
  ) : (
    <span className="text-[10px] text-text-tertiary/50">Not included</span>
  );

const CompareTable = ({ currency }: { currency: Currency }) => (
  <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
    <table className="w-full border-collapse min-w-[700px]">
      <thead>
        <tr>
          <th className="text-left px-4 py-3 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary border-b border-border w-[30%]">Service</th>
          <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
            <div className="text-[11px] font-medium text-text-primary">Category Engine</div>
            <div className="text-[10px] text-text-tertiary">{convertPrice(125000, currency)}/yr + ad spend</div>
            <span className="inline-block mt-1 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-full" style={{ background: "#f0eaf8", color: "#4e2d7a" }}>Tier 03</span>
          </th>
          <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
            <div className="text-[11px] font-medium text-text-primary">Launch & Scale</div>
            <div className="text-[10px] text-text-tertiary">{convertPrice(75000, currency)}/yr</div>
            <span className="inline-block mt-1 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-full" style={{ background: "#eaeffa", color: "#1649a0" }}>Tier 02</span>
          </th>
          <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
            <div className="text-[11px] font-medium text-text-primary">Launch</div>
            <div className="text-[10px] text-text-tertiary">{convertPrice(19500, currency)} one-time</div>
            <span className="inline-block mt-1 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-full" style={{ background: "#e8f4f1", color: "#0a6b5c" }}>Tier 01</span>
          </th>
        </tr>
      </thead>
      {compareSections.map((sec) => (
        <tbody key={sec.section}>
          <tr><td colSpan={4} className="bg-secondary/40 px-4 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary border-y border-border">{sec.section}</td></tr>
          {sec.rows.map((row) => (
            <tr key={row.name} className="group hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 border-b border-border align-top">
                <div className="text-[12px] font-medium text-text-primary mb-0.5">{row.name}</div>
                <div className="text-[10px] text-text-tertiary leading-snug">{row.desc}</div>
              </td>
              <td className="px-3 py-3 border-b border-border align-top"><CompareCell value={row.t3} /></td>
              <td className="px-3 py-3 border-b border-border align-top"><CompareCell value={row.t2} /></td>
              <td className="px-3 py-3 border-b border-border align-top"><CompareCell value={row.t1} /></td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  </div>
);

/* ── Compare modal ── */
const CompareModal = ({ open, onClose, currency = "GBP" }: { open: boolean; onClose: () => void; currency?: Currency }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[900px] my-auto rounded-2xl border border-border overflow-hidden bg-card"
        >
          <ModalHeader accentColor="#6A9FA3">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-secondary">
              <X className="w-4 h-4" />
            </button>
            <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">All tiers</div>
            <h3 className="font-heading text-2xl text-text-primary mb-2">Side by side comparison</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Every service across all three tiers. What's included, at what level, and what changes as you scale.</p>
          </ModalHeader>
          <div className="p-6 sm:p-8"><CompareTable currency={currency} /></div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Animated modal header ── */
const ModalHeader = ({ children, accentColor = "#6A9FA3" }: { children: React.ReactNode; accentColor?: string }) => (
  <div className="relative overflow-hidden border-b border-border">
    {/* Gradient top edge */}
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, #8B83C7, #C484C9, transparent)` }} />

    {/* Floating blur blobs */}
    <motion.div
      animate={{ x: [0, 30, -20, 0], y: [0, -15, 10, 0], scale: [1, 1.2, 0.9, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
      style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
    />
    <motion.div
      animate={{ x: [0, -20, 15, 0], y: [0, 10, -10, 0], scale: [1, 0.85, 1.15, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full pointer-events-none"
      style={{ background: "#8B83C7", opacity: 0.07, filter: "blur(50px)" }}
    />
    <motion.div
      animate={{ x: [0, 15, -10, 0], y: [0, -8, 12, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 rounded-full pointer-events-none"
      style={{ background: "#C484C9", opacity: 0.05, filter: "blur(50px)" }}
    />

    {/* Shimmer sweep */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
      />
    </div>

    {/* Subtle grid texture */}
    <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.02) 39px,rgba(255,255,255,0.02) 40px)" }} />

    <div className="relative p-6 sm:p-8 pb-5">{children}</div>
  </div>
);

/* ── Modal wrapper ── */
const tierAccent: Record<string, string> = { t1: "#6A9FA3", t2: "#7BAF8E", t3: "#8B83C7" };

const TierModal = ({ open, onClose, tier, children }: { open: boolean; onClose: () => void; tier: { id: string; num: string; name: string; modalTitle?: string; modalPitch?: string; hook: string; price: string; priceNote: string; modalDopamine?: string } | null; children: React.ReactNode }) => (
  <AnimatePresence>
    {open && tier && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[620px] my-auto rounded-2xl border border-border overflow-hidden bg-card"
        >
          <ModalHeader accentColor={tierAccent[tier.id] || "#6A9FA3"}>
            <button onClick={onClose} className="absolute top-4 right-4 z-10 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-secondary">
              <X className="w-4 h-4" />
            </button>
            <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">{tier.num}</div>
            <h3 className="font-heading text-2xl text-text-primary mb-2">{tier.modalTitle || tier.name.split("\n")[0]}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{tier.modalPitch || tier.hook}</p>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl text-text-primary">{tier.price}</span>
              <span className="text-xs text-text-tertiary">{tier.priceNote}</span>
            </div>
            {tier.modalDopamine && (
              <div className="mt-4 p-3 rounded-lg bg-white/[0.06] font-heading text-sm italic text-text-secondary leading-relaxed">
                "{tier.modalDopamine}"
              </div>
            )}
          </ModalHeader>
          {/* body */}
          <div className="p-6 sm:p-8">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);


/* ── Paid Media Slider ── */
const MEDIA_STEPS = [
  { spend: 3000,  impressions: "150k–300k",  impNum: 225,   label: "Foundation presence" },
  { spend: 5000,  impressions: "400k–500k",  impNum: 450,   label: "Early growth" },
  { spend: 8000,  impressions: "600k–700k",  impNum: 650,   label: "Consistent presence" },
  { spend: 10000, impressions: "800k–1M",    impNum: 900,   label: "Market saturation" },
  { spend: 15000, impressions: "1.2M–1.5M",  impNum: 1350,  label: "Category dominance" },
  { spend: 25000, impressions: "2M–3M",      impNum: 2500,  label: "Full-scale engine" },
  { spend: 50000, impressions: "5M+",        impNum: 5000,  label: "Market ownership" },
];

const STEP_COLORS = [
  { bar: "#6359EA", glow: "rgba(99,89,234,0.3)", accent: "#6359EA" },
  { bar: "#7B6BF0", glow: "rgba(123,107,240,0.35)", accent: "#7B6BF0" },
  { bar: "#8B83C7", glow: "rgba(139,131,199,0.35)", accent: "#8B83C7" },
  { bar: "#40ABB2", glow: "rgba(64,171,178,0.4)", accent: "#40ABB2" },
  { bar: "#1CFA76", glow: "rgba(28,250,118,0.35)", accent: "#1CFA76" },
  { bar: "#FFB347", glow: "rgba(255,179,71,0.4)", accent: "#FFB347" },
  { bar: "#FF6B6B", glow: "rgba(255,107,107,0.45)", accent: "#FF6B6B" },
];

const maxImp = MEDIA_STEPS[MEDIA_STEPS.length - 1].impNum;

/* Animated particles that float up from active bars */
const BarParticles = memo(({ active, color }: { active: boolean; color: string }) => {
  if (!active) return null;
  return (
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: color, left: `${30 + i * 20}%` }}
          animate={{
            y: [-4, -20 - i * 6],
            opacity: [0.8, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: 1.2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
});

const PaidMediaSlider = ({ currency }: { currency: Currency }) => {
  const [step, setStep] = useState(0);
  const current = MEDIA_STEPS[step];
  const pct = (step / (MEDIA_STEPS.length - 1)) * 100;
  const activeColor = STEP_COLORS[step];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-border overflow-hidden relative"
      style={{ background: "#111113" }}
    >
      {/* Animated background glow that shifts with the slider */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 60% 50% at ${30 + pct * 0.4}% 70%, ${activeColor.glow}, transparent 70%)`,
        }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0" style={{ background: C.plumBg, color: C.plum }}>Category Engine</span>
        </div>
        <h3 className="font-heading text-xl text-text-primary mb-1">Paid Media Investment</h3>
        <p className="text-sm text-text-secondary mb-6">Drag to explore how ad spend scales impressions within your target ICP.</p>

        {/* ── Animated bar chart ── */}
        <div className="flex items-end gap-2 h-44 sm:h-56 mb-6 px-1">
          {MEDIA_STEPS.map((s, i) => {
            const isActive = i <= step;
            const isCurrent = i === step;
            const barHeight = (s.impNum / maxImp) * 100;
            const barColor = STEP_COLORS[i];

            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="relative flex-1 flex flex-col items-center justify-end h-full group"
              >


                {/* Bar */}
                <motion.div
                  className="w-full rounded-t-md relative overflow-hidden"
                  animate={{
                    height: `${barHeight}%`,
                    opacity: isActive ? 1 : 0.2,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    background: isActive
                      ? `linear-gradient(180deg, ${barColor.bar}, ${barColor.bar}88)`
                      : "rgba(255,255,255,0.06)",
                    boxShadow: isCurrent ? `0 0 20px ${barColor.glow}, 0 0 40px ${barColor.glow}` : "none",
                  }}
                >
                  {/* Shimmer on current bar */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.3), transparent)` }}
                    />
                  )}
                </motion.div>

                {/* Spend label under bar */}
                <div className={`mt-2 text-[8px] sm:text-[9px] font-medium transition-colors ${isCurrent ? "text-text-primary" : "text-text-tertiary/50"}`}>
                  {convertPrice(s.spend, currency).replace(",000", "k").replace(",500", ".5k")}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="rounded-xl border p-5 relative overflow-hidden"
            animate={{
              borderColor: `${activeColor.bar}33`,
              boxShadow: `inset 0 0 30px ${activeColor.glow.replace(")", ",0.08)")}`,
            }}
            transition={{ duration: 0.4 }}
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Monthly spend</div>
            <motion.div
              key={current.spend}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-2xl sm:text-3xl text-text-primary"
            >
              {convertPrice(current.spend, currency)}
            </motion.div>
            <div className="text-xs text-text-tertiary mt-1">/month</div>
          </motion.div>
          <motion.div
            className="rounded-xl border p-5 relative overflow-hidden"
            animate={{
              borderColor: `${activeColor.bar}33`,
              boxShadow: `inset 0 0 30px ${activeColor.glow.replace(")", ",0.08)")}`,
            }}
            transition={{ duration: 0.4 }}
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Estimated impressions</div>
            <motion.div
              key={current.impressions}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-2xl sm:text-3xl"
              style={{ color: activeColor.bar }}
            >
              {current.impressions}
            </motion.div>
            <div className="text-xs text-text-tertiary mt-1">/month within your ICP</div>
          </motion.div>
        </div>

        {/* ── Label + Slider ── */}
        <div className="flex justify-between items-center mb-3">
          <motion.span
            key={current.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium"
            style={{ color: activeColor.bar }}
          >
            {current.label}
          </motion.span>
          <span className="text-[10px] text-text-tertiary">{convertPrice(3000, currency)} – {convertPrice(50000, currency)}/mo</span>
        </div>

        <div className="relative h-2.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #6359EA, ${activeColor.bar})`,
              boxShadow: `0 0 12px ${activeColor.glow}`,
            }}
            transition={{ duration: 0.3 }}
          />
          <input
            type="range"
            min={0}
            max={MEDIA_STEPS.length - 1}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white pointer-events-none"
            animate={{
              left: `calc(${pct}% - 12px)`,
              background: activeColor.bar,
              boxShadow: `0 0 16px ${activeColor.glow}, 0 0 32px ${activeColor.glow}`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════ */

const PricingTiers = () => {
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
    return () => { meta.remove(); };
  }, []);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("GBP");

  const tiers = useMemo(() => baseTiers.map(t => ({
    ...t,
    price: `${convertPrice(t.basePrice, currency)}${t.priceSuffix}`,
    priceNote: t.basePriceNote(currency),
  })), [currency]);

  const addonPrice = useMemo(() => {
    const lo = convertPrice(2000, currency);
    const hi = convertPrice(10000, currency);
    return { full: `${lo}–${hi}+`, short: `${lo.replace(/,/g, '').length > 5 ? lo : lo}–${hi.replace(/,/g, '').length > 5 ? hi : hi}+` };
  }, [currency]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-foreground">
      <Navbar />

      {/* ── HERO ── */}
      <header className="relative bg-card overflow-hidden pt-24 md:pt-32 pb-36 md:pb-44 px-6 rounded-b-[40px] md:rounded-b-[60px]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px)" }} />
        <div className="blob-green absolute -top-40 -right-40 w-[500px] h-[500px]" />
        <div className="blob-blue absolute -bottom-32 -left-32 w-[400px] h-[400px]" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="mb-6 mt-6 flex justify-center">
            <SectionPill>Podcast partnership tiers</SectionPill>
          </div>
          <h1 className="text-3xl md:text-6xl lg:text-7xl mb-6">
            Your show.<br />
            <span className="bg-gradient-to-r from-[#6A9FA3] via-[#8B83C7] to-[#C484C9] bg-clip-text text-transparent">Your market.</span><br />
            Owned by you.
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Three ways to work together — from establishing authority to driving pipeline. Choose the level that matches where you want to go.
          </p>
        </div>
      </header>

      {/* ── TIER CARDS ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-10 -mt-20 md:-mt-24 relative z-10">
        <div className="flex justify-center mb-6">
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setActiveModal(tier.id)}
              className={`cursor-pointer p-6 sm:p-8 flex flex-col transition-colors duration-200 ${tier.featured ? "bg-background hover:bg-[#0d0d0d]" : "bg-card hover:bg-card/80"}`}
            >
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-5 flex items-center gap-2">
                {tier.num}
                {tier.popular && (
                  <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-[#7BAF8E] text-black font-medium">
                    <Sparkles className="w-2.5 h-2.5" /> Most popular
                  </span>
                )}
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-text-primary mb-3 whitespace-pre-line leading-tight">{tier.name}</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">{tier.hook}</p>
              <hr className="border-border mb-5" />
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Investment</div>
              <div className="font-heading text-2xl sm:text-3xl text-text-primary mb-1">{tier.price}</div>
              <div className="text-xs text-text-tertiary mb-5">{tier.priceNote}</div>
              <div className="text-xs leading-relaxed p-3 rounded-lg border-l-2 mb-5" style={{ borderColor: C.sage, background: "rgba(123,175,142,0.08)", color: C.sage }}>
                {tier.dopamine}
              </div>
              <button className="w-full text-xs font-medium tracking-wide py-2.5 px-4 rounded-lg border border-border text-text-primary hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
                See what's included <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── COMPARE STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setActiveModal("compare")}
          className="cursor-pointer border border-border border-t-0 rounded-b-2xl bg-card hover:bg-card/80 transition-colors p-5 flex items-center gap-5"
        >
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0 bg-secondary text-text-secondary">All tiers</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary">Compare all three tiers</div>
            <div className="text-xs text-text-tertiary">Every service, side by side. See exactly what changes as you scale.</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-tertiary shrink-0" />
        </motion.div>

        {/* ── PAID MEDIA SLIDER ── */}
        <PaidMediaSlider currency={currency} />

        {/* ── FOOTER NOTE ── */}
        <div className="text-center py-12 md:py-16">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Not sure which tier fits?</strong> Start with Tier 1. It's designed to give you proof of concept — and make the decision for Tier 2 obvious.
          </p>
        </div>
      </main>

      {/* ── MODALS ── */}
      <TierModal open={activeModal === "t1"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t1")!}>
        <Tier1Content />
      </TierModal>
      <TierModal open={activeModal === "t2"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t2")!}>
        <Tier2Content />
      </TierModal>
      <TierModal open={activeModal === "t3"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t3")!}>
        <Tier3Tabs />
      </TierModal>
      <AddOnModal open={activeModal === "addon"} onClose={() => setActiveModal(null)} currency={currency} />

      <Footer />
    </div>
  );
};

export default PricingTiers;

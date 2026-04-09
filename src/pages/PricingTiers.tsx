import { useEffect, useState, useMemo, memo } from "react";

/* ── currency & production types ── */
type Currency = "GBP" | "USD" | "EUR";
type ProdType = "location" | "virtual";
const CURRENCY_SYMBOLS: Record<Currency, string> = { GBP: "£", USD: "$", EUR: "€" };

type PriceSet = { price: string; note: string; dp: string; dn: string };
type TierPrices = { t1: PriceSet; t2: PriceSet; t3: PriceSet };

const ALL_PRICES: Record<string, Record<ProdType, TierPrices>> = {
  GBP: {
    location: {
      t1: { price: "£19,500", note: "One-time fee · 6 episodes · blueprint included", dp: "£19,500", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "£75,000/yr", note: "£15,000 launch strategy + £5,000/month · 2 episodes/month", dp: "£75,000/yr", dn: "£15,000 launch strategy + £5,000/month" },
      t3: { price: "£127,000/yr", note: "£25,000 launch strategy + £8,500/month · + ad spend (min £3k/month)", dp: "£127,000/yr", dn: "£25,000 launch strategy + £8,500/month" },
    },
    virtual: {
      t1: { price: "£14,000", note: "One-time fee · 6 episodes · blueprint included", dp: "£14,000", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "£52,000/yr", note: "£10,000 launch strategy + £3,500/month · 2 episodes/month", dp: "£52,000/yr", dn: "£10,000 launch strategy + £3,500/month" },
      t3: { price: "£89,000/yr", note: "£17,000 launch strategy + £6,000/month · + ad spend (min £3k/month)", dp: "£89,000/yr", dn: "£17,000 launch strategy + £6,000/month" },
    },
  },
  EUR: {
    location: {
      t1: { price: "€22,500", note: "One-time fee · 6 episodes · blueprint included", dp: "€22,500", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "€86,000/yr", note: "€17,000 launch strategy + €5,750/month · 2 episodes/month", dp: "€86,000/yr", dn: "€17,000 launch strategy + €5,750/month" },
      t3: { price: "€146,000/yr", note: "€29,000 launch strategy + €9,750/month · + ad spend (min €3,500/month)", dp: "€146,000/yr", dn: "€29,000 launch strategy + €9,750/month" },
    },
    virtual: {
      t1: { price: "€16,000", note: "One-time fee · 6 episodes · blueprint included", dp: "€16,000", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "€60,000/yr", note: "€11,500 launch strategy + €4,000/month · 2 episodes/month", dp: "€60,000/yr", dn: "€11,500 launch strategy + €4,000/month" },
      t3: { price: "€102,000/yr", note: "€19,500 launch strategy + €6,875/month · + ad spend (min €3,500/month)", dp: "€102,000/yr", dn: "€19,500 launch strategy + €6,875/month" },
    },
  },
  USD: {
    location: {
      t1: { price: "$26,500", note: "One-time fee · 6 episodes · blueprint included", dp: "$26,500", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "$101,000/yr", note: "$20,000 launch strategy + $6,750/month · 2 episodes/month", dp: "$101,000/yr", dn: "$20,000 launch strategy + $6,750/month" },
      t3: { price: "$172,000/yr", note: "$34,000 launch strategy + $11,500/month · + ad spend (min $4,000/month)", dp: "$172,000/yr", dn: "$34,000 launch strategy + $11,500/month" },
    },
    virtual: {
      t1: { price: "$19,000", note: "One-time fee · 6 episodes · blueprint included", dp: "$19,000", dn: "One-time · 6 episodes · blueprint included" },
      t2: { price: "$70,000/yr", note: "$13,500 launch strategy + $4,750/month · 2 episodes/month", dp: "$70,000/yr", dn: "$13,500 launch strategy + $4,750/month" },
      t3: { price: "$120,000/yr", note: "$23,000 launch strategy + $8,000/month · + ad spend (min $4,000/month)", dp: "$120,000/yr", dn: "$23,000 launch strategy + $8,000/month" },
    },
  },
};

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";

/* ── palette tokens ── */
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

/* ── Service table types ── */
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

/* ── tier card data ── */
const tierCards = [
  {
    id: "t3" as const,
    num: "Tier 03 · Global Leader",
    name: "Own the conversation\nyour market is\nalready having.",
    hook: "We build the platform for your brand to lead the defining conversation in your category — across every channel, in every market, at a scale that turns early commitment into a position your competitors can't recover from.",
    modalPitch: "Everything included in Tier 3 — every service, at what level, and what it delivers commercially.",
    modalTitle: "Full service breakdown",
    dopamine: "The brands that own their category conversation today will be impossible to displace tomorrow.",
    modalDopamine: "The brands that own their category conversation today will be impossible to displace tomorrow.",
    featured: false,
  },
  {
    id: "t2" as const,
    num: "Tier 02 · Launch & Scale",
    name: "Your brand,\nin front of your\nbuyer. Every month.",
    hook: "A fully managed content engine that puts you in front of the right people — consistently, professionally, without your team lifting a finger.",
    modalPitch: "Everything included in Tier 2 — what each service covers and what it delivers for your business.",
    modalTitle: "Full service breakdown",
    dopamine: "The equivalent of a senior content hire — without the salary, overhead, or learning curve.",
    modalDopamine: "The equivalent of a senior content hire — without the salary, overhead, or learning curve.",
    featured: true,
    popular: true,
  },
  {
    id: "t1" as const,
    num: "Tier 01 · Launch",
    name: "A show your\nmarket notices.",
    hook: "A polished, credible podcast built from the ground up — with the strategy, production and content to establish real authority in your space.",
    modalPitch: "Everything included in Tier 1 — what each service covers and what it delivers for your business.",
    modalTitle: "Full service breakdown",
    dopamine: "The most powerful way to experience what a branded podcast can do for your business.",
    featured: false,
  },
];

/* ── Currency toggle ── */
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

/* ── Production type toggle ── */
const ProductionToggle = ({ value, onChange }: { value: ProdType; onChange: (p: ProdType) => void }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 border border-border rounded-2xl overflow-hidden bg-card">
    <button
      onClick={() => onChange("location")}
      className={`text-left p-5 transition-colors border-b sm:border-b-0 sm:border-r border-border ${value === "location" ? "bg-background" : ""}`}
    >
      <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary block mb-1">Production type</span>
      <span className={`font-heading text-lg block mb-1 ${value === "location" ? "text-text-primary" : "text-text-secondary"}`}>On Location</span>
      <span className="text-xs text-text-tertiary leading-relaxed block">Studios, hotels & homes. Our producers on the ground — full creative direction, all equipment included. Available across UK, EMEA and US.</span>
    </button>
    <button
      onClick={() => onChange("virtual")}
      className={`text-left p-5 transition-colors ${value === "virtual" ? "bg-background" : ""}`}
    >
      <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary block mb-1">Production type</span>
      <span className={`font-heading text-lg block mb-1 ${value === "virtual" ? "text-text-primary" : "text-text-secondary"}`}>Virtual</span>
      <span className="text-xs text-text-tertiary leading-relaxed block">Recorded online. We advise on camera, microphone and lighting setup to get the best possible talking-heads content from wherever your guest is.</span>
      <span className="inline-block mt-2 text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: "rgba(123,175,142,0.15)", color: C.sage }}>Save ~30%</span>
    </button>
  </div>
);

/* ── Modal content: Tier 1 ── */
const T1_SECTIONS: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "Who are you making this for? We define your ideal listener, their role, their world — so every episode is built for the person most likely to become a client.", status: "included", label: "Core ICP definition" },
    { name: "Podcast concept & positioning", desc: "What is the show about and why should anyone care? We shape the name, format, tone and angle so it has a clear reason to exist in a crowded market.", status: "included", label: "Full concept, name, format and market positioning" },
    { name: "Content pillars & episode roadmap", desc: "What will you talk about and in what order? We map out the themes, topics and episode arc so the show builds authority deliberately.", status: "included", label: "Core content pillars and launch episode themes" },
    { name: "Distribution strategy", desc: "A show no-one hears is just expensive audio. We plan exactly where and how your episodes reach the right people at launch.", status: "included", label: "Distribution plan for launch across podcast platforms and social" },
    { name: "Host sourcing & coaching", desc: "The host makes or breaks a podcast. We find the right person and coach them to sound natural, confident and authoritative on mic.", status: "not-included" },
    { name: "Marketing stack integration", desc: "We connect the podcast into your CRM, email platform and marketing automation — so listeners become leads automatically.", status: "not-included" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Consistency is what builds an audience — we make sure it never slips.", status: "included", label: "6 episodes — a complete first series" },
    { name: "Recording — video & audio", desc: "A guest who sounds like they're in the room with you, not on a call. We set up every recording for success.", status: "included", label: "Studio or remote — full technical direction included" },
    { name: "Editing & post-production", desc: "Good editing is invisible. Great editing makes 45 minutes feel like 15. This is where the craft lives.", status: "included", label: "Full video and audio post-production" },
    { name: "Publishing & platform management", desc: "We handle publishing across Spotify, Apple Podcasts, YouTube and every major platform with optimised metadata so the show is findable from day one.", status: "included", label: "All platforms, fully managed" },
    { name: "PodPlanner", desc: "Access to our proprietary production software, designed to streamline production and ideas across your team. Everyone stays aligned, nothing gets lost.", status: "included", label: "Included" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form video clips", desc: "The moments that make someone stop scrolling and share. Cut and formatted for LinkedIn, Instagram and YouTube Shorts.", status: "included", label: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Every clip needs a reason to be watched. We write the hooks and captions that earn the click.", status: "included", label: "Captions for every clip" },
    { name: "Thumbnails & visual assets", desc: "The thumbnail is the first thing a new listener sees. We design episode artwork that looks like a show worth taking seriously.", status: "included", label: "Episode thumbnails and cover art" },
    { name: "Show notes & SEO", desc: "Every episode gets a long-form written companion built to rank in Google. Good show notes compound in value over time.", status: "included", label: "Long-form show notes with SEO optimisation" },
    { name: "Content repurposing", desc: "One episode becomes many assets — LinkedIn posts, articles, email copy and quote cards.", status: "not-included" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "We write, schedule and publish across LinkedIn, YouTube and social on your behalf.", status: "not-included" },
    { name: "Email & newsletter distribution", desc: "Episode content distributed through your email list and newsletter.", status: "not-included" },
    { name: "Paid media", desc: "Targeted paid campaigns across LinkedIn, YouTube and Spotify.", status: "not-included" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "The guest list is your editorial strategy. We research and identify guests who are credible to your audience and aligned to your content goals.", status: "included", label: "Guest targeting for your launch series" },
    { name: "Guest outreach & booking", desc: "We handle every touch from first contact to confirmed recording slot. No generic Calendly links. No copy-paste templates.", status: "included", label: "End-to-end outreach and booking management" },
    { name: "PR & press amplification", desc: "Turn key episodes into PR moments — press coverage and third-party amplification.", status: "not-included" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "Turn your hosts, guests and team into active content contributors around every episode.", status: "not-included" },
    { name: "Creator & influencer partnerships", desc: "Partner with creators to carry your content to new audiences through trusted voices.", status: "not-included" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "Episode topics planned around the questions and objections your buyers raise in sales conversations.", status: "not-included" },
    { name: "Sales team content toolkit", desc: "A curated library of clips and written assets your sales team can drop into outreach sequences.", status: "not-included" },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads and feed your funnel.", status: "not-included" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "We report on what actually matters — not just downloads and impressions, but engagement and audience quality.", status: "included", label: "End-of-series report on audience, content and early engagement" },
    { name: "Pipeline & revenue attribution", desc: "Track the journey from content impression to pipeline influence.", status: "not-included" },
    { name: "Ongoing optimisation", desc: "Monthly review and optimisation across content, format and distribution.", status: "not-included" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight treating the podcast as a board-level commercial asset.", status: "not-included" },
    { name: "Senior account management", desc: "A named senior contact who knows your business, your market and your goals.", status: "not-included" },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "All deliverables guaranteed against agreed standards. If it's not right, we fix it. No arguments.", status: "included", label: "All deliverables guaranteed" },
    { name: "90-day review with exit rights", desc: "Formal review with contractual exit rights if agreed indicators aren't met.", status: "not-included" },
    { name: "Client reference calls", desc: "Introduction to a current client at the same tier before you commit.", status: "not-included" },
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
    { name: "Audience & ICP definition", desc: "Who are you making this for? We define your ideal listener, their role, their world — so every episode is built for the person most likely to become a client.", status: "included", label: "Full ICP & buyer mapping" },
    { name: "Podcast concept & positioning", desc: "What is the show about and why should anyone care? We shape the name, format, tone and angle.", status: "included", label: "Full concept, name, format and market positioning" },
    { name: "Content pillars & episode roadmap", desc: "We map out the themes, topics and episode arc so the show builds authority deliberately.", status: "included", label: "Full episode roadmap with topic, format and messaging direction" },
    { name: "Distribution strategy", desc: "We plan exactly where and how your episodes reach the right people across all channels.", status: "included", label: "Multi-channel strategy across LinkedIn, YouTube, email and podcast platforms" },
    { name: "Host sourcing & coaching", desc: "The host makes or breaks a podcast. We find the right person and coach them to sound natural, confident and authoritative on mic.", status: "included", label: "Full sourcing, testing and ongoing coaching" },
    { name: "Marketing stack integration", desc: "We connect the podcast into your CRM, email platform and marketing automation.", status: "included", label: "Full integration into your CRM, email and automation stack" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Consistency is what builds an audience — we make sure it never slips.", status: "included", label: "2 per month, every month" },
    { name: "Recording — video & audio", desc: "A guest who sounds like they're in the room with you, not on a call. We set up every recording for success.", status: "included", label: "Studio or remote — full technical direction included" },
    { name: "Editing & post-production", desc: "Good editing is invisible. Great editing makes 45 minutes feel like 15. This is where the craft lives.", status: "included", label: "Full video and audio post-production" },
    { name: "Publishing & platform management", desc: "Published across Spotify, Apple Podcasts, YouTube and every major platform with optimised metadata.", status: "included", label: "All platforms, fully managed" },
    { name: "PodPlanner", desc: "Access to our proprietary production software, designed to streamline production and ideas across your team. Everyone stays aligned, nothing gets lost.", status: "included", label: "Included" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form video clips", desc: "The moments that make someone stop scrolling and share. Cut and formatted for LinkedIn, Instagram and YouTube Shorts.", status: "included", label: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Every clip needs a reason to be watched. We write the hooks, captions and post copy that earn the click.", status: "included", label: "Hooks, captions and full post copy for every clip" },
    { name: "Thumbnails & visual assets", desc: "We design episode artwork, cover graphics and social visuals that look like a show worth taking seriously.", status: "included", label: "Episode thumbnails, cover art and social graphics" },
    { name: "Show notes & SEO", desc: "Long-form written show notes built to rank in Google. Good show notes compound in value over time.", status: "included", label: "Long-form show notes with SEO optimisation" },
    { name: "Content repurposing", desc: "One episode becomes many assets — LinkedIn posts, articles, email copy and quote cards.", status: "included", label: "LinkedIn posts, articles, email copy and quote cards" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "We write, schedule and publish across LinkedIn, YouTube and social on your behalf — every week.", status: "included", label: "Fully managed — we post on your behalf across all channels" },
    { name: "Email & newsletter distribution", desc: "We integrate each episode into your newsletter so subscribers hear about it first.", status: "included", label: "Episode distribution integrated into your newsletter" },
    { name: "Paid media", desc: "Targeted paid campaigns across LinkedIn, YouTube and Spotify.", status: "not-included" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "We research and identify guests who are credible to your audience — not just whoever will say yes.", status: "included", label: "Ongoing pipeline of ICP-aligned guests, managed continuously" },
    { name: "Guest outreach & booking", desc: "We handle every touch from first contact to confirmed recording. No generic Calendly links. No copy-paste templates.", status: "included", label: "End-to-end outreach and booking management" },
    { name: "PR & press amplification", desc: "We identify conversations worth pitching to press and trade media — turning podcast moments into wider coverage.", status: "included", label: "Active PR outreach to press and trade media" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "People trust people more than brands. We activate your hosts, guests and team to post their own reactions around each episode.", status: "not-included" },
    { name: "Creator & influencer partnerships", desc: "We identify and brief creators to share your content with their audiences through voices they already trust.", status: "not-included" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "Episode topics planned around the questions, objections and challenges your buyers raise in sales conversations.", status: "included", label: "Episode themes mapped to your sales cycle and buyer objections" },
    { name: "Sales team content toolkit", desc: "A curated library of clips and written assets your sales team can drop into outreach sequences.", status: "included", label: "Clips and copy organised by sales stage and buyer persona" },
    { name: "Lead capture & landing pages", desc: "Landing pages and CTAs built around the podcast to capture leads.", status: "not-included" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "We report on what actually matters — engagement, audience quality and the signals that indicate commercial momentum.", status: "included", label: "Monthly report — commercial metrics, engagement quality, pipeline signals" },
    { name: "Pipeline & revenue attribution", desc: "Track the journey from content impression to pipeline influence.", status: "not-included" },
    { name: "Ongoing optimisation", desc: "We review performance data every month and adjust. The show gets sharper the longer we work together.", status: "included", label: "Monthly review and optimisation across content, format and distribution" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Senior strategic oversight treating the podcast as a board-level commercial asset.", status: "not-included" },
    { name: "Senior account management", desc: "One person who is accountable for the work and accessible when it matters.", status: "included", label: "Named senior contact — consistent, accountable, accessible" },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "Every deliverable guaranteed against the agreed brief and quality standard. If it's not right, we fix it.", status: "included", label: "All deliverables guaranteed" },
    { name: "90-day review with exit rights", desc: "At 90 days we review agreed leading indicators. If we're not hitting the bar, you have the right to exit with 30 days notice.", status: "included", label: "Formal 90-day review with contractual exit rights" },
    { name: "Client reference calls", desc: "Before you sign, we'll introduce you to a current client at the same tier. A real conversation, no script.", status: "included", label: "Available on request before you commit" },
  ]},
];

const Tier2Content = () => (
  <>
    <ServiceTable sections={T2_SECTIONS} tier="t2" />
    <div className="mt-6 bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "Your brand stops being invisible between sales cycles. Prospects recognise you before your team ever reaches out."
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mt-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Making the case internally:</strong> A senior content strategist + producer + social manager costs £90–120k in salary alone. This delivers equivalent output — fully coordinated, immediately operational — for £75k, with no recruitment, no ramp-up time, no management overhead.</p>
    </div>
  </>
);

/* ── Modal content: Tier 3 ── */
const T3_SECTIONS: SvcSection[] = [
  { section: "Strategy", rows: [
    { name: "Audience & ICP definition", desc: "We define your ideal listener, their role, their world — including target account mapping of the specific companies and job titles you want in your audience.", status: "included", label: "Includes target account mapping" },
    { name: "Podcast concept & positioning", desc: "Positioned to own a category, not just occupy a niche.", status: "included", label: "Full concept, name, format and category-level positioning" },
    { name: "Content pillars & episode roadmap", desc: "Roadmap built to set the agenda in your category — topics chosen for influence, not just interest.", status: "included", label: "Category agenda roadmap" },
    { name: "Distribution strategy", desc: "Global distribution strategy across all channels — includes paid media planning.", status: "included", label: "Global multi-channel strategy including paid media planning" },
    { name: "Host sourcing & coaching", desc: "The host makes or breaks a podcast. We find the right person and coach them to sound natural, confident and authoritative on mic.", status: "included", label: "Full sourcing, testing and ongoing coaching" },
    { name: "Marketing stack integration", desc: "We connect the podcast into your CRM, email platform and marketing automation.", status: "included", label: "Full integration into your CRM, email and automation stack" },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Consistency is what builds an audience — we make sure it never slips.", status: "included", label: "2 per month, every month" },
    { name: "Recording — video & audio", desc: "A guest who sounds like they're in the room with you, not on a call. We set up every recording for success.", status: "included", label: "Studio or remote — full technical direction included" },
    { name: "Editing & post-production", desc: "Good editing is invisible. Great editing makes 45 minutes feel like 15. This is where the craft lives.", status: "included", label: "Full video and audio post-production" },
    { name: "Publishing & platform management", desc: "Published across Spotify, Apple Podcasts, YouTube and every major platform with optimised metadata.", status: "included", label: "All platforms, fully managed" },
    { name: "PodPlanner", desc: "Access to our proprietary production software, designed to streamline production and ideas across your team. Everyone stays aligned, nothing gets lost.", status: "included", label: "Included" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form video clips", desc: "The moments that make someone stop scrolling and share. Cut and formatted for LinkedIn, Instagram and YouTube Shorts.", status: "included", label: "6–10 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Every clip needs a reason to be watched. We write the hooks, captions and post copy that earn the click.", status: "included", label: "Hooks, captions and full post copy for every clip" },
    { name: "Thumbnails & visual assets", desc: "We design episode artwork, cover graphics and social visuals that look like a show worth taking seriously.", status: "included", label: "Episode thumbnails, cover art and social graphics" },
    { name: "Show notes & SEO", desc: "Long-form written show notes built to rank in Google. Good show notes compound in value over time.", status: "included", label: "Long-form show notes with SEO optimisation" },
    { name: "Content repurposing", desc: "One episode becomes many assets — LinkedIn posts, articles, email copy and quote cards.", status: "included", label: "LinkedIn posts, articles, email copy and quote cards" },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "We write, schedule and publish across LinkedIn, YouTube and social on your behalf — every week.", status: "included", label: "Fully managed — we post on your behalf across all channels" },
    { name: "Email & newsletter distribution", desc: "We integrate each episode into your newsletter so subscribers hear about it first.", status: "included", label: "Episode distribution integrated into your newsletter" },
    { name: "Paid media", desc: "Organic reach has a ceiling. We run targeted campaigns across LinkedIn, YouTube and Spotify — putting your best content in front of the right people at scale, globally.", status: "included", label: "Paid campaigns across LinkedIn, YouTube and Spotify — globally targeted" },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "The guest list is your editorial strategy. At this tier, guests are chosen from your target account list — the people you want to work with.", status: "included", label: "Guests chosen from your target account list" },
    { name: "Guest outreach & booking", desc: "We handle every touch from first contact to confirmed recording. No generic Calendly links. No copy-paste templates.", status: "included", label: "End-to-end outreach and booking management" },
    { name: "PR & press amplification", desc: "We identify conversations worth pitching to press and trade media — turning podcast moments into wider coverage.", status: "included", label: "Full PR engine — active outreach to press and trade media" },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "People trust people more than brands. We activate your hosts, guests and team to post their own reactions, takeaways and commentary around each episode.", status: "included", label: "Structured UGC programme around every episode" },
    { name: "Creator & influencer partnerships", desc: "We identify and brief relevant creators and industry voices to share your content with their own audiences through voices they already trust.", status: "included", label: "Available as a separate add-on" },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "Episode topics planned around the questions, objections and challenges your buyers raise in sales conversations — so your content does sales work before your team ever reaches out.", status: "included", label: "Episode themes mapped to your sales cycle and buyer objections" },
    { name: "Sales team content toolkit", desc: "A curated library of clips and written assets your sales team can drop into outreach sequences at every stage of the funnel.", status: "included", label: "Clips and copy organised by sales stage and buyer persona" },
    { name: "Lead capture & landing pages", desc: "We build dedicated landing pages with clear calls to action that convert listeners into leads and feed them into your pipeline automatically.", status: "included", label: "Dedicated podcast landing page with lead capture and CRM integration" },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "We report on what actually matters — engagement, audience quality and the signals that indicate commercial momentum.", status: "included", label: "Monthly report — commercial metrics, engagement quality, pipeline signals" },
    { name: "Pipeline & revenue attribution", desc: "We track the journey from content impression to sales conversation to closed deal — so you can show your board exactly what the podcast is contributing to revenue.", status: "included", label: "Attribution tracking from content exposure through to pipeline and closed revenue" },
    { name: "Ongoing optimisation", desc: "We review performance data every month and adjust. The show gets sharper the longer we work together.", status: "included", label: "Monthly review and optimisation across content, format and distribution" },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Quarterly senior strategy sessions where we treat the podcast as a board-level commercial asset — reviewing market positioning, competitive landscape and commercial direction. The strategic thinking of a CMO without the hire.", status: "included", label: "Quarterly sessions with senior strategic lead" },
    { name: "Senior account management", desc: "One person who is accountable for the work and accessible when it matters.", status: "included", label: "Named senior contact — consistent, accountable, accessible" },
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
    <div className="text-sm text-text-secondary p-3 border border-border rounded-lg mb-5">Includes everything in Launch & Scale — plus the full category ownership layer.</div>
    <ServiceTable sections={T3_SECTIONS} tier="t3" />
    <div className="mt-6 bg-card border border-border rounded-xl p-5 font-heading text-base italic text-text-primary leading-relaxed">
      "In 18 months, anyone who matters in your market will associate your brand with the conversation — not just a participant in it."
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 mt-4">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Making the case to your CEO:</strong> Category ownership is a moat. At £160k/year all-in, you're not buying marketing. You're buying a defensible market position that's extraordinarily difficult for a competitor to undo.</p>
    </div>
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
          "All guests meet seniority and ICP criteria defined at the start — you have approval rights",
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
    { name: "Audience & ICP definition", desc: "Who are you making this for? We define your ideal listener so every episode is built for the person most likely to become a client.", t3: "Includes target account mapping", t2: "Full ICP & buyer mapping", t1: "Core ICP definition" },
    { name: "Podcast concept & positioning", desc: "What is the show about and why should anyone care? We shape the name, format, tone and angle so it has a clear reason to exist in a crowded market.", t3: "Category-level positioning", t2: "Full concept, name, format and positioning", t1: "Full concept, name, format and positioning" },
    { name: "Content pillars & episode roadmap", desc: "What will you talk about and in what order? We map out the themes, topics and episode arc so the show builds authority deliberately.", t3: "Category agenda roadmap", t2: "Full episode roadmap with topic and messaging direction", t1: "Core content pillars and launch episode themes" },
    { name: "Distribution strategy", desc: "A show no-one hears is just expensive audio. We plan exactly where and how your episodes reach the right people.", t3: "Global multi-channel strategy including paid media planning", t2: "Multi-channel strategy across LinkedIn, YouTube and email", t1: "Distribution plan for launch" },
    { name: "Host sourcing & coaching", desc: "The host makes or breaks a podcast. We find the right person and coach them to sound natural, confident and authoritative on mic.", t3: "Full sourcing, testing and ongoing coaching", t2: "Full sourcing, testing and ongoing coaching", t1: null },
    { name: "Marketing stack integration", desc: "We connect the podcast into your CRM, email platform and marketing automation so listeners become leads automatically.", t3: "Full integration into your CRM, email and automation stack", t2: "Full integration into your CRM, email and automation stack", t1: null },
  ]},
  { section: "Production", rows: [
    { name: "Episode output", desc: "Consistency is what builds an audience. We make sure it never slips — fully managed from guest brief to final publish.", t3: "2 per month, every month", t2: "2 per month, every month", t1: "6 episodes — a complete first series" },
    { name: "Recording — video & audio", desc: "Great production starts before the edit. A guest who sounds like they're in the room with you, not on a call.", t3: "Studio or remote — full technical direction included", t2: "Studio or remote — full technical direction included", t1: "Studio or remote — full technical direction included" },
    { name: "Editing & post-production", desc: "Good editing is invisible. Great editing makes 45 minutes feel like 15. We cut for pace and clarity — this is where the craft lives.", t3: "Full video and audio post-production", t2: "Full video and audio post-production", t1: "Full video and audio post-production" },
    { name: "Publishing & platform management", desc: "We handle publishing across Spotify, Apple Podcasts, YouTube and every major platform with optimised metadata so the show is findable from day one.", t3: "All platforms, fully managed", t2: "All platforms, fully managed", t1: "All platforms, fully managed" },
    { name: "PodPlanner", desc: "Our proprietary production software — designed to streamline production and align ideas across your whole team. Every episode, every asset, every brief in one place.", t3: "Included", t2: "Included", t1: "Included" },
  ]},
  { section: "Content Creation", rows: [
    { name: "Short-form video clips", desc: "The moments that make someone stop scrolling and share. Cut for LinkedIn, Instagram and YouTube Shorts.", t3: "6–10 clips per episode", t2: "4–6 clips per episode", t1: "4–6 clips per episode" },
    { name: "Captions, hooks & social copy", desc: "Every clip needs a reason to be watched. We write the hooks, captions and post copy that earn the click — not filler text.", t3: "Hooks, captions and full post copy for every clip", t2: "Hooks, captions and full post copy for every clip", t1: "Captions for every clip" },
    { name: "Thumbnails & visual assets", desc: "The thumbnail is the first thing a new listener sees. We design episode artwork that looks like a show worth taking seriously.", t3: "Episode thumbnails, cover art and social graphics", t2: "Episode thumbnails, cover art and social graphics", t1: "Episode thumbnails and cover art" },
    { name: "Show notes & SEO", desc: "Every episode gets a written companion — a long-form summary built to rank in Google and give the episode a life beyond the listen.", t3: "Long-form show notes with SEO optimisation", t2: "Long-form show notes with SEO optimisation", t1: "Long-form show notes with SEO optimisation" },
    { name: "Content repurposing", desc: "One episode becomes many assets. We turn each recording into LinkedIn posts, articles, email copy and quote cards.", t3: "LinkedIn posts, articles, email copy and quote cards", t2: "LinkedIn posts, articles, email copy and quote cards", t1: null },
  ]},
  { section: "Distribution", rows: [
    { name: "Social media management", desc: "We write, schedule and publish across LinkedIn, YouTube and social on your behalf. Your team doesn't touch it.", t3: "Fully managed — we post on your behalf across all channels", t2: "Fully managed — we post on your behalf across all channels", t1: null },
    { name: "Email & newsletter distribution", desc: "Your existing email list is one of your most valuable distribution channels. We integrate each episode into your newsletter.", t3: "Episode distribution integrated into your newsletter", t2: "Episode distribution integrated into your newsletter", t1: null },
    { name: "Paid media", desc: "Organic reach has a ceiling. Paid distribution removes it. We run targeted campaigns across LinkedIn, YouTube and Spotify.", t3: "Paid campaigns across LinkedIn, YouTube and Spotify — globally targeted", t2: null, t1: null },
  ]},
  { section: "Guest Strategy & PR", rows: [
    { name: "Guest identification & targeting", desc: "The guest list is your editorial strategy. We research and identify guests who are credible to your audience and aligned to your content goals.", t3: "Guests chosen from your target account list", t2: "Ongoing pipeline of ICP-aligned guests, managed continuously", t1: "Guest targeting for your launch series" },
    { name: "Guest outreach & booking", desc: "We handle every touch from first contact to confirmed recording slot — with personalised outreach that reflects the quality of your show.", t3: "End-to-end outreach and booking management", t2: "End-to-end outreach and booking management", t1: "End-to-end outreach and booking management" },
    { name: "PR & press amplification", desc: "The best episodes deserve more than a social post. We identify the conversations worth pitching to press, trade media and industry publications.", t3: "Full PR engine — active outreach to press and trade media", t2: "Active PR outreach to press and trade media", t1: null },
  ]},
  { section: "UGC & Creator Network", rows: [
    { name: "UGC strategy & activation", desc: "People trust people more than brands. We activate your hosts, guests and internal team to post their own reactions, takeaways and commentary around each episode.", t3: "Structured UGC programme around every episode", t2: null, t1: null },
    { name: "Creator & influencer partnerships", desc: "We identify and brief relevant creators and industry voices to share your content with their own audiences — introducing your brand to people who have never heard of you.", t3: "Available as a separate add-on", t2: null, t1: null },
  ]},
  { section: "Sales Integration", rows: [
    { name: "Sales-aligned content planning", desc: "We plan episode topics around the questions, objections and challenges your buyers raise in sales conversations.", t3: "Episode themes mapped to your sales cycle and buyer objections", t2: "Episode themes mapped to your sales cycle and buyer objections", t1: null },
    { name: "Sales team content toolkit", desc: "A curated library of clips and written assets your sales team can drop into outreach sequences.", t3: "Clips and copy organised by sales stage and buyer persona", t2: "Clips and copy organised by sales stage and buyer persona", t1: null },
    { name: "Lead capture & landing pages", desc: "We build dedicated landing pages around the show — with clear calls to action that convert listeners into leads.", t3: "Dedicated podcast landing page with lead capture and CRM integration", t2: null, t1: null },
  ]},
  { section: "Performance & Reporting", rows: [
    { name: "Performance reporting", desc: "We report on what actually matters — not just downloads and impressions, but engagement, audience quality and the signals that indicate commercial momentum.", t3: "Monthly report — commercial metrics, engagement quality, pipeline signals", t2: "Monthly report — commercial metrics, engagement quality, pipeline signals", t1: "End-of-series report on audience, content and early engagement" },
    { name: "Pipeline & revenue attribution", desc: "We track the journey from content impression to sales conversation to closed deal.", t3: "Attribution tracking from content exposure through to pipeline and closed revenue", t2: null, t1: null },
    { name: "Ongoing optimisation", desc: "We review performance data every month and adjust — topics, formats, clip styles, posting times.", t3: "Monthly review and optimisation across content, format and distribution", t2: "Monthly review and optimisation across content, format and distribution", t1: null },
  ]},
  { section: "Strategic Direction", rows: [
    { name: "Fractional Podcast CMO", desc: "Quarterly senior strategy sessions where we treat the podcast as a board-level commercial asset.", t3: "Quarterly sessions with senior strategic lead", t2: null, t1: null },
    { name: "Senior account management", desc: "A named senior contact who knows your business, your market and your goals — not a rotating account team.", t3: "Named senior contact — consistent, accountable, accessible", t2: "Named senior contact — consistent, accountable, accessible", t1: null },
  ]},
  { section: "Guarantees", rows: [
    { name: "Output & quality guarantee", desc: "Every deliverable — episodes, clips, copy, visuals — is guaranteed against the agreed brief and quality standard. If something isn't right, we fix it.", t3: "All deliverables guaranteed", t2: "All deliverables guaranteed", t1: "All deliverables guaranteed" },
    { name: "90-day review with exit rights", desc: "At 90 days we sit down together and review the agreed leading indicators. If we're not hitting the bar we set, you have the right to exit with 30 days notice.", t3: "Formal 90-day review with contractual exit rights", t2: "Formal 90-day review with contractual exit rights", t1: null },
    { name: "Client reference calls", desc: "Before you sign, we'll introduce you to a current client at the same tier. A real conversation, no script — so you can hear directly what it's like to work with us.", t3: "Available on request before you commit", t2: "Available on request before you commit", t1: null },
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

const CompareTable = ({ currency, prodType }: { currency: Currency; prodType: ProdType }) => {
  const prices = ALL_PRICES[currency][prodType];
  return (
    <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary border-b border-border w-[30%]">Service</th>
            <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
              <div className="text-[11px] font-medium text-text-primary">Global Leader</div>
              <div className="text-[10px] text-text-tertiary">{prices.t3.price} + ad spend</div>
              <span className="inline-block mt-1 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-full" style={{ background: "#f0eaf8", color: "#4e2d7a" }}>Tier 03</span>
            </th>
            <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
              <div className="text-[11px] font-medium text-text-primary">Launch & Scale</div>
              <div className="text-[10px] text-text-tertiary">{prices.t2.price}</div>
              <span className="inline-block mt-1 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-full" style={{ background: "#eaeffa", color: "#1649a0" }}>Tier 02</span>
            </th>
            <th className="px-3 py-3 text-center border-b border-border w-[23.3%]">
              <div className="text-[11px] font-medium text-text-primary">Launch</div>
              <div className="text-[10px] text-text-tertiary">{prices.t1.price} one-time</div>
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
};

/* ── Compare modal ── */
const CompareModal = ({ open, onClose, currency = "GBP" as Currency, prodType = "location" as ProdType }: { open: boolean; onClose: () => void; currency?: Currency; prodType?: ProdType }) => (
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
            <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Full comparison</div>
            <h3 className="font-heading text-2xl text-text-primary mb-2">Side by side</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Every service across all three tiers. What's included, at what level, and what changes as you scale.</p>
          </ModalHeader>
          <div className="p-6 sm:p-8"><CompareTable currency={currency} prodType={prodType} /></div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Animated modal header ── */
const ModalHeader = ({ children, accentColor = "#6A9FA3" }: { children: React.ReactNode; accentColor?: string }) => (
  <div className="relative overflow-hidden border-b border-border">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, #8B83C7, #C484C9, transparent)` }} />
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
      />
    </div>
    <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.02) 39px,rgba(255,255,255,0.02) 40px)" }} />
    <div className="relative p-6 sm:p-8 pb-5">{children}</div>
  </div>
);

/* ── Modal wrapper ── */
const tierAccent: Record<string, string> = { t1: "#6A9FA3", t2: "#7BAF8E", t3: "#8B83C7" };

type TierModalData = { id: string; num: string; modalTitle?: string; modalPitch?: string; price: string; priceNote: string; modalDopamine?: string };

const TierModal = ({ open, onClose, tier, children }: { open: boolean; onClose: () => void; tier: TierModalData | null; children: React.ReactNode }) => (
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
            <h3 className="font-heading text-2xl text-text-primary mb-2">{tier.modalTitle || "Full service breakdown"}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{tier.modalPitch}</p>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl text-text-primary">{tier.price}</span>
              <span className="text-xs text-text-tertiary">{tier.priceNote}</span>
            </div>
          </ModalHeader>
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

const convertSpend = (gbp: number, currency: Currency): string => {
  const rates: Record<Currency, number> = { GBP: 1, USD: 1.27, EUR: 1.17 };
  const sym = CURRENCY_SYMBOLS[currency];
  const val = Math.round(gbp * rates[currency]);
  return `${sym}${val.toLocaleString()}`;
};

const PaidMediaSlider = ({ currency, step, setStep }: { currency: Currency; step: number; setStep: (s: number) => void }) => {
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
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 60% 50% at ${30 + pct * 0.4}% 70%, ${activeColor.glow}, transparent 70%)` }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0" style={{ background: C.plumBg, color: C.plum }}>Global Leader</span>
        </div>
        <h3 className="font-heading text-xl text-text-primary mb-1">Paid Media Investment</h3>
        <p className="text-sm text-text-secondary mb-6">Drag to explore how ad spend scales impressions within your target ICP.</p>

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
                <motion.div
                  className="w-full rounded-t-md relative overflow-hidden"
                  animate={{ height: `${barHeight}%`, opacity: isActive ? 1 : 0.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    background: isActive ? `linear-gradient(180deg, ${barColor.bar}, ${barColor.bar}88)` : "rgba(255,255,255,0.06)",
                    boxShadow: isCurrent ? `0 0 20px ${barColor.glow}, 0 0 40px ${barColor.glow}` : "none",
                  }}
                >
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)" }}
                    />
                  )}
                </motion.div>
                <div className={`mt-2 text-[8px] sm:text-[9px] font-medium transition-colors ${isCurrent ? "text-text-primary" : "text-text-tertiary/50"}`}>
                  {convertSpend(s.spend, currency).replace(",000", "k").replace(",500", ".5k")}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="rounded-xl border p-5 relative overflow-hidden"
            animate={{ borderColor: `${activeColor.bar}33`, boxShadow: `inset 0 0 30px ${activeColor.glow.replace(")", ",0.08)")}` }}
            transition={{ duration: 0.4 }}
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Monthly spend</div>
            <motion.div key={current.spend} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl sm:text-3xl text-text-primary">
              {convertSpend(current.spend, currency)}
            </motion.div>
            <div className="text-xs text-text-tertiary mt-1">/month</div>
          </motion.div>
          <motion.div
            className="rounded-xl border p-5 relative overflow-hidden"
            animate={{ borderColor: `${activeColor.bar}33`, boxShadow: `inset 0 0 30px ${activeColor.glow.replace(")", ",0.08)")}` }}
            transition={{ duration: 0.4 }}
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Estimated impressions</div>
            <motion.div key={current.impressions} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl sm:text-3xl" style={{ color: activeColor.bar }}>
              {current.impressions}
            </motion.div>
            <div className="text-xs text-text-tertiary mt-1">/month within your ICP</div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <motion.span key={current.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-medium" style={{ color: activeColor.bar }}>
            {current.label}
          </motion.span>
          <span className="text-[10px] text-text-tertiary">{convertSpend(3000, currency)} – {convertSpend(50000, currency)}/mo</span>
        </div>

        <div className="relative h-2.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${pct}%`, background: `linear-gradient(90deg, #6359EA, ${activeColor.bar})`, boxShadow: `0 0 12px ${activeColor.glow}` }}
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
            animate={{ left: `calc(${pct}% - 12px)`, background: activeColor.bar, boxShadow: `0 0 16px ${activeColor.glow}, 0 0 32px ${activeColor.glow}` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ── Pricing Breakdown Table ── */
const BREAKDOWN_DATA: Record<string, Record<ProdType, Record<string, { launch: string; monthly: string; monthlyNum: number; yearly: string; episodes: string; paidMedia: string }>>> = {
  GBP: {
    location: {
      t1: { launch: "£19,500", monthly: "—", monthlyNum: 0, yearly: "£19,500", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "£15,000", monthly: "£5,000", monthlyNum: 5000, yearly: "£75,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "£25,000", monthly: "£8,500", monthlyNum: 8500, yearly: "£127,000", episodes: "2 per month", paidMedia: "Min £3,000/mo" },
    },
    virtual: {
      t1: { launch: "£14,000", monthly: "—", monthlyNum: 0, yearly: "£14,000", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "£10,000", monthly: "£3,500", monthlyNum: 3500, yearly: "£52,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "£17,000", monthly: "£6,000", monthlyNum: 6000, yearly: "£89,000", episodes: "2 per month", paidMedia: "Min £3,000/mo" },
    },
  },
  USD: {
    location: {
      t1: { launch: "$26,500", monthly: "—", monthlyNum: 0, yearly: "$26,500", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "$20,000", monthly: "$6,750", monthlyNum: 6750, yearly: "$101,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "$34,000", monthly: "$11,500", monthlyNum: 11500, yearly: "$172,000", episodes: "2 per month", paidMedia: "Min $4,000/mo" },
    },
    virtual: {
      t1: { launch: "$19,000", monthly: "—", monthlyNum: 0, yearly: "$19,000", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "$13,500", monthly: "$4,750", monthlyNum: 4750, yearly: "$70,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "$23,000", monthly: "$8,000", monthlyNum: 8000, yearly: "$120,000", episodes: "2 per month", paidMedia: "Min $4,000/mo" },
    },
  },
  EUR: {
    location: {
      t1: { launch: "€22,500", monthly: "—", monthlyNum: 0, yearly: "€22,500", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "€17,000", monthly: "€5,750", monthlyNum: 5750, yearly: "€86,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "€29,000", monthly: "€9,750", monthlyNum: 9750, yearly: "€146,000", episodes: "2 per month", paidMedia: "Min €3,500/mo" },
    },
    virtual: {
      t1: { launch: "€16,000", monthly: "—", monthlyNum: 0, yearly: "€16,000", episodes: "6 episodes (one-time)", paidMedia: "Not included" },
      t2: { launch: "€11,500", monthly: "€4,000", monthlyNum: 4000, yearly: "€60,000", episodes: "2 per month", paidMedia: "Not included" },
      t3: { launch: "€19,500", monthly: "€6,875", monthlyNum: 6875, yearly: "€102,000", episodes: "2 per month", paidMedia: "Min €3,500/mo" },
    },
  },
};

const ORGANIC_REACH: Record<string, { low: number; high: number; paidEfficiency: number }> = {
  t1: { low: 25, high: 60, paidEfficiency: 0.6 },
  t2: { low: 120, high: 250, paidEfficiency: 0.82 },
  t3: { low: 200, high: 400, paidEfficiency: 1 },
};

const PRODUCTION_REACH_MULTIPLIER: Record<ProdType, number> = {
  location: 1,
  virtual: 0.88,
};

const formatReach = (low: number, high: number): string => {
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}M` : `${n}k`;
  return `${fmt(low)}–${fmt(high)}`;
};

const TIER_LABELS: Record<string, string> = { t1: "Tier 01 · Launch", t2: "Tier 02 · Launch & Scale", t3: "Tier 03 · Global Leader" };

const PricingBreakdownTable = ({ tier, currency, prodType, mediaStep }: { tier: "t1" | "t2" | "t3"; currency: Currency; prodType: ProdType; prices: TierPrices; mediaStep: number }) => {
  const data = BREAKDOWN_DATA[currency][prodType][tier];
  const isT3 = tier === "t3";
  const mediaData = MEDIA_STEPS[mediaStep];
  const rates: Record<Currency, number> = { GBP: 1, USD: 1.27, EUR: 1.17 };
  const sym = CURRENCY_SYMBOLS[currency];
  const paidSpendConverted = Math.round(mediaData.spend * rates[currency]);
  const mediaSpend = convertSpend(mediaData.spend, currency);

  // Monthly total = retainer + paid media (t3 only)
  const monthlyTotal = isT3 ? data.monthlyNum + paidSpendConverted : data.monthlyNum;
  const monthlyTotalStr = monthlyTotal > 0 ? `${sym}${monthlyTotal.toLocaleString()}` : "—";

  // Organic reach
  const organic = ORGANIC_REACH[tier];

  // Paid impressions from slider (parse low/high from mediaData)
  const paidImpLow = isT3 ? mediaData.impNum * 0.7 : 0;
  const paidImpHigh = isT3 ? mediaData.impNum * 1.3 : 0;

  // Total reach
  const totalLow = organic.low + Math.round(paidImpLow);
  const totalHigh = organic.high + Math.round(paidImpHigh);
  const totalReachStr = formatReach(totalLow, totalHigh);

  const rows = [
    { label: "Launch strategy fee", value: data.launch, desc: tier === "t1" ? "One-time investment — no ongoing commitment" : "Paid upfront before production begins", highlight: false },
    { label: "Monthly retainer", value: data.monthly, desc: tier === "t1" ? "No monthly fee — one-time project" : "Billed monthly for 12 months", highlight: false },
    ...(isT3 ? [{ label: "Paid media budget", value: `${mediaSpend}/mo`, desc: `Billed separately · use the slider above to adjust`, highlight: false }] : []),
    ...(tier !== "t1" ? [{ label: "Monthly total", value: `${monthlyTotalStr}/mo`, desc: isT3 ? "Retainer + paid media spend combined" : "Total monthly commitment", highlight: true }] : []),
    { label: "Annual total", value: data.yearly, desc: tier === "t1" ? "Total project cost" : "Launch fee + 12 months of retainer" + (isT3 ? " (excl. paid media)" : ""), highlight: tier === "t1" },
    { label: "Episode output", value: data.episodes, desc: tier === "t1" ? "A complete first series" : "Consistent monthly production", highlight: false },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-border overflow-hidden" style={{ background: "#111113" }}>
      <div className="p-6 sm:p-8 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0" style={{
            background: tier === "t3" ? C.plumBg : tier === "t2" ? C.blueBg : C.greenBg,
            color: tier === "t3" ? C.plum : tier === "t2" ? C.blueDk : C.greenDk,
          }}>{TIER_LABELS[tier]}</span>
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0 bg-secondary text-text-secondary">
            {prodType === "location" ? "On Location" : "Virtual"}
          </span>
        </div>
        <h3 className="font-heading text-xl text-text-primary mb-1">Investment Breakdown</h3>
        <p className="text-sm text-text-secondary">A detailed summary of your selected tier's pricing structure.</p>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className={`flex items-center justify-between px-6 sm:px-8 py-4 ${row.highlight ? "bg-[#1CFA76]/5" : ""}`}>
            <div>
              <div className={`text-sm font-medium ${row.highlight ? "text-[#1CFA76]" : "text-text-primary"}`}>{row.label}</div>
              <div className="text-xs text-text-tertiary mt-0.5">{row.desc}</div>
            </div>
            <motion.div key={row.value} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`font-heading text-lg sm:text-xl text-right ${row.highlight ? "text-[#1CFA76]" : "text-text-primary"}`}>
              {row.value}
            </motion.div>
          </div>
        ))}
      </div>

      {/* ── Total Show Impact ── */}
      <div className="border-t border-border">
        <div className="px-6 sm:px-8 py-5 bg-[#8B83C7]/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8B83C7]" />
            <span className="text-xs font-medium text-[#8B83C7] tracking-wide uppercase">Estimated Total Reach</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Organic reach</div>
              <motion.div key={organic.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading text-lg text-text-primary">{organic.label}</motion.div>
              <div className="text-[10px] text-text-tertiary mt-0.5">impressions/mo from content, social & SEO</div>
            </div>
            {isT3 && (
              <div>
                <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Paid reach</div>
                <motion.div key={mediaData.impressions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading text-lg" style={{ color: STEP_COLORS[mediaStep].bar }}>{mediaData.impressions}</motion.div>
                <div className="text-[10px] text-text-tertiary mt-0.5">impressions/mo from paid media</div>
              </div>
            )}
            <div>
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-1">Total impact</div>
              <motion.div key={totalReachStr} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="font-heading text-xl text-[#1CFA76]">{totalReachStr}</motion.div>
              <div className="text-[10px] text-text-tertiary mt-0.5">estimated impressions/mo within your ICP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const [prodType, setProdType] = useState<ProdType>("location");
  const [selectedTier, setSelectedTier] = useState<"t1" | "t2" | "t3" | null>(null);
  const [mediaStep, setMediaStep] = useState(0);

  const prices = ALL_PRICES[currency][prodType];

  const tiers = useMemo(() => tierCards.map(t => ({
    ...t,
    price: prices[t.id].price,
    priceNote: prices[t.id].note,
    dpPrice: prices[t.id].dp,
    dpNote: prices[t.id].dn,
  })), [prices]);

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
        <div className="flex justify-center mb-4">
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        {/* Production type toggle */}
        <div className="mb-6">
          <ProductionToggle value={prodType} onChange={setProdType} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden items-stretch">
          {tiers.map((tier, i) => {
            const isSelected = selectedTier === tier.id;
            return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-6 sm:p-8 flex flex-col transition-all duration-200 ${tier.featured ? "bg-background" : "bg-card"} ${isSelected ? "ring-2 ring-[#1CFA76]" : ""}`}
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
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedTier(isSelected ? null : tier.id); }}
                  className={`w-full text-xs font-medium tracking-wide py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1CFA76] text-black"
                      : "border border-[#1CFA76]/40 text-[#1CFA76] hover:bg-[#1CFA76]/10"
                  }`}
                >
                  {isSelected ? "✓ Selected" : "Select this tier"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveModal(tier.id); }}
                  className="w-full text-xs font-medium tracking-wide py-2.5 px-4 rounded-lg border border-border text-text-primary hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                >
                  See what's included <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
            );
          })}
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
        <PaidMediaSlider currency={currency} step={mediaStep} setStep={setMediaStep} />

        {/* ── PRICING BREAKDOWN TABLE ── */}
        <AnimatePresence>
          {selectedTier && (
            <motion.div
              initial={{ opacity: 0, y: 30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <PricingBreakdownTable
                tier={selectedTier}
                currency={currency}
                prodType={prodType}
                prices={prices}
                mediaStep={mediaStep}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER NOTE ── */}
        <div className="text-center py-12 md:py-16">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Not sure which tier fits?</strong> Start with Tier 1. It's designed to give you proof of concept — and make the decision for Tier 2 obvious.
          </p>
        </div>
      </main>

      {/* ── MODALS ── */}
      <TierModal open={activeModal === "t1"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t1") || null}>
        <Tier1Content />
      </TierModal>
      <TierModal open={activeModal === "t2"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t2") || null}>
        <Tier2Content />
      </TierModal>
      <TierModal open={activeModal === "t3"} onClose={() => setActiveModal(null)} tier={tiers.find(t => t.id === "t3") || null}>
        <Tier3Tabs />
      </TierModal>
      <CompareModal open={activeModal === "compare"} onClose={() => setActiveModal(null)} currency={currency} prodType={prodType} />

      <Footer />
    </div>
  );
};

export default PricingTiers;

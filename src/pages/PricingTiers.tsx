import { useEffect, useState } from "react";
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

const GuaranteeBlock = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-xl overflow-hidden border border-[#7BAF8E]/20 my-5">
    <div className="px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase" style={{ background: C.greenBg, color: C.greenDk }}>{title}</div>
    <ul className="divide-y divide-[#7BAF8E]/10">
      {items.map((item) => (
        <li key={item} className="px-4 py-2.5 text-sm text-text-secondary flex gap-2.5 leading-relaxed">
          <span className="text-[#7BAF8E] text-xs font-bold shrink-0 mt-0.5">✓</span>{item}
        </li>
      ))}
    </ul>
  </div>
);

const NoGuaranteeBlock = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-xl overflow-hidden border border-border my-5">
    <div className="px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary bg-secondary/60">{title}</div>
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item} className="px-4 py-2.5 text-sm text-text-secondary flex gap-2.5 leading-relaxed">
          <span className="text-text-tertiary text-xs shrink-0 mt-0.5">✕</span>{item}
        </li>
      ))}
    </ul>
  </div>
);

const RoiBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-secondary/40 rounded-xl p-5 my-5">
    <p className="text-sm text-text-secondary leading-relaxed m-0">{children}</p>
  </div>
);

const UnlockQuote = ({ children }: { children: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 my-5 font-heading text-base italic text-text-primary leading-relaxed">{children}</div>
);

/* ── tier data ── */
const tiers = [
  {
    id: "t1",
    num: "Tier 01",
    name: "A show your\nmarket notices.",
    hook: "A polished, credible podcast built from the ground up with the strategy, production and content to establish real authority in your space.",
    modalPitch: "You go from \"we keep saying we should start a podcast\" to a polished, credible show your team is proud to share with the strategy to ensure it's built on something real.",
    modalTitle: "Launch",
    price: "£19,500",
    priceNote: "One-time fee · 6 episodes · strategy included",
    dopamine: "If you're not proud of what we build, we'll be the first to say so.",
    featured: false,
  },
  {
    id: "t2",
    num: "Tier 02 · Launch & Scale",
    name: "Your brand,\nin front of your\nbuyer. Every month.",
    hook: "A fully managed content engine that puts you in front of the right people consistently, professionally, without your team lifting a finger.",
    modalPitch: "Your podcast becomes part of how your company shows up in the market consistently, professionally, and without your team carrying the operational weight.",
    modalTitle: "Launch & Scale",
    price: "£75,000/yr",
    priceNote: "£15k onboarding · £5,750/month · 2 episodes/month",
    dopamine: "The equivalent of a senior content hire without the salary, overhead, or learning curve.",
    modalDopamine: "What does a single warm conversation with a dream client cost you through paid channels? This builds a system that generates them every month.",
    featured: true,
    popular: true,
  },
  {
    id: "t3",
    num: "Tier 03 · Category Engine",
    name: "Become the only\nname your market\nthinks of.",
    hook: "We build the infrastructure for your brand to own the conversation in your category across every channel, in every market, at a scale your competitors can't match without starting from scratch.",
    modalPitch: "In 18 months, anyone who matters in your market will associate your brand with the conversation not just a participant in it. This is the infrastructure that makes that happen: paid, organic, creator, UGC and PR firing simultaneously, across every channel your buyers are on, globally.",
    modalTitle: "Category Engine",
    price: "£125,000/yr",
    priceNote: "+ min £3k/month ad spend",
    dopamine: "Your competitors will feel this before they understand what's happening.",
    modalDopamine: "Your competitors will feel this before they understand what's happening.",
    featured: false,
  },
];

/* ── Modal content components ── */
const Tier1Content = () => (
  <>
    <div className="mb-6"><SectionTitle>Strategy</SectionTitle><BulletList items={[
      "Define your target audience (ICP) — who you're talking to and why they'll care",
      "Shape the podcast concept, format and market positioning",
      "Identify content pillars and themes that drive real engagement",
      "Build a distribution plan so the show actually gets heard",
    ]} /></div>
    <div className="mb-6"><SectionTitle>Production — 6 fully produced episodes</SectionTitle><BulletList items={[
      "High-quality video and audio recording",
      "Professional editing — paced, clear, engaging",
      "Published across all major podcast platforms from day one",
    ]} /></div>
    <div className="mb-6"><SectionTitle>Content</SectionTitle><BulletList items={[
      "4–6 short-form video clips per episode, optimised for social",
      "Captions and hooks designed to stop the scroll",
      "Branded thumbnails and visuals",
      "SEO-optimised show notes",
    ]} /><InsightChip color={C.teal} bg="rgba(106,159,163,0.12)">Content designed to be shared, not just watched</InsightChip></div>
    <div className="mb-6"><SectionTitle>Guest & performance</SectionTitle><BulletList items={[
      "Identify relevant, on-brand guests — targeted, not random",
      "Personalised outreach and booking",
      "Clear early reporting on what's landing with your audience",
    ]} /></div>
    <GuaranteeBlock title="What we commit to" items={[
      "Every episode delivered to agreed brief and quality standard",
      "All guests meet the ICP profile defined at strategy stage",
      "Performance report delivered within 7 days of final episode",
      "If we're not proud of the work, we'll tell you — and fix it",
    ]} />
    <RoiBox><strong className="text-text-primary">Making the case internally:</strong> Six episodes at £19,500 costs less than one month of a mid-level content hire — and produces a permanent asset your brand owns.</RoiBox>
    <UnlockQuote>"A credible show in market. Your brand sounds like it means it. Your leadership wants to be on it. Your audience starts to notice."</UnlockQuote>
  </>
);

const Tier2Content = () => (
  <>
    <div className="mb-6"><SectionTitle>Strategy & system design — first 8 weeks</SectionTitle><BulletList items={[
      "Deep ICP and buyer mapping — who, where, and what moves them",
      "Content strategy and roadmap built around your audience's actual priorities",
      "Multi-channel distribution — LinkedIn, YouTube, email",
      "Full integration into your existing marketing activity",
      "Host sourcing, testing and training",
      "Studio setup and creative direction",
    ]} /><InsightChip color={C.blueDk} bg={C.blueBg}>You don't just get a podcast. You get a system for how it drives attention.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Production — 2 episodes per month, end-to-end</SectionTitle><BulletList items={[
      "Guest booking, scheduling and all logistics handled",
      "Recording — studio or remote, your choice",
      "Full video + audio editing to broadcast standard",
      "Publishing and distribution managed for you",
    ]} /><InsightChip color={C.blueDk} bg={C.blueBg}>Fully managed. Zero added workload for your team.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Distribution & guest engine</SectionTitle><BulletList items={[
      "Published across all podcast platforms and social channels — we write and post",
      "Episodes repurposed into clips, copy and multiple formats",
      "High-value guests your audience respects — personalised outreach, consistent pipeline",
    ]} /><InsightChip color={C.blueDk} bg={C.blueBg}>Your content shows up where your buyers already are — every month, without fail.</InsightChip></div>
    <GuaranteeBlock title="What we commit to in writing" items={[
      "2 fully produced episodes per month, every month — delivered on schedule",
      "All guests meet the seniority and ICP criteria agreed at onboarding",
      "Monthly performance report delivered on a fixed date — commercial metrics, not vanity numbers",
      "Senior point of contact accessible within 24 hours",
      "90-day performance review with defined exit rights if agreed leading indicators aren't being met",
    ]} />
    <NoGuaranteeBlock title="What no agency can honestly guarantee" items={[
      "Specific impression volumes — platform algorithms change and targeting precision affects reach",
      "Pipeline numbers — too many variables sit outside content alone",
    ]} />
    <RoiBox><strong className="text-text-primary">Making the case internally:</strong> A senior content strategist + producer + social manager costs £90–120k in salary alone. This delivers equivalent output — fully coordinated, immediately operational — for £75k, with no recruitment, no onboarding, no management overhead.</RoiBox>
    <UnlockQuote>"Your brand stops being invisible between sales cycles. Prospects recognise you before your team ever reaches out."</UnlockQuote>
  </>
);

const Tier3Tabs = () => {
  const [tab, setTab] = useState<"included" | "adspend" | "guarantees">("included");
  return (
    <>
      <div className="flex border-b border-border mb-6">
        {(["included", "adspend", "guarantees"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-xs font-medium tracking-wide py-3 border-b-2 transition-colors ${tab === t ? "text-[#8B83C7] border-[#8B83C7]" : "text-text-tertiary border-transparent hover:text-text-secondary"}`}
          >
            {t === "included" ? "What's included" : t === "adspend" ? "Ad spend" : "Guarantees"}
          </button>
        ))}
      </div>
      {tab === "included" && <Tier3Included />}
      {tab === "adspend" && <Tier3AdSpend />}
      {tab === "guarantees" && <Tier3Guarantees />}
    </>
  );
};

const Tier3Included = () => (
  <>
    <div className="text-sm text-text-secondary p-3 border border-border rounded-lg mb-6">Includes everything in Launch & Scale plus the full category ownership layer.</div>
    <div className="mb-6"><SectionTitle>Global paid amplification own every channel your buyers use</SectionTitle><BulletList items={[
      "Multi-channel paid campaigns across LinkedIn, YouTube, Spotify, display and beyond",
      "Content distributed into every market your buyers operate in not just your home territory",
      "Continuous creative testing at scale what works gets amplified, what doesn't gets cut",
      "Retargeting infrastructure that keeps your brand in front of warm audiences across platforms",
    ]} /><InsightChip color={C.plum} bg={C.plumBg}>Your buyers can't go a week without encountering your brand somewhere.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Category conversation strategy you set the agenda</SectionTitle><BulletList items={[
      "Episode themes and guests chosen to own the defining conversations in your space",
      "Your show becomes the reference point competitors are measured against",
      "PR layer turns episodes into industry moments not just content",
      "Thought leadership positioned to shape how your category is discussed, not just covered",
    ]} /><InsightChip color={C.plum} bg={C.plumBg}>You're not joining the conversation. You're running it.</InsightChip></div>
    <div className="mb-6"><SectionTitle>UGC & creator network human voices at scale</SectionTitle><BulletList items={[
      "Hosts, guests and your internal team activated as content contributors",
      "Creator partnerships that carry your content to audiences outside your own reach",
      "Short-form UGC reactions, insights, commentary around every episode",
      "Guest networks mobilised to amplify across their own global audiences",
    ]} /><InsightChip color={C.plum} bg={C.plumBg}>Credibility spreads through trusted voices, not just brand channels.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Sales & commercial integration</SectionTitle><BulletList items={[
      "Content built around the exact objections and challenges your buyers face",
      "Sales team equipped with a content arsenal for every stage of the funnel",
      "Prospects arrive at sales conversations already informed, already warm",
    ]} /><InsightChip color={C.plum} bg={C.plumBg}>By the time your sales team reaches out, the work is already done.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Fractional Podcast CMO category strategy at board level</SectionTitle><BulletList items={[
      "Quarterly senior strategy sessions treating the podcast as a business asset, not a content project",
      "Full attribution from reach and engagement through to pipeline and revenue influence",
      "Continuous alignment with commercial priorities as your market evolves",
    ]} /><InsightChip color={C.plum} bg={C.plumBg}>The strategic thinking of a CMO without the executive hire.</InsightChip></div>
    <RoiBox><strong className="text-text-primary">Making the case to your CEO:</strong> Category ownership is a moat. Once your brand owns the conversation in your space the show people reference, the voice people trust, the content that shapes how your market thinks that position is extraordinarily difficult for a competitor to undo. At £160k/year all-in, you're not buying marketing. You're buying a defensible market position.</RoiBox>
    <UnlockQuote>"In 18 months, anyone who matters in your market will associate your brand with the conversation not just a participant in it."</UnlockQuote>
  </>
);

const SpendScenario = ({ label, amount, children }: { label: string; amount: string; children: React.ReactNode }) => (
  <div className="border border-border rounded-xl overflow-hidden mb-3">
    <div className="flex justify-between items-center px-4 py-3 bg-secondary/40">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span className="font-heading text-base" style={{ color: C.plum }}>{amount}</span>
    </div>
    <div className="px-4 py-3 text-sm text-text-secondary leading-relaxed border-t border-border">{children}</div>
  </div>
);

const Tier3AdSpend = () => (
  <>
    <p className="text-sm text-text-secondary leading-relaxed mb-5">The minimum £3k/month is a starting point, not a recommended level. Here's what different budgets actually deliver and how we report against them.</p>
    <SpendScenario label="Entry foundation presence" amount="£3,000/month">
      <strong className="text-text-primary">What this buys:</strong> 2–4 active campaigns promoting your strongest clips and maintaining consistent visibility with a defined target account list. Realistic LinkedIn reach of <strong className="text-text-primary">150,000–300,000 impressions/month</strong> tightly targeted by job title, seniority and company size. Enough to be consistently present. Not enough to dominate. Best for: Testing what content performs before scaling spend.
    </SpendScenario>
    <SpendScenario label="Growth consistent market presence" amount="£5,000–8,000/month">
      <strong className="text-text-primary">What this buys:</strong> Multi-format campaigns across LinkedIn and YouTube simultaneously. Reach of <strong className="text-text-primary">400,000–700,000 impressions/month</strong> within your target market. Enough budget to run retargeting hitting warm audiences who've already engaged with your content. Most clients at this tier move here within 3–6 months once they see what converts.
    </SpendScenario>
    <SpendScenario label="Scale market saturation within your ICP" amount="£10,000+/month">
      <strong className="text-text-primary">What this buys:</strong> Aggressive multi-channel distribution LinkedIn, YouTube, Spotify and display. <strong className="text-text-primary">1M+ impressions/month</strong> within a tightly defined audience. At this level, your brand becomes genuinely unavoidable for anyone in your target market. Best for: Enterprise clients with large deal sizes where even a single influenced opportunity justifies the spend.
    </SpendScenario>
    <div className="mt-6 mb-4"><SectionTitle>How we report on ad spend</SectionTitle></div>
    <div className="divide-y divide-border">
      {[
        { label: "Reach within target accounts", desc: "Are you actually hitting the companies you want to work with or just accumulating views from people who'll never buy?" },
        { label: "Engagement by content type", desc: "Which clips generate saves, shares and comments not just passive plays." },
        { label: "Warm signal tracking", desc: "Profile visits, connection requests, DM responses that correlate with campaign exposure." },
        { label: "Pipeline influence", desc: "Did conversations or deals involve someone exposed to your content? Directional, but tracked and reported honestly." },
        { label: "Cost per meaningful engagement", desc: "Not cost-per-click. Cost per action that signals real commercial intent." },
      ].map((r) => (
        <div key={r.label} className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2.5">
          <span className="text-xs font-medium text-text-primary sm:min-w-[180px] shrink-0">{r.label}</span>
          <span className="text-xs text-text-secondary leading-relaxed">{r.desc}</span>
        </div>
      ))}
    </div>
    <RoiBox><strong className="text-text-primary">The question worth asking your sales team:</strong> What does a genuinely warm inbound conversation with a target-account decision-maker cost you today through events, cold outreach, or paid leads? Work backwards from that number. The right media budget usually reveals itself.</RoiBox>
  </>
);

const Tier3Guarantees = () => (
  <>
    <p className="text-sm text-text-secondary leading-relaxed mb-5">Any agency promising specific pipeline numbers or impression guarantees is telling you what you want to hear. Here's what we'll commit to in writing and what we won't, and why.</p>
    <GuaranteeBlock title="What we commit to in writing" items={[
      "All production deliverables episodes, clips, show notes delivered on schedule to agreed quality standards",
      "All guests meet seniority and ICP criteria defined at onboarding. You have approval rights on the guest list.",
      "Monthly reporting delivered on a fixed date commercial metrics, not vanity numbers",
      "Senior point of contact accessible within 24 hours, always",
      "Quarterly strategy sessions in the diary before the quarter begins",
      "Transparent reporting including what isn't working, not just what is",
    ]} />
    <NoGuaranteeBlock title="What we won't guarantee and why you should be suspicious of anyone who does" items={[
      "Specific impression volumes LinkedIn CPMs shift with targeting precision and algorithm changes. Anyone guaranteeing a number hasn't run these campaigns recently.",
      "Pipeline numbers your offer, your sales team, your market timing, and a dozen variables outside content all play a role. A guarantee here is either meaningless or has a very low bar baked in.",
    ]} />
    <div className="bg-secondary/40 rounded-xl p-5 my-5">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">90-day performance review with exit rights.</strong> At the 90-day mark we review agreed leading indicators together engagement benchmarks, guest quality, content output, early audience signals. If we're not hitting the bar we set, you have the right to exit the contract with 30 days notice. We're confident enough in the work to back that in writing.</p>
    </div>
    <div className="bg-secondary/40 rounded-xl p-5 my-5">
      <p className="text-sm text-text-secondary leading-relaxed m-0"><strong className="text-text-primary">Before you sign, ask us for references.</strong> A conversation with a current Tier 3 client will tell you more than any contractual clause. We'll arrange it.</p>
    </div>
    <UnlockQuote>"We're not the right partner for every business. If we don't think this will work for you, we'll say so before you commit."</UnlockQuote>
  </>
);

const AddOnContent = () => (
  <>
    <div className="mb-6"><SectionTitle>What's included</SectionTitle><BulletList items={[
      "Identify and partner with creators authentically aligned to your audience",
      "Produce reaction-style and commentary-led content around your episodes",
      "Distribute key moments through third-party voices and platforms",
      "Extend reach to new audiences who've never heard of you — but will trust the intro",
    ]} /><InsightChip color={C.amberDk} bg={C.amberBg}>New audiences reached through voices they already trust. Credibility transfers.</InsightChip></div>
    <div className="mb-6"><SectionTitle>Best paired with</SectionTitle><BulletList items={[
      "Tier 3 — where paid amplification is already in motion",
      "Brands ready to scale beyond their existing audience",
      "Companies entering a new market or repositioning in an existing one",
    ]} /></div>
    <RoiBox><strong className="text-text-primary">Minimum commitment:</strong> 3 months to properly test creator fit and optimise performance. Starting at £2k/month for selective partnerships, up to £10k+ for multi-creator campaigns at scale.</RoiBox>
  </>
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

const TierModal = ({ open, onClose, tier, children }: { open: boolean; onClose: () => void; tier: typeof tiers[0] | null; children: React.ReactNode }) => (
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
            <h3 className="font-heading text-2xl text-text-primary mb-2">{tier.name.split("\n")[0]}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{tier.hook}</p>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl text-text-primary">{tier.price}</span>
              <span className="text-xs text-text-tertiary">{tier.priceNote}</span>
            </div>
            {tier.featured && (
              <div className="mt-4 p-3 rounded-lg bg-white/[0.06] font-heading text-sm italic text-text-secondary leading-relaxed">
                "What does a single warm conversation with a dream client cost you through paid channels? This builds a system that generates them every month."
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

/* ── Add-on modal ── */
const AddOnModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
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
          className="relative w-full max-w-[620px] my-auto rounded-2xl border border-border overflow-hidden bg-card"
        >
          <ModalHeader accentColor="#C9A96E">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-secondary">
              <X className="w-4 h-4" />
            </button>
            <div className="font-body text-[10px] font-medium tracking-[0.08em] uppercase text-text-tertiary mb-2">Optional add-on</div>
            <h3 className="font-heading text-2xl text-text-primary mb-2">Creator & Influencer Amplification</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">The difference between a brand that builds an audience and one that builds a movement is third-party credibility.</p>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-3xl text-text-primary">£2,000–£10,000+</span>
              <span className="text-xs text-text-tertiary">per month · separate managed budget</span>
            </div>
          </ModalHeader>
          <div className="p-6 sm:p-8"><AddOnContent /></div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════════════════════ */

const PricingTiers = () => {
  useMetaTags();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Block search engine indexing
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

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-foreground">
      <Navbar />

      {/* ── HERO ── */}
      <header className="relative bg-card overflow-hidden pt-24 md:pt-32 pb-20 md:pb-28 px-6 rounded-b-[40px] md:rounded-b-[60px]">
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
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
            Three ways to work together — from establishing authority to driving pipeline. Choose the level that matches where you want to go.
          </p>
        </div>
      </header>

      {/* ── TIER CARDS ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-10 -mt-10 relative z-10">
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

        {/* ── ADD-ON STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setActiveModal("addon")}
          className="cursor-pointer border border-border border-t-0 rounded-b-2xl bg-card hover:bg-card/80 transition-colors p-5 flex items-center gap-5"
        >
          <span className="text-[9px] font-medium tracking-[0.07em] uppercase px-2.5 py-1 rounded-full shrink-0" style={{ background: C.amberBg, color: C.amberDk }}>Add-on</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary">Creator & Influencer Amplification</div>
            <div className="text-xs text-text-tertiary">Third-party voices. New audiences. Credibility that compounds.</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-medium text-text-primary">£2k–£10k+</div>
            <div className="text-[10px] text-text-tertiary">per month</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-tertiary shrink-0" />
        </motion.div>

        {/* ── FOOTER NOTE ── */}
        <div className="text-center py-12 md:py-16">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Not sure which tier fits?</strong> Start with Tier 1. It's designed to give you proof of concept — and make the decision for Tier 2 obvious.
          </p>
        </div>
      </main>

      {/* ── MODALS ── */}
      <TierModal open={activeModal === "t1"} onClose={() => setActiveModal(null)} tier={tiers[0]}>
        <Tier1Content />
      </TierModal>
      <TierModal open={activeModal === "t2"} onClose={() => setActiveModal(null)} tier={tiers[1]}>
        <Tier2Content />
      </TierModal>
      <TierModal open={activeModal === "t3"} onClose={() => setActiveModal(null)} tier={tiers[2]}>
        <Tier3Tabs />
      </TierModal>
      <AddOnModal open={activeModal === "addon"} onClose={() => setActiveModal(null)} />

      <Footer />
    </div>
  );
};

export default PricingTiers;

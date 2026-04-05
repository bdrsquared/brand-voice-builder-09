import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import useMetaTags from "@/hooks/useMetaTags";

/* ── tiny reusable pieces ── */
const SectionNum = ({ children }: { children: string }) => (
  <div className="font-body text-[0.7rem] tracking-[0.18em] uppercase text-primary mb-3 flex items-center gap-3">
    <span className="w-6 h-px bg-primary inline-block" />
    {children}
  </div>
);

const Pullquote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-[3px] border-primary pl-6 py-5 my-10 bg-secondary/40 rounded-r-lg font-heading text-lg md:text-xl italic text-text-primary leading-relaxed">
    {children}
  </blockquote>
);

const Callout = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="bg-secondary/60 border border-border rounded-lg p-6 my-8">
    <div className="font-body text-xs tracking-[0.15em] uppercase text-accent mb-3 pb-2 border-b border-border">{label}</div>
    <div className="text-text-secondary text-sm md:text-base leading-relaxed">{children}</div>
  </div>
);

const BarChart = ({ title, rows }: { title: string; rows: { label: string; pct: number; val: string; color?: string }[] }) => (
  <div className="bg-secondary/40 border border-border rounded-lg p-6 my-8">
    <div className="font-body text-[0.68rem] tracking-[0.12em] uppercase text-text-tertiary mb-5">{title}</div>
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(120px,200px)_1fr_60px] items-center gap-4">
          <div className="text-sm text-text-secondary text-right leading-tight">{r.label}</div>
          <div className="bg-border h-7 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm" style={{ width: `${r.pct}%`, background: r.color ?? "hsl(var(--primary))" }} />
          </div>
          <div className="font-body text-xs text-text-tertiary">{r.val}</div>
        </div>
      ))}
    </div>
  </div>
);

const StatGrid = ({ stats }: { stats: { num: string; desc: string; source: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden my-8">
    {stats.map((s) => (
      <div key={s.num + s.desc} className="bg-card p-6 text-center">
        <span className="font-heading text-4xl text-primary block leading-none mb-2">{s.num}</span>
        <span className="text-text-secondary text-xs leading-snug block">{s.desc}</span>
        <span className="font-body text-[0.6rem] tracking-[0.05em] uppercase text-text-tertiary mt-2 block">{s.source}</span>
      </div>
    ))}
  </div>
);

const DataTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-8 rounded-lg border border-border">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-card">
          {headers.map((h) => (
            <th key={h} className="p-3 text-left font-body text-[0.65rem] tracking-[0.1em] uppercase text-text-tertiary font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
            {row.map((cell, j) => (
              <td key={j} className={`p-3 border-t border-border leading-relaxed ${j === 0 ? "font-semibold text-accent text-xs whitespace-nowrap" : "text-text-secondary"}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ════════════════════════════════════════════════════════════ */

const ContentPlaybook = () => {
  useMetaTags({
    title: "Content Marketing Playbook 2026/2027 | Earworm",
    description: "Top-of-funnel content that creates revenue, not just reach. Built for B2B and high-consideration brands navigating a buyer-led, AI-shaped, video-first world.",
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── HERO ── */}
      <header className="relative bg-card overflow-hidden py-24 md:py-32 px-6">
        {/* subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px)" }} />
        <div className="blob-green absolute -top-40 -right-40 w-[500px] h-[500px]" />

        <div className="relative max-w-5xl mx-auto">
          <div className="font-body text-xs tracking-[0.18em] uppercase text-primary mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-primary inline-block" />
            Senior Marketer Edition
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
            The Content Playbook<br />for <span className="text-gradient-green">2026 / 2027</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-10">
            Top-of-funnel content that creates revenue, not just reach. Built for B2B and high-consideration brands navigating a buyer-led, AI-shaped, video-first world.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 border border-border rounded-lg overflow-hidden">
            {[
              { num: "95%", label: "of B2B buyers are not in-market at any given moment", src: "Edelman" },
              { num: "67%", label: "of B2B buyers now prefer a rep-free experience", src: "Gartner" },
              { num: "95%", label: "of hidden decision-makers say strong thought leadership makes them more receptive to outreach", src: "Edelman/LinkedIn" },
            ].map((s) => (
              <div key={s.num + s.label} className="bg-background/40 backdrop-blur p-5 text-center">
                <span className="font-heading text-3xl text-primary block leading-none mb-1">{s.num}</span>
                <span className="text-text-tertiary text-xs leading-snug">{s.label} <em className="opacity-50 not-italic">({s.src})</em></span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── SECTIONS ── */}
      <main className="max-w-5xl mx-auto px-6 md:px-10">

        {/* ── 01 STRATEGY ── */}
        <section className="py-20 border-b border-border" id="strategy">
          <SectionNum>01 — The Strategic Model</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">Win minds before<br />buyers raise hands</h2>
          <p className="text-text-secondary leading-relaxed mb-4">The big shift is this: TOFU is no longer mainly about "awareness." It is about <strong className="text-text-primary">shaping buyer preference before a buyer is ready to talk to sales.</strong> The teams that win in 2026/2027 will look less like blog factories and more like a hybrid of newsroom, studio, and measurement lab.</p>
          <Pullquote>"The most important content moment is not when a buyer reaches out. It is the six months before they do."</Pullquote>
          <p className="text-text-secondary leading-relaxed mb-4">CMI's top performers attribute their success to a clear set of factors. Here's how they rank:</p>

          <BarChart
            title="Top-performer success factors — B2B content marketers (CMI)"
            rows={[
              { label: "Understanding the audience", pct: 82, val: "82%" },
              { label: "Producing high-quality content", pct: 77, val: "77%" },
              { label: "Possessing industry expertise", pct: 70, val: "70%" },
              { label: "Aligning to business objectives", pct: 62, val: "62%", color: "hsl(var(--accent))" },
              { label: "Measuring performance effectively", pct: 53, val: "53%", color: "hsl(var(--accent))" },
              { label: "Having a documented strategy", pct: 47, val: "47%", color: "hsl(var(--accent))" },
            ]}
          />

          <h2 className="text-2xl md:text-4xl mt-10 mb-6">The five strategic rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden my-8">
            {[
              { n: "01", t: "Build memory before demand capture", d: "Create recall, trust, and internal advocacy among buyers who are not ready to convert yet." },
              { n: "02", t: "Treat video podcasting as the hub", d: "Long-form creates conviction. Short-form creates discovery. Written assets create retrieval." },
              { n: "03", t: "Optimise for forwardability", d: "The most valuable clip is often the one pasted into Slack, WhatsApp, or a buying-committee deck - not the one with the most likes." },
              { n: "04", t: "Use hosts as trust infrastructure", d: "In 2026/2027, the host is the trust interface between brand and buyer - not just talent." },
            ].map((r) => (
              <div key={r.n} className="bg-background p-5 flex gap-4 items-start">
                <span className="font-body text-2xl text-primary font-medium leading-none shrink-0">{r.n}</span>
                <div>
                  <div className="font-semibold text-sm text-text-primary mb-1">{r.t}</div>
                  <p className="text-xs text-text-tertiary leading-relaxed m-0">{r.d}</p>
                </div>
              </div>
            ))}
            <div className="bg-background p-5 flex gap-4 items-start md:col-span-2">
              <span className="font-body text-2xl text-primary font-medium leading-none shrink-0">05</span>
              <div>
                <div className="font-semibold text-sm text-text-primary mb-1">Measure influence, not just last-click source purity</div>
                <p className="text-xs text-text-tertiary leading-relaxed m-0">Perfect attribution is fantasy. Decision-grade attribution is enough. Build for probabilistic measurement from the start.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 VIDEO ── */}
        <section className="py-20 border-b border-border" id="video">
          <SectionNum>02 — Video as the Content Nucleus</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">Video is no longer<br />a supporting asset</h2>
          <p className="text-text-secondary leading-relaxed mb-4">HubSpot's 2026 data is unambiguous: the three highest-ROI content formats are all video-based. YouTube now reports over 700 million hours of podcast content watched on living-room devices in October 2025. The flagship content asset for 2026/2027 should be a <strong className="text-text-primary">video podcast or episodic show.</strong></p>

          <BarChart
            title="Highest-ROI content formats — 2026 (HubSpot)"
            rows={[
              { label: "Short-form video", pct: 97, val: "48.6%", color: "hsl(var(--accent))" },
              { label: "Long-form video", pct: 57, val: "28.6%", color: "hsl(var(--accent))" },
              { label: "Live-streaming video", pct: 50, val: "25.1%", color: "hsl(var(--accent))" },
              { label: "Blog / written content", pct: 38, val: "~19%", color: "hsl(var(--muted-foreground))" },
              { label: "Infographics / visual", pct: 28, val: "~14%", color: "hsl(var(--muted-foreground))" },
            ]}
          />

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">The four-layer content system</h3>
          <p className="text-text-secondary leading-relaxed mb-6">One flagship episode should systematically generate content across all four layers. This is not a content calendar - it is a production system.</p>

          <div className="flex flex-col gap-1 my-8">
            {[
              { emoji: "🎬", label: "Flagship Episode - 35-75 min", w: "100%", bg: "hsl(var(--foreground))", desc: "" },
              { emoji: "✂️", label: "Mid-form Segments - 5-15 min", w: "85%", bg: "hsl(var(--accent))", desc: "Conversion & nurture layer - 5-30 min videos average a 10% conversion rate (Wistia)" },
              { emoji: "📱", label: "Short-form Clips - 15-90 sec", w: "65%", bg: "hsl(var(--primary))", desc: "Discovery & dark-social forwarding - Under-1-min videos average 50% engagement (Wistia)" },
              { emoji: "📄", label: "Written Companion Assets", w: "50%", bg: "hsl(145, 60%, 25%)", desc: "Search, AI retrieval & internal shareability" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-4">
                <div className="h-16 rounded-sm flex items-center px-4 text-white font-medium text-sm shrink-0" style={{ width: l.w, background: l.bg, maxWidth: "100%" }}>
                  {l.emoji}&nbsp; {l.label}
                </div>
                {l.desc && <div className="text-xs text-text-tertiary leading-snug hidden md:block">{l.desc}</div>}
              </div>
            ))}
          </div>

          <Callout label="Operating Rule">
            <strong className="text-text-primary">One episode → One full show + 3-5 mid-form cuts + 8-20 short clips + 1 article/memo + 1 email + 1 sales-forwardable asset</strong>
          </Callout>
        </section>

        {/* ── 03 TRUST ── */}
        <section className="py-20 border-b border-border" id="trust">
          <SectionNum>03 — Parasocial Trust</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">Design for parasocial<br />connection deliberately</h2>
          <p className="text-text-secondary leading-relaxed mb-4">Parasocial trust is not fluff. It is a demand-creation mechanism. Spotify's data makes the case plainly:</p>

          <StatGrid stats={[
            { num: "42%", desc: "of podcast listeners trust their favourite hosts as much as they trust their friends", source: "Spotify" },
            { num: "59%", desc: "of podcast listeners feel more connected to podcast hosts than to social media influencers", source: "Spotify" },
            { num: "22%", desc: "of monthly listeners made an immediate purchase after hearing a podcast ad in the past 6 months", source: "Spotify" },
          ]} />

          <DataTable
            headers={["Principle", "What it means in practice", "Why it matters"]}
            rows={[
              ["Recurring hosts", "One or two consistent hosts, not a parade of interchangeable spokespeople", "Trust compounds with familiarity"],
              ["Host has a real job", "Translate complexity, frame stakes, ask the question the buyer is already asking", "Competence + relatability = credibility"],
              ["Human texture", "Let the host show working, uncertainty, judgment, lived experience", "Over-scripted brand content kills trust"],
              ["Recognisable rituals", "Recurring segments, repeated opening questions, \"what's everyone getting wrong\"", "Repetition makes the show easy to remember and forward"],
              ["Protect the relationship", "No forced sponsor logic, no bait-and-switch hooks, no synthetic \"thought leadership voice\"", "Parasocial trust compounds slowly - and collapses quickly"],
            ]}
          />
        </section>

        {/* ── 04 TOFU ── */}
        <section className="py-20 border-b border-border" id="tofu">
          <SectionNum>04 — Revenue-Grade TOFU</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">Top-of-funnel that<br />actually moves revenue</h2>
          <p className="text-text-secondary leading-relaxed mb-4">High-performing TOFU is not generic educational content. It is content that helps the buyer group see the problem, explain the stakes internally, and justify a direction.</p>

          <StatGrid stats={[
            { num: "91%", desc: "say high-quality thought leadership should provide fresh insights into their industry", source: "Edelman / LinkedIn" },
            { num: "86%", desc: "prefer provocative ideas that challenge assumptions", source: "Edelman / LinkedIn" },
            { num: "51%", desc: "say high-quality thought leadership helps them persuade C-level executives internally", source: "Edelman / LinkedIn" },
          ]} />

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">What hidden buyers care about at final vendor selection</h3>

          <BarChart
            title="Hidden buyer priorities at final vendor selection (Edelman/LinkedIn 2025)"
            rows={[
              { label: "Understanding our challenges & needs", pct: 85, val: "85%", color: "hsl(160, 50%, 35%)" },
              { label: "Strategic fit", pct: 76, val: "76%", color: "hsl(160, 50%, 35%)" },
              { label: "Understanding industry trends", pct: 74, val: "74%", color: "hsl(160, 50%, 35%)" },
              { label: "Relevant expertise", pct: 68, val: "68%", color: "hsl(160, 50%, 35%)" },
              { label: "Being the \"safest choice\"", pct: 41, val: "41%", color: "hsl(var(--muted-foreground))" },
            ]}
          />

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">The TOFU format portfolio</h3>
          <div className="flex flex-col gap-px bg-border border border-border rounded-lg overflow-hidden my-8">
            {[
              { name: "Category Reframes", desc: "Content that explains why the old mental model is broken. This is how you create \"why change.\"" },
              { name: "Buyer-Committee Translation", desc: "Episodes and articles that explain what finance, security, ops, or procurement will care about. Arms champions for internal conversations." },
              { name: "Diagnostic Teardowns", desc: "Break down why launches fail, why attribution breaks, why implementations stall. Diagnose before you prescribe." },
              { name: "Benchmarks & Research Drops", desc: "Original data gives buyers language, numbers, and charts they can reuse in internal decks. Earns search ranking as a bonus." },
              { name: "Contrarian Debates", desc: "Two smart people disagree respectfully. Content that generates saves, forwards, and internal discussion." },
              { name: "Buyer Guides", desc: "\"How leaders should evaluate X in 2026.\" Feels like TOFU, secretly a sales acceleration asset. Write it for internal forwarding." },
            ].map((f, i) => (
              <div key={f.name} className={`p-4 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 md:gap-6 items-start ${i % 2 ? "bg-secondary/30" : "bg-background"}`}>
                <div className="font-semibold text-sm text-accent">{f.name}</div>
                <p className="text-xs text-text-tertiary leading-relaxed m-0">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Formula box */}
          <div className="bg-card border border-border rounded-lg p-8 my-10 text-center">
            <div className="font-body text-[0.65rem] tracking-[0.15em] uppercase text-text-tertiary mb-4">The TOFU Content Formula</div>
            <div className="font-heading text-xl md:text-2xl italic text-text-primary leading-relaxed">
              <span className="text-primary">Teach</span> + <span className="text-primary">Diagnose</span> + <span className="text-primary">Reframe</span> + <span className="text-primary">Equip</span> + <span className="text-primary">Invite</span>
            </div>
            <p className="text-text-tertiary text-xs mt-3 mb-0">If the content doesn't give the buyer something they can reuse internally, it's probably not revenue-grade TOFU yet.</p>
          </div>
        </section>

        {/* ── 05 DARK SOCIAL ── */}
        <section className="py-20 border-b border-border" id="dark-social">
          <SectionNum>05 — Dark Social</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">What dark social is<br />and why it matters</h2>
          <p className="text-text-secondary leading-relaxed mb-4">Dark social is what happens when your content moves through private or referrer-obscured spaces: WhatsApp, Slack, Teams, DMs, text messages, forwarded emails, copied links, and internal docs.</p>

          <Callout label="Key Insight">
            In a SparkToro experiment covering 1,113 visits across 11 social networks, <strong className="text-text-primary">100% of visits from TikTok, Slack, Discord, Mastodon, and WhatsApp were marked as "direct" in Google Analytics.</strong> Your analytics platform is structurally undercounting content-driven traffic.
          </Callout>

          <BarChart
            title={'Attribution loss by channel — % of visits appearing as "(direct)" in GA (SparkToro)'}
            rows={[
              { label: "TikTok", pct: 100, val: "100%" },
              { label: "Slack", pct: 100, val: "100%" },
              { label: "Discord", pct: 100, val: "100%" },
              { label: "WhatsApp", pct: 100, val: "100%" },
              { label: "FB Messenger", pct: 75, val: "75%", color: "hsl(var(--accent))" },
              { label: "Instagram DMs", pct: 60, val: "~60%", color: "hsl(var(--accent))" },
            ]}
          />

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">Six ways to make dark social measurable</h3>
          <DataTable
            headers={["Tactic", "Implementation", "What it tells you"]}
            rows={[
              ["UTM taxonomy", "Episode-, guest-, and host-specific URLs with pre-tagged share buttons", "Where private shares originate"],
              ["Deep landing pages", "Link to specific episode pages, not homepage. Long slugs make \"direct\" traffic diagnostic", "Spikes in direct = dark-social movement"],
              ["Self-reported attribution", "\"Where did you first hear about us?\" - include podcast, colleague, forwarded link options", "What your analytics can't see"],
              ["Sales involvement", "\"How did this account hear about us?\" as a required CRM field", "Content touches invisible to marketing"],
              ["Dark-social proxies", "Branded search lift after episode drops, copy-link click volume, clip-to-site visit rate", "Directional signal of private sharing"],
              ["Cohort & lift analysis", "Exposed vs. unexposed accounts: compare meeting rate, win rate, cycle length, ACV", "TOFU's financial legibility"],
            ]}
          />

          <Pullquote>Deterministic where possible. Probabilistic where necessary. Commercial at the end.</Pullquote>
        </section>

        {/* ── 06 MEASUREMENT ── */}
        <section className="py-20 border-b border-border" id="measurement">
          <SectionNum>06 — Measurement</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">The four-layer<br />measurement scorecard</h2>
          <p className="text-text-secondary leading-relaxed mb-4">Your scorecard should move from attention quality all the way to revenue impact. Never report impressions, views, and MQLs in a vacuum and call that content ROI.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden my-8">
            {[
              { label: "Layer 1 — Attention Quality", color: "text-primary", items: ["Watch time & average % viewed", "Consumption hours", "Completion rate", "Returning viewers", "Live watch behaviour"] },
              { label: "Layer 2 — Relationship Depth", color: "text-accent", items: ["Follower / subscriber growth", "Repeat viewers", "Newsletter opt-ins", "Comments, saves, audience participation", "Episode-to-episode retention"] },
              { label: "Layer 3 — Dark-Funnel Movement", color: "text-text-secondary", items: ["Direct deep-link ratio", "Branded search lift", "Self-reported mentions", "Episode-assist rate in CRM", "Copy-link click volume"] },
              { label: "Layer 4 — Revenue Impact", color: "text-yellow-500", items: ["Opportunity creation (influenced)", "Exposed-account win rate lift", "Sales-cycle compression", "ACV delta: exposed vs. unexposed", "Influenced pipeline per content pillar"] },
            ].map((q) => (
              <div key={q.label} className="bg-background p-5">
                <div className={`font-body text-[0.65rem] tracking-[0.12em] uppercase ${q.color} mb-3 pb-2 border-b border-border`}>{q.label}</div>
                <ul className="space-y-1">
                  {q.items.map((item) => (
                    <li key={item} className="text-xs text-text-secondary flex items-baseline gap-2">
                      <span className="font-body text-[0.7rem] opacity-40 shrink-0">→</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">Advanced KPI stack</h3>
          <DataTable
            headers={["KPI", "Scorecard Layer", "Why it matters"]}
            rows={[
              ["Return viewer rate", "Attention + Relationship", "Proxy for audience loyalty and future consumption"],
              ["Follower / subscriber growth", "Relationship", "Spotify: followers consume 4× more episodes than non-followers"],
              ["Direct deep-link ratio", "Dark Funnel", "Reveals private sharing behaviour that GA hides"],
              ["Self-reported source %", "Dark Funnel", "Captures influence your attribution stack cannot see"],
              ["Episode mention rate in CRM", "Dark Funnel + Revenue", "Links specific content to specific accounts"],
              ["Exposed account meeting-rate lift", "Revenue", "Shows whether content improves sales access"],
              ["Exposed account win-rate lift", "Revenue", "The most commercially credible TOFU metric"],
              ["Influenced pipeline per pillar", "Revenue", "Informs content investment allocation"],
            ]}
          />
        </section>

        {/* ── 07 EXECUTION ── */}
        <section className="py-20" id="execution">
          <SectionNum>07 — Team, Process & AI</SectionNum>
          <h2 className="text-3xl md:text-5xl mb-8">The studio with<br />revenue ops attached</h2>
          <p className="text-text-secondary leading-relaxed mb-4">Wistia says over 40% of companies create at least one video per week, almost 60% are increasing video budgets, and 71% now handle video production in-house. CMI says 45% of B2B marketers still lack a scalable model for content creation. <strong className="text-text-primary">That gap is your opportunity.</strong></p>

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">Minimum viable team</h3>
          <DataTable
            headers={["Role", "Core responsibility", "Key output"]}
            rows={[
              ["Editorial Lead / Showrunner", "Owns the show thesis, editorial calendar, and guest selection", "Narrative coherence, production rhythm"],
              ["Host or Host Pair", "Creates intimacy, credibility, and emotional recall", "Trust interface with the audience"],
              ["Producer-Editor", "Records, edits, clips - runs the production system", "Full episode + all derivative formats"],
              ["Distribution Lead", "Manages publication, scheduling, platform optimisation", "Multi-platform reach and consistency"],
              ["Designer / Motion", "Thumbnails, captions, graphics, short-form visual identity", "Scroll-stopping visual assets"],
              ["Marketing Ops / Analytics", "UTM architecture, attribution, scorecard, CRM integration", "Dark-social visibility + pipeline reporting"],
              ["Sales Liaison", "Trains reps on clip usage, feeds back CRM mentions", "Content reach into active sales conversations"],
            ]}
          />

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">AI: right use cases vs. wrong use cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden my-8">
            <div className="bg-background p-5">
              <div className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-primary mb-3 pb-2 border-b border-border">✓ Right use cases</div>
              <ul className="space-y-1">
                {["Transcript cleanup and chaptering", "Title and headline variants", "Clip selection suggestions", "Metadata, captions, translation", "Repurposing drafts from episode summaries", "Research clustering"].map((item) => (
                  <li key={item} className="text-xs text-text-secondary">✓ {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary/30 p-5">
              <div className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-destructive mb-3 pb-2 border-b border-border">✕ Wrong use cases</div>
              <ul className="space-y-1">
                {["Outsourcing your point of view", "Manufacturing originality at scale", "Replacing host voice with synthetic tone", "Publishing unreviewed AI copy as thought leadership"].map((item) => (
                  <li key={item} className="text-xs text-text-secondary">✕ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <Callout label="Context">
            HubSpot 2026: 80% of marketers use AI for content creation. CMI: only 4% have a high level of trust in AI output, and 43% already struggle to differentiate their content. <strong className="text-text-primary">Use AI to remove toil - not to manufacture your point of view.</strong>
          </Callout>

          <h3 className="text-lg md:text-2xl mt-10 mb-5 text-text-primary">The 90-day rollout</h3>
          <div className="relative my-8 ml-4 md:ml-20 border-l border-border pl-8">
            {[
              { period: "Days 1-30", title: "Foundation & Strategy", items: ["Define ICP, buying jobs, hidden buyers, show thesis, host roles", "Build the measurement framework", "Lock UTM taxonomy and self-reported attribution questions before publishing anything"] },
              { period: "Days 31-60", title: "Production & Systems", items: ["Record four to six episodes before launch", "Build template systems: full episodes, segment cuts, shorts, articles, thumbnails, captions, sales one-pagers", "Train sales on how to use clips in outreach and follow-up"] },
              { period: "Days 61-90", title: "Launch & Iterate", items: ["Launch in batches, not as one-off hero content", "Watch for direct traffic to deep pages, branded search movement, self-reported mentions, repeat viewers", "Double down on themes that get forwarded privately - not just publicly applauded"] },
            ].map((tl) => (
              <div key={tl.period} className="relative mb-10">
                <div className="absolute -left-[2.55rem] top-1.5 w-2 h-2 bg-primary rounded-full" />
                <div className="font-body text-xs text-primary tracking-wide mb-1">{tl.period}</div>
                <div className="font-semibold text-sm text-text-primary mb-2">{tl.title}</div>
                <ul className="space-y-1">
                  {tl.items.map((item) => (
                    <li key={item} className="text-xs text-text-tertiary pl-4 relative before:content-['—'] before:absolute before:left-0 before:opacity-40">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="py-16 text-center border-t border-border">
          <h2 className="text-2xl md:text-4xl italic mb-4">Content that drives sales looks like trust media.</h2>
          <div className="w-10 h-px bg-primary mx-auto my-6" />
          <p className="text-text-tertiary text-sm max-w-2xl mx-auto leading-relaxed">Strong point of view. Strong host. Strong long-form core. Aggressive short-form distribution. Low-friction private sharing. Measurement built for imperfect visibility. The teams that accept that reality earlier will beat the teams still trying to force every buying journey into last-click analytics.</p>
          <div className="w-10 h-px bg-primary mx-auto my-6" />
          <p className="text-text-tertiary text-xs">Content Marketing Playbook 2026/2027 — Sources: Edelman, Gartner, HubSpot, CMI, Wistia, Spotify, YouTube, SparkToro, Edison Research, LinkedIn</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContentPlaybook;

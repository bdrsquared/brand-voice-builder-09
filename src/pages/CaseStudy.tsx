import { lazy, Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import useMetaTags from "@/hooks/useMetaTags";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import casePrettyCoveredHero from "@/assets/case-pretty-covered-hero-new.webp";
import casePrettyCoveredBts1 from "@/assets/case-pretty-covered-bts1.webp";
import casePrettyCoveredBts2 from "@/assets/case-pretty-covered-bts2.webp";
import casePrettyCoveredBts3 from "@/assets/case-pretty-covered-bts3.webp";
import casePrettyCoveredBts4 from "@/assets/case-pretty-covered-bts4.webp";
import caseIgHero from "@/assets/case-ig-bts-studio.webp";
import caseIgBtsControl from "@/assets/case-ig-bts-control.webp";
import caseIgLogoArt from "@/assets/case-ig-logo-art.webp";
import caseIgMarketChaos from "@/assets/case-ig-market-chaos.webp";
import caseIgOrigami from "@/assets/case-ig-origami.jpg";
import caseNostressHero from "@/assets/case-nostress-hero.webp";
import caseNostressBtsWide from "@/assets/case-nostress-bts-wide.webp";
import caseNostressBtsGuest from "@/assets/case-nostress-bts-guest.webp";
import caseNostressBtsHost from "@/assets/case-nostress-bts-host.webp";
import caseNostressBranded from "@/assets/case-nostress-branded.webp";
import caseNostressSpeaker from "@/assets/case-nostress-speaker.webp";
import caseSoldoHero from "@/assets/case-soldo-hero.webp";
import caseSoldoHost from "@/assets/case-soldo-host.webp";
import caseSoldoEvent from "@/assets/case-soldo-event.webp";
import caseSoldoSkyline from "@/assets/case-soldo-skyline.webp";
import caseSoldoGuest from "@/assets/case-soldo-guest.webp";
import caseSoldoBags from "@/assets/case-soldo-bags.webp";

const CaseStudyHero = lazy(() => import("@/components/case-study/CaseStudyHero"));
const CaseStudyImpact = lazy(() => import("@/components/case-study/CaseStudyImpact"));
const CaseStudyEpisodes = lazy(() => import("@/components/case-study/CaseStudyEpisodes"));
const CaseStudyApproach = lazy(() => import("@/components/case-study/CaseStudyApproach"));
const CaseStudyBTS = lazy(() => import("@/components/case-study/CaseStudyBTS"));
const CaseStudySummary = lazy(() => import("@/components/case-study/CaseStudySummary"));
const CaseStudyCTA = lazy(() => import("@/components/case-study/CaseStudyCTA"));
const Footer = lazy(() => import("@/components/landing/Footer"));

export interface CaseStudyData {
  slug: string;
  showName: string;
  clientName: string;
  tagline: string;
  heroImage: string;
  heroObjectPosition?: string;
  stats: { label: string; value: string }[];
  impacts: { title: string; description: string }[];
  episodes: {
    thumbnail: string;
    title: string;
    guest: string;
    duration?: string;
  }[];
  approach: {
    title: string;
    description: string;
  }[];
  btsImages: string[];
  summary: {
    challenge: string;
    solution: string;
    result: string;
  };
}

// Demo data  -  swap per client
const caseStudies: Record<string, CaseStudyData> = {
  "pretty-covered": {
    slug: "pretty-covered",
    showName: "Pretty Covered",
    clientName: "Polly",
    tagline: "How Polly used podcasting to make life insurance feel human and accessible, positioning the brand as a trusted voice while generating measurable leads through emotionally resonant content.",
    heroImage: casePrettyCoveredHero,
    heroObjectPosition: "center 40%",
    stats: [
      { label: "Social engagement", value: "Strong" },
      { label: "Brand time spent", value: "High" },
      { label: "Early lead generation", value: "Exceeded target" },
    ],
    impacts: [
      { title: "Built trust through real stories", description: "Positioned Polly as a brand that leads with empathy — not jargon — by anchoring insurance in honest, human conversations." },
      { title: "Made insurance feel relevant earlier", description: "Helped younger audiences see protection as something for real life now, not something to think about later." },
      { title: "Turned the podcast into a content engine", description: "Created a repeatable format that delivered full episodes, social cutdowns and education-led brand content." },
      { title: "Strengthened Polly's role in the category", description: "Gave Polly a distinctive platform in protection — blending awareness, trust-building and thought leadership." },
    ],
    episodes: [
      { thumbnail: casePrettyCoveredBts1, title: "Kelsey Parker: Living Through the Unthinkable", guest: "Kelsey Parker" },
      { thumbnail: casePrettyCoveredBts2, title: "Lauren Mahon: From Diagnosis to GIRLvsCANCER", guest: "Lauren Mahon" },
      { thumbnail: casePrettyCoveredBts3, title: "Selina Flavius: The Financial Fallout of Grief", guest: "Selina Flavius" },
    ],
    approach: [
      { title: "Strategy", description: "Defined audience, positioning, and a content thesis that aligned with Polly's growth goals." },
      { title: "Creative direction", description: "Developed the show brand, set design, and visual language to resonate with a younger audience." },
      { title: "Guest mapping", description: "Identified and booked high-value guests from target accounts and adjacent industries." },
      { title: "Production", description: "End-to-end video and audio production with a 48-hour turnaround on hero clips." },
    ],
    btsImages: [
      casePrettyCoveredBts1,
      casePrettyCoveredBts2,
      casePrettyCoveredBts3,
      casePrettyCoveredBts4,
    ],
    summary: {
      challenge: "Polly wanted to make life insurance feel human and accessible, positioning the brand as a trusted voice while generating measurable leads through emotionally resonant content.",
      solution: "We developed the Pretty Covered concept around real-life stories and financial protection, delivering a monthly in-person video and audio podcast with full guest sourcing, media coaching, end-to-end production, editing, distribution, and performance reporting. Supporting the pilot phase, we also led a social-first growth strategy, creating 22+ short-form clips designed to drive both paid and organic lead generation.",
      result: "The pilot delivered strong early results with social engagement exceeding expectations, cost per lead well below target, and deep audience engagement through high consumption rates and significant time spent with the brand. Following overwhelmingly positive audience feedback on Episode 1, the series was extended into a 12-month production cycle.",
    },
  },
  "the-art-of-investing": {
    slug: "the-art-of-investing",
    showName: "The Art of Investing",
    clientName: "IG",
    tagline: "How IG used podcasting to cut through market noise and make complex financial topics accessible, engaging, and relevant to a broad audience.",
    heroImage: caseIgHero,
    heroObjectPosition: "center 30%",
    stats: [
      { label: "Audience growth", value: "Consistent" },
      { label: "Listener engagement", value: "Strong" },
      { label: "Content consumption", value: "High" },
    ],
    impacts: [
      { title: "Made investing feel clearer and more accessible", description: "Turned complex market movements into straightforward weekly conversations, helping audiences make sense of investing without the usual noise or jargon." },
      { title: "Built trust through consistent expert insight", description: "Positioned IG as a credible, dependable voice in investing by showing up weekly with informed analysis, real market context and practical perspective." },
      { title: "Turned the show into a repeatable content engine", description: "Created a scalable format that delivered long-form episodes, high-performing video content, social cutdowns and ongoing educational assets from every recording." },
      { title: "Strengthened IG's role in the investing space", description: "Gave IG a distinctive branded platform that blended education, commentary and audience engagement, supporting both thought leadership and long-term brand affinity." },
    ],
    episodes: [
      { thumbnail: caseIgOrigami, title: "The Art of Investing — Series Overview", guest: "IG Group", duration: "45 min" },
      { thumbnail: caseIgLogoArt, title: "Turning the market chaos", guest: "Weekly market update", duration: "38 min" },
      { thumbnail: caseIgMarketChaos, title: "Buy, sell or hold?", guest: "Investment strategy", duration: "42 min" },
    ],
    approach: [
      { title: "Strategy", description: "Defined a weekly format focused on timely market updates and portfolio performance, aligning content with how investors actively track and respond to market movements." },
      { title: "Creative direction", description: "Developed a clean, editorial-style format built for clarity and consistency, making fast-moving financial updates easy to follow and visually engaging." },
      { title: "Content structure", description: "Built the show around a recurring portfolio and weekly market narrative, giving audiences a familiar framework to understand performance, trends and decision-making." },
      { title: "Production", description: "Delivered a consistent weekly production cycle with rapid turnaround, ensuring content stayed relevant to live market conditions and recent developments." },
    ],
    btsImages: [
      caseIgBtsControl,
      caseIgLogoArt,
      caseIgMarketChaos,
      caseIgOrigami,
    ],
    summary: {
      challenge: "IG needed to cut through market noise and make complex financial topics accessible, engaging, and relevant to a broad audience.",
      solution: "Earworm developed a video-first podcast strategy focused on timely macro themes, supported by full-service production, guest coaching, and a consistent social distribution engine.",
      result: "The show delivered strong download growth, consistent YouTube performance, and high engagement rates, successfully positioning IG as a leading voice in modern investing.",
    },
  },
  "no-stress": {
    slug: "no-stress",
    showName: "No Stress",
    clientName: "Pulsetto",
    tagline: "How Pulsetto used podcasting to reframe their brand from a wellness gadget into a stress resilience platform built for high performers.",
    heroImage: caseNostressHero,
    heroObjectPosition: "center 40%",
    stats: [
      { label: "YouTube performance", value: "Strong" },
      { label: "Audio consumption", value: "High" },
      { label: "Combined guest reach", value: "Growing" },
    ],
    impacts: [
      { title: "Reframed the brand around stress fitness", description: "Helped Pulsetto turn its product story into a broader stress fitness platform, repositioning from a wellness gadget into a tool for training resilience." },
      { title: "Built a show for high performers under pressure", description: "Created a show built for athletes, founders, busy professionals and people recovering from burnout — anyone training their stress response." },
      { title: "Established a repeatable content engine", description: "Delivered a scalable format combining video episodes, audio distribution, social teasers, and branded thumbnail systems from every recording." },
      { title: "Elevated Pulsetto's visual identity", description: "Gave Pulsetto a more premium and consistent visual identity through dynamic guest-led thumbnails, brand green motion backgrounds, and a text-led logo system." },
    ],
    episodes: [
      { thumbnail: caseNostressSpeaker, title: "Building Stress Resilience Like a Muscle", guest: "Expert interview", duration: "52 min" },
      { thumbnail: caseNostressBranded, title: "Tired But Wired? The Real Reason You Cannot Switch Off", guest: "Science-backed conversation", duration: "48 min" },
      { thumbnail: caseNostressHero, title: "Stress Resilience: The Real Edge in Competitive Sport", guest: "Dr Josephine Perry", duration: "55 min" },
    ],
    approach: [
      { title: "Editorial strategy", description: "The show was built around a clear editorial idea: stress is trainable. Earworm and Pulsetto framed the podcast around practical, science-backed conversations that help listeners become calmer and more resilient under pressure." },
      { title: "Production format", description: "Episodes were structured as 45–60 minute in-person interviews, recorded at MediaWorkHouse in Cricklewood, with a host-led conversation format and clear guest briefings." },
      { title: "Content approach", description: "The production approach blended expert guests, science-backed talking points, and actionable listener takeaways, making the show useful for both performance-focused and wellness-focused audiences." },
      { title: "Visual identity", description: "The visual package was designed to feel premium and recognisable, using podcast-shot thumbnails, Pulsetto's brand green, 3D pulse backgrounds, and a simplified text-led logo treatment." },
    ],
    btsImages: [
      caseNostressBtsWide,
      caseNostressBtsGuest,
      caseNostressBtsHost,
      caseNostressBranded,
    ],
    summary: {
      challenge: "Pulsetto needed a content platform that could move the brand beyond generic wellness messaging and position it around a more ownable, expert-led conversation on stress resilience, recovery, and nervous system regulation.",
      solution: "We developed No Stress as a branded video-first and audio podcast, pairing expert guests with a consistent 'stress fitness' narrative, in-person studio production, strong episode briefing, and a premium visual identity optimised for YouTube and social distribution.",
      result: "The highlighted YouTube episodes generated strong viewership with high consumption rates, showing excellent early engagement. The content gives Pulsetto a reusable brand platform for ongoing expert-led storytelling.",
    },
  },
  "the-cfo-playbook": {
    slug: "the-cfo-playbook",
    showName: "The CFO Playbook",
    clientName: "Soldo",
    tagline: "How Soldo used podcasting to position as a thought leader with CFOs and turn content into meaningful qualified pipeline.",
    heroImage: caseSoldoHero,
    heroObjectPosition: "center 30%",
    stats: [
      { label: "Audio downloads", value: "Growing" },
      { label: "Social clip reach", value: "Consistent" },
      { label: "Pipeline ROI", value: "Measurable" },
    ],
    impacts: [
      { title: "Positioned Soldo at the centre of CFO conversations", description: "Established Soldo as a credible voice for finance leaders by building a show around the priorities, challenges and perspectives of senior CFOs." },
      { title: "Created a high-value thought leadership platform", description: "Gave the brand a consistent way to engage senior decision-makers through insight-led content that felt authoritative, relevant and commercially meaningful." },
      { title: "Built a scalable content engine for marketing and sales", description: "Turned each episode into a wider stream of usable content, helping the podcast support brand awareness, audience engagement and pipeline conversations across channels." },
      { title: "Reduced internal lift while increasing output", description: "Delivered a true 'podcast on autopilot' model, allowing Soldo's team to benefit from a high-impact content programme without adding operational strain internally." },
    ],
    episodes: [
      { thumbnail: caseSoldoHost, title: "Why Operational CFOs Win: Strategy, Speed, and Leading Through Change", guest: "Tom DiDesidero", duration: "45 min" },
      { thumbnail: caseSoldoGuest, title: "From Metrics to Meaning: Building a Customer-Centric Finance Org", guest: "Senior CFO Guest", duration: "42 min" },
      { thumbnail: caseSoldoSkyline, title: "CFO Leadership: Asking Better Questions Instead of Saying No", guest: "John Glasgow", duration: "40 min" },
    ],
    approach: [
      { title: "Strategy", description: "Built as a virtual-first format to make the show accessible to senior CFOs globally, removing the barriers of travel, location and scheduling." },
      { title: "Host sourcing", description: "We sourced David McClelland as host, bringing a credible presence, strong interview style and a high-quality home recording setup that elevated the overall production value." },
      { title: "Guest mapping", description: "Focused on identifying and securing senior finance leaders from key markets, making it easier to bring global CFO perspectives into the series." },
      { title: "Production", description: "Created a polished remote production model that combined flexibility with consistency, giving Soldo a repeatable format they could continue investing in episode after episode." },
    ],
    btsImages: [
      caseSoldoHost,
      caseSoldoEvent,
      caseSoldoBags,
      caseSoldoSkyline,
    ],
    summary: {
      challenge: "Soldo wanted to be positioned as a thought-leader with CFOs and turn content into a qualified pipeline.",
      solution: "We developed The CFO Playbook from concept to delivery, producing monthly remote video episodes with tier-one CFO guests, while handling host and guest sourcing, production, editing, motion graphics, and supporting social assets. With a full 'podcast on autopilot' model and CRM-linked performance reporting, Earworm managed the entire process.",
      result: "In the first six months, The CFO Playbook delivered strong audio download growth, significant social clip reach, and meaningful attributed pipeline, delivering a strong ROI with high average listener retention.",
    },
  },
};

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? caseStudies[slug] : undefined;

  useMetaTags(data ? {
    title: `${data.showName} — ${data.clientName} Case Study | Earworm`,
    description: data.tagline,
  } : undefined);

  if (!data) return <Navigate to="/\" replace />;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CaseStudyHero data={data} />
        <CaseStudyImpact data={data} />
        
        <CaseStudyApproach data={data} />
        <CaseStudyBTS data={data} />
        <CaseStudySummary data={data} />
        <CaseStudyCTA />
        <Footer />
      </Suspense>
    </div>
  );
};

export default CaseStudy;

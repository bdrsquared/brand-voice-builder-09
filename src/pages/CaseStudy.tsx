import { lazy, Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import casePrettyCoveredHero from "@/assets/case-pretty-covered-hero.jpeg";
import caseIgHero from "@/assets/case-ig-bts-studio.png";
import caseIgBtsControl from "@/assets/case-ig-bts-control.jpg";
import caseIgLogoArt from "@/assets/case-ig-logo-art.png";
import caseIgMarketChaos from "@/assets/case-ig-market-chaos.png";
import caseIgOrigami from "@/assets/case-ig-origami.jpg";
import caseNostressHero from "@/assets/case-nostress-hero.png";
import caseNostressBtsWide from "@/assets/case-nostress-bts-wide.jpg";
import caseNostressBtsGuest from "@/assets/case-nostress-bts-guest.jpg";
import caseNostressBtsHost from "@/assets/case-nostress-bts-host.jpg";
import caseNostressBranded from "@/assets/case-nostress-branded.png";
import caseNostressSpeaker from "@/assets/case-nostress-speaker.png";
import caseSoldoHero from "@/assets/case-soldo-hero.png";
import caseSoldoHost from "@/assets/case-soldo-host.png";
import caseSoldoEvent from "@/assets/case-soldo-event.jpg";
import caseSoldoSkyline from "@/assets/case-soldo-skyline.png";
import caseSoldoGuest from "@/assets/case-soldo-guest.png";
import caseSoldoBags from "@/assets/case-soldo-bags.jpg";

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
    tagline: "How Polly used podcasting to connect with Gen Z audiences through authentic beauty and insurance conversations.",
    heroImage: casePrettyCoveredHero,
    heroObjectPosition: "25% center",
    stats: [
      { label: "Total impressions", value: "1.2M+" },
      { label: "Qualified leads", value: "500+" },
      { label: "Episodes produced", value: "24" },
    ],
    impacts: [
      { title: "Built authority in insurtech", description: "Positioned Polly as the go-to voice for Gen Z insurance  -  a space no competitor was owning." },
      { title: "Generated qualified pipeline", description: "Over 500 qualified leads attributed directly to podcast-driven content and guest referrals." },
      { title: "Created a content flywheel", description: "Each episode produced 12+ assets  -  clips, quotes, articles  -  fuelling 3 months of social content." },
      { title: "Opened strategic doors", description: "Guests included C-suite leaders from target accounts, turning interviews into warm introductions." },
    ],
    episodes: [
      { thumbnail: "/src/assets/case-pretty-covered.webp", title: "The future of beauty insurance", guest: "Sarah Mitchell", duration: "42 min" },
      { thumbnail: "/src/assets/case-pulsetto.webp", title: "Why Gen Z thinks differently about risk", guest: "James Chen", duration: "38 min" },
      { thumbnail: "/src/assets/case-cfo-playbook.webp", title: "Building trust with a new generation", guest: "Olivia Park", duration: "35 min" },
    ],
    approach: [
      { title: "Strategy", description: "Defined audience, positioning, and a content thesis that aligned with Polly's growth goals." },
      { title: "Creative direction", description: "Developed the show brand, set design, and visual language to resonate with a younger audience." },
      { title: "Guest mapping", description: "Identified and booked high-value guests from target accounts and adjacent industries." },
      { title: "Production", description: "End-to-end video and audio production with a 48-hour turnaround on hero clips." },
    ],
    btsImages: [
      "/src/assets/office-compressed.webp",
      "/src/assets/launch-microphone-compressed.webp",
      "/src/assets/run-scale-compressed.webp",
      "/src/assets/office-hero.webp",
    ],
    summary: {
      challenge: "Polly needed to build brand awareness with Gen Z  -  a demographic that ignores traditional advertising. They had no content engine and no presence in the conversation.",
      solution: "We created Pretty Covered  -  a video podcast that let Polly lead authentic conversations about beauty, risk, and modern life. Each episode was designed to produce a cascade of short-form content for social.",
      result: "1.2M+ impressions, 500+ qualified leads, and a brand that Gen Z audiences now actively seek out. The podcast became Polly's most effective top-of-funnel channel.",
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
      { label: "Total podcast downloads", value: "103,943" },
      { label: "Organic weekly listeners", value: "2,000+" },
      { label: "Average consumption rate", value: "82%" },
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
      result: "The show generated over 100K downloads, strong YouTube performance, and high engagement rates, successfully positioning IG as a leading voice in modern investing.",
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
      { label: "YouTube views across 3 episodes", value: "370K+" },
      { label: "Audio consumption rate", value: "66%" },
      { label: "Combined guest reach", value: "67K+" },
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
      result: "The three highlighted YouTube episodes total 370K+ views with a 66% consumption rate, showing strong early engagement. The content gives Pulsetto a reusable brand platform for ongoing expert-led storytelling.",
    },
  },
};

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? caseStudies[slug] : undefined;

  if (!data) return <Navigate to="/\" replace />;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CaseStudyHero data={data} />
        <CaseStudyImpact data={data} />
        <CaseStudyEpisodes data={data} />
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

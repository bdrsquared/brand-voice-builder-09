import { lazy, Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";

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

// Demo data — swap per client
const caseStudies: Record<string, CaseStudyData> = {
  "pretty-covered": {
    slug: "pretty-covered",
    showName: "Pretty Covered",
    clientName: "Polly",
    tagline: "How Polly used podcasting to connect with Gen Z audiences through authentic beauty and insurance conversations.",
    heroImage: "/src/assets/case-pretty-covered.webp",
    stats: [
      { label: "Total impressions", value: "1.2M+" },
      { label: "Qualified leads", value: "500+" },
      { label: "Episodes produced", value: "24" },
    ],
    impacts: [
      { title: "Built authority in insurtech", description: "Positioned Polly as the go-to voice for Gen Z insurance — a space no competitor was owning." },
      { title: "Generated qualified pipeline", description: "Over 500 qualified leads attributed directly to podcast-driven content and guest referrals." },
      { title: "Created a content flywheel", description: "Each episode produced 12+ assets — clips, quotes, articles — fuelling 3 months of social content." },
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
      challenge: "Polly needed to build brand awareness with Gen Z — a demographic that ignores traditional advertising. They had no content engine and no presence in the conversation.",
      solution: "We created Pretty Covered — a video podcast that let Polly lead authentic conversations about beauty, risk, and modern life. Each episode was designed to produce a cascade of short-form content for social.",
      result: "1.2M+ impressions, 500+ qualified leads, and a brand that Gen Z audiences now actively seek out. The podcast became Polly's most effective top-of-funnel channel.",
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

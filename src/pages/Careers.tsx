import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, GraduationCap, Zap, Users, Heart, Sparkles, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import DotsBackground from "@/components/landing/DotsBackground";
import Footer from "@/components/landing/Footer";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";

/* ───── animation ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

/* ───── data ───── */
const perks = [
  { icon: Zap, title: "Learn fast", desc: "Real responsibility from day one in a growing agency" },
  { icon: Users, title: "Small team", desc: "Build relationships quickly and have genuine impact" },
  { icon: Heart, title: "We love our clients", desc: "Their success is our success — and we mean it" },
  { icon: Sparkles, title: "Content is king", desc: "Work with ambitious brands that care about quality" },
];

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  summary: string;
  sections: { heading: string; items: string[] }[];
};

const jobs: Job[] = [
  {
    id: "junior-account-executive",
    title: "Junior Account Executive",
    location: "Bristol (Hybrid)",
    type: "Full-time",
    salary: "£26,500",
    summary:
      "An entry-level role with real responsibility and a clear progression path. You'll work closely with our senior accounts team, helping to manage projects, clients, and day-to-day delivery — and within around 3 months, you'll be expected to start taking ownership of client accounts of your own.",
    sections: [
      {
        heading: "What You'll Be Doing",
        items: [
          "Supporting Account Managers with day-to-day client delivery",
          "Light project management across multiple client projects",
          "Scheduling, coordination, and keeping projects moving",
          "Managing inboxes and responding to client emails clearly and confidently",
          "Writing and sharing creative briefs",
          "Liaising with internal teams and external partners",
          "Keeping project management tools, timelines, and documents up to date",
          "Spotting issues early and helping solve them",
          "Learning how to manage client relationships end-to-end",
        ],
      },
      {
        heading: "As You Grow, You'll",
        items: [
          "Begin managing smaller client accounts independently",
          "Take ownership of timelines, communication, and delivery",
          "Become a trusted point of contact for clients",
        ],
      },
      {
        heading: "What We're Looking For",
        items: [
          "Confident and comfortable communicating with clients",
          "Highly organised and detail-oriented",
          "Proactive, curious, and eager to learn",
          "Calm under pressure and able to juggle multiple tasks",
          "A team player who takes responsibility",
          "Genuinely interested in content, media, or creative work",
        ],
      },
      {
        heading: "Tools & Experience (Nice to Have)",
        items: [
          "Google Workspace (Docs, Sheets, Gmail)",
          "Project management tools such as ClickUp, Monday.com, Productive.io",
          "Spreadsheets and basic reporting",
          "Clear, professional email communication",
          "Use of AI tools to work smarter",
          "A creative eye and strong attention to detail",
        ],
      },
    ],
  },
];

/* ───── components ───── */

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className="rounded-2xl border border-black/[0.08] bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-light-text-primary mb-2">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-light-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {job.type}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {job.salary}
              </span>
            </div>
          </div>
          <a
            href={`mailto:ben@earworm.co?subject=Application: ${job.title}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#2a2a2a] transition-colors shrink-0"
          >
            Apply now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="text-light-text-secondary font-body text-sm leading-relaxed">
          {job.summary}
        </p>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-3 border-t border-black/[0.06] text-sm font-medium text-light-text-secondary hover:text-light-text-primary hover:bg-black/[0.02] transition-colors"
      >
        {expanded ? "Show less" : "View full role details"}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded details */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 sm:px-8 pb-8 space-y-6">
          {job.sections.map((section) => (
            <div key={section.heading}>
              <h4 className="text-base font-semibold text-light-text-primary mb-3">
                {section.heading}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-light-text-secondary font-body leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-4 border-t border-black/[0.06]">
            <h4 className="text-base font-semibold text-light-text-primary mb-2">
              How to Apply
            </h4>
            <p className="text-sm text-light-text-secondary font-body leading-relaxed mb-4">
              We love creative applications — show us how you think. Send your application to{" "}
              <a href="mailto:ben@earworm.co" className="text-primary hover:underline">ben@earworm.co</a>
            </p>
            <a
              href={`mailto:ben@earworm.co?subject=Application: ${job.title}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Apply now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ───── page ───── */

const Careers = () => {
  useMetaTags();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <TestimonialTicker />
      <Navbar />

      {/* ── Dark Hero ── */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <DotsBackground />

        {/* Background blobs */}
        <div className="absolute top-[20%] left-[-5%] w-[400px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="absolute top-[40%] right-[-8%] w-[350px] h-[250px] blob-oblong-blue pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <SectionPill>
                <GraduationCap className="w-3.5 h-3.5" />
                Join the team
              </SectionPill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-5"
            >
              Build your career in{" "}
              <span className="text-gradient-green italic">content</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-base sm:text-lg text-text-secondary font-body max-w-2xl mx-auto leading-relaxed"
            >
              We're a small, ambitious team helping brands create video podcast content that actually moves the needle. If you're early in your career and want to learn fast — we'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>

        {/* Curved bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#E4E5E9] rounded-t-[40px]" />
      </section>

      {/* ── Light Section: Why Earworm ── */}
      <section className="bg-[#E4E5E9] relative px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
              <SectionPill variant="light">
                <Heart className="w-3.5 h-3.5" />
                Why Earworm
              </SectionPill>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl text-light-text-primary">
              What it's like here
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl bg-white/70 backdrop-blur-sm border border-black/[0.06] p-6 sm:p-7"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <perk.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-light-text-primary mb-1">{perk.title}</h3>
                <p className="text-sm text-light-text-secondary font-body leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Light Section: Open Roles ── */}
      <section className="bg-[#E4E5E9] relative px-6 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-10"
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
              <SectionPill variant="light">
                <Briefcase className="w-3.5 h-3.5" />
                Open roles
              </SectionPill>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl text-light-text-primary">
              Current openings
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-base text-light-text-secondary font-body mt-3 max-w-xl mx-auto">
              We're growing — and looking for people who want to grow with us.
            </motion.p>
          </motion.div>

          <div className="space-y-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Curved bottom divider back to dark */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-background rounded-t-[40px]" />
      </section>

      {/* ── Dark CTA ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] blob-green-strong pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl text-text-primary leading-tight mb-5"
            >
              Don't see the right role?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-base sm:text-lg text-text-secondary font-body max-w-xl mx-auto mb-8"
            >
              We're always interested in hearing from talented people. Drop us a line and tell us what you'd bring to the team.
            </motion.p>
            <motion.a
              variants={fadeUp}
              custom={2}
              href="mailto:ben@earworm.co?subject=Speculative Application"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-background font-semibold text-sm hover:brightness-110 transition-all"
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;

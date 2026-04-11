import { motion, useScroll, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { Mic, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";

import heroImg from "@/assets/guest-podcast-hero.jpg";
import speakerImg from "@/assets/guest-podcast-speaker.jpg";
import studioImg from "@/assets/guest-podcast-studio.jpg";

/* ───── animation ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

/* ───── data ───── */
const shows = [
  { initials: "FT", name: "FinTech Insiders", meta: "84,000 listeners · B2B finance", status: "Booked" },
  { initials: "SG", name: "Scale & Grow", meta: "42,000 listeners · SaaS founders", status: "Booked" },
  { initials: "TL", name: "The Leadership Brief", meta: "61,000 listeners · Senior execs", status: "Pitching" },
];

const steps = [
  {
    num: "01",
    title: "We find the right shows - by listening, not searching",
    body: "We research each podcast properly. The audience, the host's style, the gaps in their recent episodes. We only pitch shows where you'd genuinely be the right guest for that moment.",
    color: "veneer-sage",
  },
  {
    num: "02",
    title: "We write pitches in your voice, not ours",
    body: "One pitch per show. One angle per pitch. No templates, no mail merges. Hosts can tell the difference - and so can you when your calendar starts filling up.",
    color: "veneer-amber",
  },
  {
    num: "03",
    title: "We prepare you to sound like yourself, only sharper",
    body: "Not a script. A conversation. We work through your stories, your strongest angles, the moments that land. So when you're on air, you're relaxed - because you've done it already.",
    color: "veneer-purple",
  },
];

const afterItems = [
  {
    label: "Content",
    title: "Clips your team can actually use",
    body: "We pull the three or four moments that'll land on LinkedIn. Captioned, formatted, ready to post. Not an afterthought - part of the service.",
    color: "bg-veneer-sage",
  },
  {
    label: "Sales",
    title: "A leave-behind for every deal",
    body: "A short brief per episode your sales team can share in conversations. \"Here's our founder talking about exactly this problem\" is a better cold email than any PDF.",
    color: "bg-veneer-amber",
  },
  {
    label: "Recruiting",
    title: "The talent asset you didn't know you needed",
    body: "The best candidates research leadership before they interview. A founder on the right shows signals something a careers page never could.",
    color: "bg-veneer-teal",
  },
];

const testimonials = [
  {
    quote: "Three discovery calls came in the week the episode dropped. I'd written that off as wishful thinking - turns out the audience was exactly who we needed to reach.",
    name: "Sarah Okonkwo",
    role: "CEO, Series A fintech",
    result: "3 inbound calls in week one",
  },
  {
    quote: "Two of our last four engineering hires mentioned the podcast episode before their first interview. We didn't even plan for that.",
    name: "Marcus Reid",
    role: "Head of People, SaaS scale-up",
    result: "Recruiting impact, unplanned",
  },
];

const forWho = [
  {
    label: "Founders & CEOs",
    title: "You have a point of view. Podcast audiences want exactly that.",
    body: "The best founder guests aren't polished - they're honest about what they've learned. We help you find the stories that earn trust before anyone's heard of you.",
    color: "border-veneer-sage/30",
  },
  {
    label: "Executives & specialists",
    title: "Your knowledge is the product. Let's sell it properly.",
    body: "Category experts, department heads, senior practitioners - the people with genuine depth. We get you on shows where that depth is exactly what the audience came for.",
    color: "border-veneer-amber/30",
  },
];

interface FormData {
  name: string;
  role: string;
  audience: string;
}

/* ───── glassmorphic card ───── */
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_4px_30px_rgba(0,0,0,0.3)] group ${className}`}>
    {/* sweep shimmer */}
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
    {children}
  </div>
);

/* ───── page ───── */

const GuestBooking = () => {
  useMetaTags({
    title: "Podcast Guest Booking | Earworm",
    description: "Get placed on the podcasts your future clients are already listening to. Earworm's guest booking service finds the right shows and gets you booked.",
  });

  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("inquiries").insert({
        name: data.name,
        email: "",
        message: `Role: ${data.role}\n\nTarget audience: ${data.audience}`,
        type: "guest_booking",
        source_page: "/guest-booking",
      });
      if (error) throw error;
      toast.success("Thanks! We'll be in touch within one working day.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-foreground">
      <TestimonialTicker />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <header className="relative bg-card overflow-hidden pt-24 md:pt-32 pb-20 md:pb-28 px-6 rounded-b-[40px] md:rounded-b-[60px]">
        {/* subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.03) 39px,rgba(255,255,255,0.03) 40px)" }} />

        {/* warm gradient blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--veneer-sage)) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--veneer-amber)) 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="mb-6 mt-6">
              <SectionPill>
                <Mic className="w-3.5 h-3.5" />
                Podcast guesting
              </SectionPill>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-6xl lg:text-7xl mb-6 max-w-3xl">
              Your ideas deserve a{" "}
              <span className="bg-gradient-to-r from-veneer-sage via-veneer-amber to-veneer-rose bg-clip-text text-transparent italic">bigger room.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-text-secondary text-base sm:text-lg max-w-xl leading-relaxed mb-10 font-body">
              You've got the expertise. You're just not getting in front of the right people. We put you on the podcasts your future clients are already listening to - and we do it properly.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4 flex-wrap mb-12">
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.14] hover:border-white/[0.2] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.04)]"
              >
                See how it works
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-text-secondary underline underline-offset-[3px] hover:text-text-primary transition-colors font-body"
              >
                Start a conversation →
              </button>
            </motion.div>
          </motion.div>

          {/* Show cards row */}
          <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shows.map((show, i) => (
              <motion.div key={show.name} variants={fadeUp} custom={i + 4}>
                <GlassCard className="px-5 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center font-heading text-sm text-veneer-sage shrink-0">
                    {show.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary">{show.name}</div>
                    <div className="text-xs text-text-tertiary">{show.meta}</div>
                  </div>
                  <span
                    className={`text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full border shrink-0 ${
                      show.status === "Booked"
                        ? "bg-veneer-sage/15 text-veneer-sage border-veneer-sage/30"
                        : "bg-white/[0.04] text-text-secondary border-white/[0.1]"
                    }`}
                  >
                    {show.status}
                  </span>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ═══ CONTENT SECTIONS ═══ */}
      <main className="max-w-5xl mx-auto px-4 md:px-10">

        {/* ─── REFRAME + IMAGE ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-20 sm:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-[1.2] tracking-tight mb-6">
              Most guesting services blast your name to 500 shows and call it outreach.
              <br />
              <span className="bg-gradient-to-r from-veneer-amber to-veneer-sage bg-clip-text text-transparent italic">We pitch five. And get you on all five.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-body">
              Every show we pitch is one we've actually listened to. Every pitch is written for that specific host, that specific audience, with one specific angle. It takes longer. It works considerably better.
              <br /><br />
              <strong className="font-medium text-text-primary">Quality over quantity isn't a philosophy here. It's the only way we know how to do this.</strong>
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} ref={parallaxRef} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <motion.img
              src={heroImg}
              alt="Two professionals recording a podcast"
              className="w-full h-full object-cover"
              style={{ y: imageY }}
              width={1280}
              height={720}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/60 to-transparent" />
          </motion.div>
        </motion.section>

        {/* ─── HOW IT WORKS ─── */}
        <motion.section
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>How it works</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Three things we do <span className="bg-gradient-to-r from-veneer-sage to-veneer-purple bg-clip-text text-transparent italic">that others skip.</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i + 2}>
                <GlassCard className="p-8 h-full">
                  <div className={`font-heading text-4xl text-${step.color} mb-4 leading-none opacity-60`}>{step.num}</div>
                  <div className="text-sm sm:text-base font-medium text-text-primary mb-3 leading-snug">{step.title}</div>
                  <div className="text-sm text-text-secondary leading-relaxed font-body">{step.body}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── WHO THIS IS FOR + IMAGE ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-20 sm:py-28"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start mb-12">
            <div className="md:col-span-3">
              <motion.div variants={fadeUp} custom={0} className="mb-5">
                <SectionPill>Who this is for</SectionPill>
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-8 max-w-lg">
                We broadcast expertise. <span className="bg-gradient-to-r from-veneer-amber to-veneer-rose bg-clip-text text-transparent italic">We don't build it.</span>
              </motion.h2>

              <div className="flex flex-col gap-5">
                {forWho.map((item, i) => (
                  <motion.div key={item.label} variants={fadeUp} custom={i + 2}>
                    <GlassCard className={`p-7 border-l-2 ${item.color}`}>
                      <div className="text-xs tracking-[0.15em] uppercase text-text-tertiary font-medium mb-3 font-body">{item.label}</div>
                      <div className="text-sm sm:text-base font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                      <div className="text-sm text-text-secondary leading-relaxed font-body">{item.body}</div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} custom={3} className="md:col-span-2 relative rounded-2xl overflow-hidden aspect-[3/4] mt-8 md:mt-16">
              <img
                src={speakerImg}
                alt="Professional speaking on a podcast"
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,4%)]/50 to-transparent" />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} custom={5}>
            <GlassCard className="px-6 py-5 flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-veneer-amber shrink-0 mt-1" />
              <p className="text-sm text-text-secondary leading-relaxed font-body">
                <strong className="font-medium text-text-primary">One honest thing:</strong> this works best if you already have something real to say. If you're still figuring out your point of view, we'd rather tell you that now than take your money and find out later. Come back when you're ready - we'll still be here.
              </p>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* ─── AFTER THE EPISODE ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>After the episode</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Every appearance becomes <span className="bg-gradient-to-r from-veneer-teal to-veneer-sage bg-clip-text text-transparent italic">more than one episode.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {afterItems.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i + 2}>
                <GlassCard className="p-7 h-full">
                  <div className={`w-8 h-1 rounded-full ${item.color} mb-4 opacity-60`} />
                  <div className="text-xs tracking-[0.15em] uppercase text-text-tertiary font-medium mb-2 font-body">{item.label}</div>
                  <div className="text-sm sm:text-base font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                  <div className="text-sm text-text-secondary leading-relaxed font-body">{item.body}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── STUDIO IMAGE BREAK ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="relative rounded-2xl overflow-hidden aspect-[21/9] my-4"
        >
          <img
            src={studioImg}
            alt="Behind the scenes of podcast recording"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,4%)]/70 via-transparent to-[hsl(0,0%,4%)]/70" />
        </motion.div>
      </main>

      {/* ─── TESTIMONIALS (boxed section with shape dividers) ─── */}
      {/* Top shape divider: page bg rounds into testimonial bg */}
      <div className="relative z-10" style={{ backgroundColor: "hsl(220, 8%, 8%)" }}>
        <div className="h-[40px] sm:h-[60px] rounded-b-[40px] sm:rounded-b-[60px]" style={{ backgroundColor: "hsl(0, 0%, 4%)" }} />
      </div>

      <div className="relative" style={{ backgroundColor: "hsl(220, 8%, 8%)" }}>
        {/* Subtle warm gradient overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ background: "radial-gradient(ellipse at 20% 50%, hsl(var(--veneer-sage)) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, hsl(var(--veneer-amber)) 0%, transparent 50%)" }} />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>What clients say</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Real results, <span className="bg-gradient-to-r from-veneer-sage to-veneer-amber bg-clip-text text-transparent italic">real names.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i + 2}>
                <GlassCard className="p-8">
                  <p className="font-heading text-base sm:text-lg leading-[1.5] tracking-tight text-text-primary mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-veneer-sage/30 to-veneer-amber/30 border border-white/[0.1] flex items-center justify-center font-heading text-sm text-veneer-sage">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary font-body">{t.name}</div>
                      <div className="text-xs text-text-tertiary font-body">{t.role}</div>
                    </div>
                  </div>
                  <span className="inline-block mt-4 text-xs font-medium px-3 py-1 rounded-full bg-veneer-sage/10 text-veneer-sage border border-veneer-sage/20 font-body">
                    {t.result}
                  </span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Bottom shape divider: testimonial bg rounds into page bg */}
      <div className="relative z-10" style={{ backgroundColor: "hsl(0, 0%, 4%)" }}>
        <div className="h-[40px] sm:h-[60px] rounded-b-[40px] sm:rounded-b-[60px]" style={{ backgroundColor: "hsl(220, 8%, 8%)" }} />
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-10">

        {/* ─── CTA + FORM ─── */}
        <motion.section
          id="cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-20 sm:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight mb-5">
              Curious whether it's right <span className="bg-gradient-to-r from-veneer-amber to-veneer-rose bg-clip-text text-transparent italic">for you?</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-body mb-8 max-w-md">
              Tell us what you do and who you're trying to reach. We'll tell you honestly whether we can help - and if we can't, we'll tell you that too.
            </p>
            <button
              onClick={() => document.getElementById("guest-form-name")?.focus()}
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 text-white bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.14] hover:border-white/[0.2] hover:shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.04)]"
            >
              Start the conversation
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-text-tertiary mt-4 font-body">
              No deck. No pitch. Just an honest conversation about whether this makes sense.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <GlassCard className="p-8 sm:p-10">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">Your name</label>
                <input
                  id="guest-form-name"
                  {...register("name", { required: true })}
                  placeholder="Alex Chen"
                  className="w-full text-sm px-4 py-3 border border-white/[0.1] rounded-xl bg-white/[0.04] text-text-primary placeholder:text-text-tertiary outline-none focus:border-veneer-sage/40 focus:ring-1 focus:ring-veneer-sage/20 transition-all mb-4 font-body"
                />

                <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">What you do</label>
                <input
                  {...register("role", { required: true })}
                  placeholder="Founder at a B2B SaaS company"
                  className="w-full text-sm px-4 py-3 border border-white/[0.1] rounded-xl bg-white/[0.04] text-text-primary placeholder:text-text-tertiary outline-none focus:border-veneer-sage/40 focus:ring-1 focus:ring-veneer-sage/20 transition-all mb-4 font-body"
                />

                <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">Who you're trying to reach</label>
                <textarea
                  {...register("audience", { required: true })}
                  placeholder="CFOs at mid-market companies, mostly in financial services..."
                  rows={3}
                  className="w-full text-sm px-4 py-3 border border-white/[0.1] rounded-xl bg-white/[0.04] text-text-primary placeholder:text-text-tertiary outline-none focus:border-veneer-sage/40 focus:ring-1 focus:ring-veneer-sage/20 transition-all mb-4 resize-none font-body"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 text-white bg-gradient-to-r from-veneer-sage/80 to-veneer-teal/80 border border-veneer-sage/30 hover:from-veneer-sage hover:to-veneer-teal hover:shadow-[0_0_25px_rgba(123,175,142,0.2)] disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Start the conversation"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
                <p className="text-[11px] text-text-tertiary mt-3 text-center font-body">
                  We reply within one working day. Usually sooner.
                </p>
              </form>
            </GlassCard>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default GuestBooking;

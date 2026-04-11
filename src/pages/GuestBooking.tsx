import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mic, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import DotsBackground from "@/components/landing/DotsBackground";
import SectionPill from "@/components/landing/SectionPill";
import useMetaTags from "@/hooks/useMetaTags";

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
  },
  {
    num: "02",
    title: "We write pitches in your voice, not ours",
    body: "One pitch per show. One angle per pitch. No templates, no mail merges. Hosts can tell the difference - and so can you when your calendar starts filling up.",
  },
  {
    num: "03",
    title: "We prepare you to sound like yourself, only sharper",
    body: "Not a script. A conversation. We work through your stories, your strongest angles, the moments that land. So when you're on air, you're relaxed - because you've done it already.",
  },
];

const afterItems = [
  {
    label: "Content",
    title: "Clips your team can actually use",
    body: "We pull the three or four moments that'll land on LinkedIn. Captioned, formatted, ready to post. Not an afterthought - part of the service.",
  },
  {
    label: "Sales",
    title: "A leave-behind for every deal",
    body: "A short brief per episode your sales team can share in conversations. \"Here's our founder talking about exactly this problem\" is a better cold email attachment than any PDF you'll write.",
  },
  {
    label: "Recruiting",
    title: "The talent asset you didn't know you needed",
    body: "The best candidates research leadership before they interview. A founder or exec who shows up on the right shows signals something about the company that a careers page never could.",
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
  },
  {
    label: "Executives & specialists",
    title: "Your knowledge is the product. Let's sell it properly.",
    body: "Category experts, department heads, senior practitioners - the people with genuine depth. We get you on shows where that depth is exactly what the audience came for.",
  },
];

interface FormData {
  name: string;
  role: string;
  audience: string;
}

/* ───── page ───── */

const GuestBooking = () => {
  useMetaTags({
    title: "Podcast Guest Booking | Earworm",
    description: "Get placed on the podcasts your future clients are already listening to. Earworm's guest booking service finds the right shows and gets you booked.",
  });

  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

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

  const scrollToHow = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[15%] left-[-5%] w-[500px] h-[300px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[35%] right-[-8%] w-[400px] h-[250px] blob-oblong-blue pointer-events-none" />
      <div className="absolute top-[55%] left-[10%] w-[450px] h-[280px] blob-oblong-amber pointer-events-none" />
      <div className="absolute top-[75%] right-[5%] w-[350px] h-[220px] blob-oblong-green pointer-events-none" />

      <TestimonialTicker />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-32 sm:pt-40 pb-20">
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <SectionPill>
                <Mic className="w-3.5 h-3.5" />
                Podcast guesting
              </SectionPill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl text-text-primary leading-[1.1] mb-5"
            >
              Your ideas deserve a{" "}
              <span className="text-gradient-green italic">bigger room.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-base sm:text-lg text-text-secondary font-body max-w-xl leading-relaxed mb-8"
            >
              You've got the expertise. You're just not getting in front of the right people. We put you on the podcasts your future clients are already listening to - and we do it properly.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4 flex-wrap">
              <button
                onClick={scrollToHow}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-[0_0_25px_rgba(28,250,118,0.3)] transition-all duration-300"
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

          <motion.div initial="hidden" animate="visible" className="flex flex-col gap-3">
            {shows.map((show, i) => (
              <motion.div
                key={show.name}
                variants={fadeUp}
                custom={i + 2}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center font-heading text-sm text-text-secondary shrink-0">
                  {show.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">{show.name}</div>
                  <div className="text-xs text-text-tertiary">{show.meta}</div>
                </div>
                <span
                  className={`text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full border shrink-0 ${
                    show.status === "Booked"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-secondary text-text-secondary border-border"
                  }`}
                >
                  {show.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-[1]" />
      </section>

      {/* ═══ CONTENT SECTIONS ═══ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">

        {/* ─── REFRAME ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="font-heading text-2xl sm:text-3xl leading-[1.35] tracking-tight">
            Most guesting services blast your name to 500 shows and call it outreach.
            <br />
            <span className="text-gradient-green italic">We pitch five. And get you on all five.</span>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="text-sm sm:text-base leading-relaxed text-text-secondary font-body">
            The podcast world is full of spray-and-pray booking agencies charging for volume. We don't do that.
            <br /><br />
            Every show we pitch is one we've actually listened to. Every pitch is written for that specific host, that specific audience, with one specific angle. It takes longer. It works considerably better.
            <br /><br />
            <strong className="font-medium text-text-primary">Quality over quantity isn't a philosophy here. It's the only way we know how to do this.</strong>
          </motion.div>
        </motion.section>

        {/* ─── HOW IT WORKS ─── */}
        <motion.section
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 border-b border-border"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>How it works</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Three things we do <span className="text-gradient-green italic">that others skip.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i + 2} className="bg-card p-7 sm:p-8">
                <div className="font-heading text-3xl text-text-tertiary/40 mb-4 leading-none">{step.num}</div>
                <div className="text-sm sm:text-base font-medium text-text-primary mb-2 leading-snug">{step.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed font-body">{step.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── WHO THIS IS FOR ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 border-b border-border"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>Who this is for</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            We broadcast expertise. <span className="text-gradient-green italic">We don't build it.</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {forWho.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i + 2} className="bg-card border border-border rounded-2xl p-7">
                <div className="text-xs tracking-[0.15em] uppercase text-text-tertiary font-medium mb-3 font-body">{item.label}</div>
                <div className="text-sm sm:text-base font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed font-body">{item.body}</div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} custom={4} className="border border-border rounded-2xl px-6 py-5 flex gap-4 items-start bg-card/40">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
            <p className="text-sm text-text-secondary leading-relaxed font-body">
              <strong className="font-medium text-text-primary">One honest thing:</strong> this works best if you already have something real to say. If you're still figuring out your point of view, we'd rather tell you that now than take your money and find out later. Come back when you're ready - we'll still be here.
            </p>
          </motion.div>
        </motion.section>

        {/* ─── AFTER THE EPISODE ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 border-b border-border"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>After the episode</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Every appearance becomes <span className="text-gradient-green italic">more than one episode.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {afterItems.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i + 2} className="bg-card p-7">
                <div className="text-xs tracking-[0.15em] uppercase text-text-tertiary font-medium mb-2 font-body">{item.label}</div>
                <div className="text-sm sm:text-base font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed font-body">{item.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── TESTIMONIALS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 border-b border-border"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5">
            <SectionPill>What clients say</SectionPill>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl tracking-tight leading-[1.15] mb-12 max-w-lg">
            Real results, <span className="text-gradient-green italic">real names.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i + 2} className="border-l-2 border-primary/30 pl-6">
                <p className="font-heading text-base sm:text-lg leading-[1.5] tracking-tight text-text-primary mb-4">
                  "{t.quote}"
                </p>
                <div className="text-sm font-medium text-text-primary font-body">{t.name}</div>
                <div className="text-xs text-text-tertiary mt-0.5 font-body">{t.role}</div>
                <span className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-body">
                  {t.result}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── CTA + FORM ─── */}
        <motion.section
          id="cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight mb-5">
              Curious whether it's right <span className="text-gradient-green italic">for you?</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-body mb-8 max-w-md">
              Tell us what you do and who you're trying to reach. We'll tell you honestly whether we can help - and if we can't, we'll tell you that too.
            </p>
            <button
              onClick={() => document.getElementById("guest-form-name")?.focus()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-[0_0_25px_rgba(28,250,118,0.3)] transition-all duration-300"
            >
              Start the conversation
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-text-tertiary mt-4 font-body">
              No deck. No pitch. Just an honest conversation about whether this makes sense.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8 sm:p-10">
              <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">Your name</label>
              <input
                id="guest-form-name"
                {...register("name", { required: true })}
                placeholder="Alex Chen"
                className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all mb-4 font-body"
              />

              <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">What you do</label>
              <input
                {...register("role", { required: true })}
                placeholder="Founder at a B2B SaaS company"
                className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all mb-4 font-body"
              />

              <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide font-body">Who you're trying to reach</label>
              <textarea
                {...register("audience", { required: true })}
                placeholder="CFOs at mid-market companies, mostly in financial services..."
                rows={3}
                className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all mb-4 resize-none font-body"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-[0_0_25px_rgba(28,250,118,0.3)] transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Start the conversation"}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-[11px] text-text-tertiary mt-3 text-center font-body">
                We reply within one working day. Usually sooner.
              </p>
            </form>
          </motion.div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default GuestBooking;

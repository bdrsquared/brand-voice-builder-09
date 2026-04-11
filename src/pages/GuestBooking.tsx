import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import useMetaTags from "@/hooks/useMetaTags";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const shows = [
  { initials: "FT", name: "FinTech Insiders", meta: "84,000 listeners · B2B finance", status: "Booked" },
  { initials: "SG", name: "Scale & Grow", meta: "42,000 listeners · SaaS founders", status: "Booked" },
  { initials: "TL", name: "The Leadership Brief", meta: "61,000 listeners · Senior execs", status: "Pitching" },
];

const steps = [
  {
    num: "01",
    title: "We find the right shows — by listening, not searching",
    body: "We research each podcast properly. The audience, the host's style, the gaps in their recent episodes. We only pitch shows where you'd genuinely be the right guest for that moment.",
  },
  {
    num: "02",
    title: "We write pitches in your voice, not ours",
    body: "One pitch per show. One angle per pitch. No templates, no mail merges. Hosts can tell the difference — and so can you when your calendar starts filling up.",
  },
  {
    num: "03",
    title: "We prepare you to sound like yourself, only sharper",
    body: "Not a script. A conversation. We work through your stories, your strongest angles, the moments that land. So when you're on air, you're relaxed — because you've done it already.",
  },
];

const afterItems = [
  {
    label: "Content",
    title: "Clips your team can actually use",
    body: "We pull the three or four moments that'll land on LinkedIn. Captioned, formatted, ready to post. Not an afterthought — part of the service.",
  },
  {
    label: "Sales",
    title: "A leave-behind for every deal",
    body: 'A short brief per episode your sales team can share in conversations. "Here\'s our founder talking about exactly this problem" is a better cold email attachment than any PDF you\'ll write.',
  },
  {
    label: "Recruiting",
    title: "The talent asset you didn't know you needed",
    body: "The best candidates research leadership before they interview. A founder or exec who shows up on the right shows signals something about the company that a careers page never could.",
  },
];

const testimonials = [
  {
    quote: "Three discovery calls came in the week the episode dropped. I'd written that off as wishful thinking — turns out the audience was exactly who we needed to reach.",
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
    body: "The best founder guests aren't polished — they're honest about what they've learned. We help you find the stories that earn trust before anyone's heard of you.",
  },
  {
    label: "Executives & specialists",
    title: "Your knowledge is the product. Let's sell it properly.",
    body: "Category experts, department heads, senior practitioners — the people with genuine depth. We get you on shows where that depth is exactly what the audience came for.",
  },
];

interface FormData {
  name: string;
  role: string;
  audience: string;
}

const GuestBooking = () => {
  useMetaTags({
    title: "Podcast Guest Booking | Earworm",
    description: "Get placed on the podcasts your future clients are already listening to. Earworm's guest booking service finds the right shows and gets you booked.",
  });

  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

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
    <div className="min-h-screen bg-background text-text-primary font-body">
      <Navbar />

      <div className="max-w-[1020px] mx-auto px-6 sm:px-8">
        {/* ─── HERO ─── */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center border-b border-border">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <p className="text-[11px] tracking-[2.5px] uppercase text-text-tertiary font-medium mb-5">
              Earworm · Podcast guesting
            </p>
            <h1 className="font-heading text-[clamp(38px,4.8vw,58px)] leading-[1.07] tracking-tight mb-6">
              Your ideas deserve<br />a <em className="italic text-text-secondary">bigger room.</em>
            </h1>
            <p className="text-base leading-relaxed text-text-secondary font-light max-w-[400px] mb-8">
              You've got the expertise. You're just not getting in front of the right people. We put you on the podcasts your future clients are already listening to — and we do it properly.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={scrollToHow} className="text-sm font-medium px-7 py-3 bg-text-primary text-background rounded-full hover:opacity-90 transition-opacity">
                See how it works
              </button>
              <button onClick={scrollToHow} className="text-sm text-text-secondary underline underline-offset-[3px] hover:text-text-primary transition-colors">
                View shows we've placed guests on →
              </button>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" className="flex flex-col gap-3">
            {shows.map((show, i) => (
              <motion.div
                key={show.name}
                variants={fadeUp}
                custom={i + 1}
                className="bg-background border border-border rounded-[14px] px-5 py-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-[10px] bg-secondary border border-border flex items-center justify-center font-heading text-[15px] text-text-secondary shrink-0">
                  {show.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text-primary">{show.name}</div>
                  <div className="text-[11px] text-text-tertiary">{show.meta}</div>
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
        </section>

        {/* ─── REFRAME ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-20 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="font-heading text-[clamp(22px,2.8vw,30px)] leading-[1.35] tracking-tight">
            Most guesting services blast your name to 500 shows and call it outreach.<br />
            <em className="italic text-text-secondary">We pitch five.<br />And get you on all five.</em>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="text-[15px] leading-relaxed text-text-secondary font-light">
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
          className="py-16 sm:py-20 border-b border-border"
        >
          <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[2.5px] uppercase text-text-tertiary font-medium mb-4">How it works</motion.p>
          <motion.h2 variants={fadeUp} custom={0.5} className="font-heading text-[clamp(26px,3vw,36px)] tracking-tight leading-[1.15] mb-10 max-w-[480px]">
            Three things we do<br /><em className="italic text-text-secondary">that others skip.</em>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-[14px] overflow-hidden">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i + 1} className="bg-background p-7">
                <div className="font-heading text-[32px] text-border mb-4 leading-none">{step.num}</div>
                <div className="text-[15px] font-medium text-text-primary mb-2 leading-snug">{step.title}</div>
                <div className="text-[13px] text-text-secondary leading-relaxed font-light">{step.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── WHO THIS IS FOR ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-20 border-b border-border"
        >
          <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[2.5px] uppercase text-text-tertiary font-medium mb-4">Who this is for</motion.p>
          <motion.h2 variants={fadeUp} custom={0.5} className="font-heading text-[clamp(26px,3vw,36px)] tracking-tight leading-[1.15] mb-10 max-w-[480px]">
            We broadcast expertise.<br /><em className="italic text-text-secondary">We don't build it.</em>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {forWho.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i + 1} className="bg-secondary rounded-[14px] p-6">
                <div className="text-[11px] tracking-[1.5px] uppercase text-text-tertiary font-medium mb-3">{item.label}</div>
                <div className="text-[15px] font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                <div className="text-[13px] text-text-secondary leading-relaxed font-light">{item.body}</div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} custom={3} className="border border-border rounded-[14px] px-6 py-5 flex gap-4 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-border shrink-0 mt-1.5" />
            <p className="text-[13px] text-text-secondary leading-relaxed font-light">
              <strong className="font-medium text-text-primary">One honest thing:</strong> this works best if you already have something real to say. If you're still figuring out your point of view, we'd rather tell you that now than take your money and find out later. Come back when you're ready — we'll still be here.
            </p>
          </motion.div>
        </motion.section>

        {/* ─── AFTER THE EPISODE ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-20 border-b border-border"
        >
          <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[2.5px] uppercase text-text-tertiary font-medium mb-4">After the episode</motion.p>
          <motion.h2 variants={fadeUp} custom={0.5} className="font-heading text-[clamp(26px,3vw,36px)] tracking-tight leading-[1.15] mb-10 max-w-[480px]">
            Every appearance becomes<br /><em className="italic text-text-secondary">more than one episode.</em>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-[14px] overflow-hidden">
            {afterItems.map((item, i) => (
              <motion.div key={item.label} variants={fadeUp} custom={i + 1} className="bg-background p-6">
                <div className="text-[11px] tracking-[1.5px] uppercase text-text-tertiary font-medium mb-2">{item.label}</div>
                <div className="text-[15px] font-medium text-text-primary mb-2 leading-snug">{item.title}</div>
                <div className="text-[13px] text-text-secondary leading-relaxed font-light">{item.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── TESTIMONIALS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-20 border-b border-border"
        >
          <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[2.5px] uppercase text-text-tertiary font-medium mb-4">What clients say</motion.p>
          <motion.h2 variants={fadeUp} custom={0.5} className="font-heading text-[clamp(26px,3vw,36px)] tracking-tight leading-[1.15] mb-10 max-w-[480px]">
            Real results,<br /><em className="italic text-text-secondary">real names.</em>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i + 1} className="border-l-2 border-border pl-6">
                <p className="font-heading text-[17px] leading-[1.5] tracking-tight text-text-primary mb-4">
                  "{t.quote}"
                </p>
                <div className="text-[13px] font-medium text-text-primary">{t.name}</div>
                <div className="text-[12px] text-text-tertiary mt-0.5">{t.role}</div>
                <span className="inline-block mt-3 text-[12px] font-medium px-3 py-1 rounded-full bg-secondary text-text-secondary border border-border">
                  {t.result}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── CTA + FORM ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-[clamp(30px,3.8vw,46px)] leading-[1.1] tracking-tight mb-5">
              Curious whether<br />it's right <em className="italic text-text-secondary">for you?</em>
            </h2>
            <p className="text-[15px] leading-relaxed text-text-secondary font-light mb-8 max-w-[380px]">
              Tell us what you do and who you're trying to reach. We'll tell you honestly whether we can help — and if we can't, we'll tell you that too.
            </p>
            <button
              onClick={() => document.getElementById("guest-form-name")?.focus()}
              className="text-sm font-medium px-7 py-3 bg-text-primary text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Start the conversation
            </button>
            <p className="text-[12px] text-text-tertiary mt-4">
              No deck. No pitch. Just an honest conversation about whether this makes sense.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-secondary rounded-[18px] p-8 sm:p-10">
              <label className="block text-[12px] font-medium text-text-secondary mb-2 tracking-wide">Your name</label>
              <input
                id="guest-form-name"
                {...register("name", { required: true })}
                placeholder="Alex Chen"
                className="w-full text-sm px-3.5 py-2.5 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-text-tertiary transition-colors mb-4"
              />

              <label className="block text-[12px] font-medium text-text-secondary mb-2 tracking-wide">What you do</label>
              <input
                {...register("role", { required: true })}
                placeholder="Founder at a B2B SaaS company"
                className="w-full text-sm px-3.5 py-2.5 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-text-tertiary transition-colors mb-4"
              />

              <label className="block text-[12px] font-medium text-text-secondary mb-2 tracking-wide">Who you're trying to reach</label>
              <textarea
                {...register("audience", { required: true })}
                placeholder="CFOs at mid-market companies, mostly in financial services..."
                rows={3}
                className="w-full text-sm px-3.5 py-2.5 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-tertiary outline-none focus:border-text-tertiary transition-colors mb-4 resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-sm font-medium py-3 bg-text-primary text-background rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Start the conversation →"}
              </button>
              <p className="text-[11px] text-text-tertiary mt-3 text-center">
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

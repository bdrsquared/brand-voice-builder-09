import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Target, Gem, RefreshCw, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Calendly from "@/components/landing/Calendly";
import Footer from "@/components/landing/Footer";

import officeHero from "@/assets/office-hero.jpeg";
import officeImg from "@/assets/office.jpeg";
import launchImg from "@/assets/launch-microphone.jpeg";
import alexAvatar from "@/assets/alex-chen-avatar.jpeg";
import emmaAvatar from "@/assets/emma-carter-avatar.jpeg";
import lucasAvatar from "@/assets/lucas-grant-avatar.jpeg";
import miaAvatar from "@/assets/mia-johnson-avatar.jpeg";
import oliviaAvatar from "@/assets/olivia-park.png";
import ryanAvatar from "@/assets/ryan-foster-avatar.png";

/* ───── data ───── */

const team = [
  { name: "Ben Farley", role: "Founder & Strategy", avatar: alexAvatar, desc: "The one who started it all" },
  { name: "Emma Carter", role: "Head of Production", avatar: emmaAvatar, desc: "Brings every episode to life" },
  { name: "Lucas Grant", role: "Creative Director", avatar: lucasAvatar, desc: "Makes everything look incredible" },
  { name: "Mia Johnson", role: "Content Strategist", avatar: miaAvatar, desc: "Turns ideas into growth plans" },
  { name: "Olivia Park", role: "Editor & Post-Production", avatar: oliviaAvatar, desc: "Pixel-perfect finishing touches" },
  { name: "Ryan Foster", role: "Growth & Distribution", avatar: ryanAvatar, desc: "Gets content in front of the right people" },
];

const principles = [
  { icon: Target, title: "Strategy first", desc: "Every podcast starts with a clear plan tied to business goals — not vanity metrics." },
  { icon: Gem, title: "Quality matters", desc: "We treat every frame, edit, and word as a reflection of your brand." },
  { icon: RefreshCw, title: "Built for consistency", desc: "Systems and workflows designed to keep content flowing week after week." },
  { icon: TrendingUp, title: "Focus on outcomes", desc: "Content that compounds — building pipeline, authority, and audience over time." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

/* ───── page ───── */

const OurStory = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TestimonialTicker />
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={officeHero}
          alt="Earworm studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <motion.div
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4"
          >
            Our story
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-lg sm:text-xl text-text-secondary font-body max-w-2xl mx-auto mb-3"
          >
            A team built around a genuine passion for video podcast content
          </motion.p>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base text-text-tertiary font-body max-w-xl mx-auto"
          >
            We help brands create high-quality video podcasts that build authority and support real growth
          </motion.p>
        </motion.div>
      </section>

      {/* ── 2. Our Story Split ── */}
      <section ref={parallaxRef} className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[20%] left-[-100px] w-[400px] h-[400px] blob-green pointer-events-none" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm uppercase tracking-widest text-text-tertiary font-body">
              How we got here
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              Born from a belief that brands deserve{" "}
              <span className="text-gradient-green">better content</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-text-secondary font-body leading-relaxed">
              Earworm was founded by Ben Farley with a simple conviction: B2B companies shouldn't have to choose between quality and consistency. Too many brands settle for forgettable content — we set out to change that.
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="text-text-secondary font-body leading-relaxed">
              What started as a passion for audio storytelling quickly evolved into a full-service video podcast agency. Today we help ambitious businesses launch, run, and scale shows that genuinely move the needle.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            style={{ y: imageY }}
          >
            <img
              src={officeImg}
              alt="Behind the scenes at Earworm studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── 3. Visual Break ── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden aspect-[21/9] relative">
            <img
              src={launchImg}
              alt="Recording setup"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 4. The Team ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute bottom-[10%] right-[-80px] w-[350px] h-[350px] blob-blue pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm uppercase tracking-widest text-text-tertiary font-body mb-3">
              The people
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              Meet the team
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_hsl(145,96%,55%,0.15)]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-4 ring-2 ring-border group-hover:ring-primary/40 transition-all">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg sm:text-xl text-text-primary mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-body mb-2">{member.role}</p>
                <p className="text-sm text-text-tertiary font-body">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Approach / Ethos ── */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="absolute top-[40%] left-[10%] w-[300px] h-[300px] blob-oblong-green pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm uppercase tracking-widest text-text-tertiary font-body mb-3">
              What we believe
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              Our approach
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl bg-card border border-border p-6 sm:p-8 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-text-primary mb-2">{p.title}</h3>
                <p className="text-text-secondary font-body text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Mission Statement ── */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] blob-green-strong pointer-events-none" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] blob-blue pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm uppercase tracking-widest text-text-tertiary font-body mb-4">
              Our mission
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight mb-6"
            >
              To help brands create content people actually want to engage with
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-text-secondary font-body max-w-2xl mx-auto leading-relaxed"
            >
              — and turn podcasting into a scalable, high-quality{" "}
              <span className="text-gradient-green">growth channel</span>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <Calendly />
      <Footer />
    </div>
  );
};

export default OurStory;

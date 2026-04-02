import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Target, Gem, RefreshCw, TrendingUp, Linkedin, Mail } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import TestimonialTicker from "@/components/landing/TestimonialTicker";
import Calendly from "@/components/landing/Calendly";
import Footer from "@/components/landing/Footer";
import useMetaTags from "@/hooks/useMetaTags";

import officeHero from "@/assets/office-hero.webp";
import officeDesk from "@/assets/office-desk.webp";
import officeImg from "@/assets/office.webp";
import launchImg from "@/assets/launch-microphone.jpeg";
import benAvatar from "@/assets/ben-farley.png";

/* ───── data ───── */

const team = [
  { name: "Ben Farley", role: "Founder & CEO", avatar: benAvatar, about: "Ben built Earworm from the ground up with a mission to help brands tell stories worth listening to. He leads strategy and client relationships.", funFact: "Once recorded an entire episode in a moving campervan.", linkedin: "https://linkedin.com/in/benfarley", email: "ben@earworm.co" },
  { name: "Stephen Fordham", role: "Chairman", avatar: null, about: "Stephen brings decades of senior leadership experience, guiding Earworm's strategic direction and long-term vision.", funFact: "Has never missed a board meeting in 20 years.", linkedin: "https://linkedin.com/in/stephenfordham", email: "stephen@earworm.co" },
  { name: "Steve Chang", role: "Finance Director", avatar: null, about: "Steve keeps the numbers sharp  -  overseeing financial planning, forecasting, and making sure growth is sustainable.", funFact: "Can solve a Rubik's cube in under two minutes.", linkedin: "https://linkedin.com/in/stevechang", email: "steve@earworm.co" },
  { name: "Susie McFarland", role: "Commercial Director", avatar: null, about: "Susie drives commercial growth  -  building partnerships and ensuring every client engagement delivers real value.", funFact: "Once closed a deal on a ski lift.", linkedin: "https://linkedin.com/in/susiemcfarland", email: "susie@earworm.co" },
  { name: "Lucy Meecham-Jones", role: "Sales Manager", avatar: null, about: "Lucy leads the sales team  -  connecting brands with the right Earworm services and building lasting relationships.", funFact: "Has a black belt in karate.", linkedin: "https://linkedin.com/in/lucymeechamjones", email: "lucy@earworm.co" },
  { name: "Adele Burrows", role: "Client Services", avatar: null, about: "Adele is the glue between clients and production  -  making sure every project runs smoothly from kickoff to delivery.", funFact: "Can name every dog breed on sight.", linkedin: "https://linkedin.com/in/adeleburrows", email: "adele@earworm.co" },
  { name: "Jon Farley", role: "Creative Director", avatar: null, about: "Jon shapes the creative vision behind every Earworm show  -  from concept and branding to set design and motion.", funFact: "Learned to edit video before he could drive.", linkedin: "https://linkedin.com/in/jonfarley", email: "jon@earworm.co" },
];

const principles = [
  { icon: Target, title: "Strategy first", desc: "Every podcast starts with a clear plan tied to business goals  -  not vanity metrics." },
  { icon: Gem, title: "Quality matters", desc: "We treat every frame, edit, and word as a reflection of your brand." },
  { icon: RefreshCw, title: "Built for consistency", desc: "Systems and workflows designed to keep content flowing week after week." },
  { icon: TrendingUp, title: "Focus on outcomes", desc: "Content that compounds  -  building pipeline, authority, and audience over time." },
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
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[15%] left-[-5%] w-[500px] h-[300px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[30%] right-[-8%] w-[400px] h-[250px] blob-oblong-blue pointer-events-none" />
      <div className="absolute top-[55%] left-[10%] w-[450px] h-[280px] blob-oblong-amber pointer-events-none" />
      <div className="absolute top-[75%] right-[5%] w-[350px] h-[220px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[90%] left-[-3%] w-[400px] h-[260px] blob-oblong-blue pointer-events-none" />
      <TestimonialTicker />
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="relative h-[50vh] sm:h-[60vh] -mb-[50px] sm:mb-0 flex items-end justify-center overflow-hidden">
        <img
          src={officeHero}
          alt="Earworm studio"
          className="absolute inset-0 w-full h-full object-cover object-center"
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
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-primary font-medium text-sm">
              ● How we got here
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              Born from a belief that brands deserve{" "}
              <span className="text-gradient-green">better content</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-text-secondary font-body leading-relaxed">
              Earworm was founded by Ben Farley with a simple conviction: B2B companies shouldn't have to choose between quality and consistency. Too many brands settle for forgettable content  -  we set out to change that.
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
              src={officeDesk}
              alt="Behind the scenes at Earworm studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
          </motion.div>
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
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-3">
              ● The people
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl text-text-primary">
              Our brilliant team
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-text-secondary font-body mt-3 max-w-xl mx-auto">
              Coming soon.
            </motion.p>
          </motion.div>

          {/* ── Team cards hidden — data preserved in `team` array above for easy restoration ── */}
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
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-3">
              ● What we believe
            </motion.span>
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
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4">
              ● Our mission
            </motion.span>
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
               -  and turn podcasting into a scalable, high-quality{" "}
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

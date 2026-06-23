import { motion } from "framer-motion";
import SectionPill from "./SectionPill";
import { Video, Scissors, Share2, Library, Calendar, Mic, BarChart3, Sparkles } from "lucide-react";
import microphoneImg from "@/assets/earworm-microphone.webp";
import booksImg from "@/assets/earworm-books.webp";

const Pill = ({ children, variant = "light" }: { children: React.ReactNode; variant?: "light" | "dark" }) => (
  <span className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide ${
    variant === "dark"
      ? "bg-white/10 backdrop-blur-sm border border-white/15 text-white/90"
      : "bg-black/[0.05] border border-black/[0.08] text-light-text-secondary"
  }`}>
    {children}
  </span>
);

const InPractice = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionPill variant="light" className="mb-4">What this looks like in practice</SectionPill>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary">
            A repeatable system.
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-light-text-tertiary">
            Not ad hoc content.
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 - Large hero card */}
          <motion.div
            className="sm:col-span-2 relative overflow-hidden rounded-3xl min-h-[340px] sm:min-h-[380px] flex flex-col justify-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <img src={microphoneImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            {/* Subtle brand gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 mix-blend-overlay" />

            <div className="relative z-10 p-8 sm:p-10">
              <div className="absolute top-[-70px] right-8 flex gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white/80" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl text-white font-heading font-medium mb-3">
                Record once, distribute everywhere
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-body max-w-lg leading-relaxed">
                Every month, you sit down for a conversation. We turn it into a full content engine that keeps your brand visible and top of mind.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                <Pill variant="dark">Fully managed</Pill>
                <Pill variant="dark">Monthly sessions</Pill>
                <Pill variant="dark">All platforms</Pill>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Short-form clips */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-9 min-h-[340px] sm:min-h-[380px] flex flex-col justify-between border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-orange/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-black/[0.05] backdrop-blur-sm border border-black/[0.06] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-light-text-secondary" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">
                Short-form clips
              </h3>
              <p className="text-sm sm:text-base text-light-text-secondary font-body leading-relaxed">
                Dozens of clips cut for social and paid channels from every session.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Pill>Reels</Pill>
                <Pill>Shorts</Pill>
                <Pill>TikTok</Pill>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Multi-platform */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-9 min-h-[280px] sm:min-h-[300px] flex flex-col justify-between border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-black/[0.05] backdrop-blur-sm border border-black/[0.06] flex items-center justify-center">
              <Share2 className="w-5 h-5 text-light-text-secondary" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">
                Multi-platform distribution
              </h3>
              <p className="text-sm sm:text-base text-light-text-secondary font-body leading-relaxed">
                LinkedIn, YouTube, Spotify, Apple - everywhere your audience lives.
              </p>
            </div>
          </motion.div>

          {/* Card 4 - Growing content library with books */}
          <motion.div
            className="relative overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[300px] flex flex-col justify-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <img src={booksImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-white/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/15 via-transparent to-primary/10 mix-blend-overlay" />
            <div className="relative z-10 p-8 sm:p-9">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-5">
                <Library className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-xl sm:text-2xl text-white font-heading font-medium mb-3">
                Growing content library
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-body leading-relaxed">
                An ever-expanding asset library that compounds in value and works 24/7.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Pill variant="dark">Evergreen</Pill>
                <Pill variant="dark">Searchable</Pill>
              </div>
            </div>
          </motion.div>

          {/* Card 5 - Long-form episodes */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-9 min-h-[280px] sm:min-h-[300px] flex flex-col justify-between border border-black/[0.06] bg-gradient-to-br from-white/80 via-white/60 to-gray-100/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.05] backdrop-blur-sm border border-black/[0.06] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-light-text-secondary" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-black/[0.05] backdrop-blur-sm border border-black/[0.06] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-light-text-secondary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl text-light-text-primary font-heading font-medium mb-3">
                Long-form episodes
              </h3>
              <p className="text-sm sm:text-base text-light-text-secondary font-body leading-relaxed">
                Full podcast episodes published and optimised across all major platforms.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Pill>Video</Pill>
                <Pill>Audio</Pill>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InPractice;

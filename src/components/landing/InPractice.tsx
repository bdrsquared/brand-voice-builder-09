import { motion } from "framer-motion";
import { Video, Scissors, Share2, Library, Calendar } from "lucide-react";

const items = [
  { icon: Calendar, text: "Monthly or regular recording sessions — fully managed" },
  { icon: Video, text: "Long-form podcast episodes published on all major platforms" },
  { icon: Scissors, text: "Dozens of short-form clips cut for social and paid channels" },
  { icon: Share2, text: "Content distributed across LinkedIn, YouTube, Spotify, and more" },
  { icon: Library, text: "A growing content library that works for you 24/7" },
];

const InPractice = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="relative z-10 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 font-medium text-sm mb-4 block text-light-text-tertiary">
          ● What this looks like in practice
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-2 text-light-text-primary">
            A repeatable system.
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 text-light-text-tertiary">
            Not ad hoc content.
          </h2>
          <p className="text-base text-light-text-secondary font-body mb-10 max-w-xl leading-relaxed">
            Every month, you sit down for a conversation. We turn it into a full content engine that keeps your brand visible, consistent, and top of mind.
          </p>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.08] bg-white/50 hover:border-black/[0.15] transition-colors"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-9 h-9 rounded-lg bg-black/[0.06] backdrop-blur-sm border border-black/[0.08] flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-light-text-secondary" />
              </div>
              <p className="text-sm text-light-text-primary font-body font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InPractice;

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
    <section className="relative py-24 sm:py-32 px-6">
      <div className="absolute top-[-80px] left-[-100px] w-[400px] h-[350px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[300px] h-[300px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-6 block">
            ● What this looks like in practice
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            A repeatable system.{" "}
            <span className="text-muted-foreground">Not ad hoc content.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-12 max-w-2xl leading-relaxed">
            Every month, you sit down for a conversation. We turn it into a full content engine that keeps your brand visible, consistent, and top of mind.
          </p>
        </motion.div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-5 p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground font-body font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InPractice;

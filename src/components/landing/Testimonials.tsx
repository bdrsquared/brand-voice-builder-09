import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophie Cocker",
    company: "IG Group",
    role: "Content Manager UK",
    quote:
      "Working with Earworm has been a 10 out of 10 experience. Their team gets financial services – managing everything for The Art of Investing, from studio sourcing to content strategy and delivery. Highly recommended.",
    initials: "SC",
  },
  {
    name: "Amy Wilkinson",
    company: "The Wow Company",
    role: "Head of Marketing",
    quote:
      "From day one, our experience in partnering with Earworm has been outstanding. Not only do we now have an amazing podcast (where we see growth with every single episode) but I am honestly blown away by what a brilliant agency Earworm is becoming.",
    initials: "AW",
  },
  {
    name: "Valerio Rossetti",
    company: "Soldo Finance",
    role: "Director of Communications",
    quote:
      "I don't say this lightly, but working with Earworm has been a truly phenomenal experience. I've worked with many agency partners over the years, but Earworm has been outstanding from beginning to end.",
    initials: "VR",
  },
];

const allTestimonials = [...testimonials, ...testimonials];

const Stars = () => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
    ))}
  </div>
);

const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
  <div className="group flex-shrink-0 w-[340px] sm:w-[380px] p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-[0_8px_40px_-12px_hsl(145,96%,55%,0.15)]">
    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
      <span className="text-primary font-heading font-bold text-lg">
        {t.initials}
      </span>
    </div>
    <p className="text-foreground/80 leading-relaxed font-body mb-8 text-sm">
      "{t.quote}"
    </p>
    <div className="mt-auto">
      <Stars />
      <div className="mt-4">
        <p className="font-heading font-bold text-base">{t.name}</p>
        <p className="text-primary text-sm font-medium">{t.company}</p>
        <p className="text-muted-foreground text-sm">{t.role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[500px] blob-oblong-green pointer-events-none" />
      <div className="absolute top-[-50px] right-[-150px] w-[350px] h-[350px] blob-blue-strong pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          className="text-center mb-14 px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-6 block">
            ● What our clients say
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Trusted by <span className="text-gradient-green">ambitious</span>{" "}
            teams
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 animate-scroll-left-slow w-max py-2">
            {allTestimonials.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/earworm-logo.webp";
import logoBnvt from "@/assets/logos/bnvt.webp";
import logoCollyerBristow from "@/assets/logos/collyer-bristow.webp";
import logoWenodo from "@/assets/logos/wenodo.webp";
import logoPulsetto from "@/assets/logos/pulsetto.webp";
import logoSoldo from "@/assets/logos/soldo.webp";
import logoKpmg from "@/assets/logos/kpmg.webp";
import logoIgGroup from "@/assets/logos/ig-group.webp";
import logoCisco from "@/assets/logos/cisco.webp";

const logos = [
  { src: logoBnvt, alt: "BNVT" },
  { src: logoCollyerBristow, alt: "Collyer Bristow" },
  { src: logoWenodo, alt: "Wenodo" },
  { src: logoPulsetto, alt: "Pulsetto" },
  { src: logoSoldo, alt: "Soldo" },
  { src: logoKpmg, alt: "KPMG" },
  { src: logoIgGroup, alt: "IG Group" },
  { src: logoCisco, alt: "Cisco" },
];

const valueProps = [
  {
    title: "Done-for-you production",
    body: "We handle strategy, booking, filming, edits and distribution. Your team shows up, presses record and the rest happens around them.",
  },
  {
    title: "Built for pipeline, not vanity",
    body: "Every episode is engineered to surface decision-makers, fuel sales conversations and create assets your GTM team can actually use.",
  },
  {
    title: "Consistent output, every month",
    body: "A repeatable system that ships polished episodes, clips and written content on a calendar - no missed weeks, no quality dips.",
  },
];

const testimonials = [
  {
    quote:
      "The pipeline impact was measurable within weeks, and their team made the entire process effortless. Genuinely one of the best investments we've made.",
    name: "James Harrington",
    role: "CFO, Series B Tech Firm",
  },
  {
    quote:
      "From day one, our experience has been outstanding. We see growth with every single episode and I'm honestly blown away by what a brilliant agency Earworm is.",
    name: "Amy Wilkinson",
    role: "Head of Marketing, The Wow Company",
  },
  {
    quote:
      "Working with Earworm has been truly phenomenal. I've worked with many agency partners and they have been outstanding from beginning to end.",
    name: "Valerio Rossetti",
    role: "Director of Communications, Soldo",
  },
];

const Lp = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Earworm - Video Podcasts that Build Pipeline";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Done-for-you video podcast production for B2B brands. Strategy, filming, editing and distribution - built for pipeline, shipped every month.";
    document.head.appendChild(meta);

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, follow";
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
      document.head.removeChild(robots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Minimal nav */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Earworm" className="h-5 brightness-0 invert" width={120} height={20} />
          </Link>
          <a
            href="#book"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book a call
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="inline-block text-xs uppercase tracking-[0.18em] text-primary mb-6">
            Video podcast agency for B2B
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-6">
            Video podcasts that build authority and drive pipeline.
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            We produce, edit and distribute video podcasts for ambitious B2B brands. You stay in front of the camera. We handle everything else.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#book"
              className="inline-flex items-center justify-center h-11 px-7 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Book a call
            </a>
            <a
              href="#how"
              className="inline-flex items-center justify-center h-11 px-7 rounded-md text-base font-medium border border-white/15 hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Logo wall - static, no animation */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-white/40 mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {logos.map((l) => (
              <img
                key={l.alt}
                src={l.src}
                alt={l.alt}
                loading="lazy"
                className="h-8 w-auto opacity-50"
                width={100}
                height={32}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section id="how" className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
              A repeatable system - not a one-off shoot.
            </h2>
            <p className="text-white/60 text-lg">
              We give marketing and exec teams the production muscle of an in-house studio, without the headcount.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
              >
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-14 max-w-2xl">
            What teams say after a few months with us.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col"
              >
                <blockquote className="text-white/80 text-sm leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="text-xs">
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="text-white/50">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" className="px-6 py-24 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight mb-5">
            Ready to ship your first episode?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            A 20-minute call to see if your business is a fit. No deck, no pressure.
          </p>
          <a
            href="https://cal.com/earworm/intro"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book a call
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="px-6 py-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Earworm Agency Limited</div>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white/70">Privacy</Link>
            <Link to="/cookies" className="hover:text-white/70">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Lp;

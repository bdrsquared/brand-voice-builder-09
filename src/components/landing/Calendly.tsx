import { motion } from "framer-motion";
import { useEffect } from "react";

const Calendly = () => {
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    Cal("init", "30min", { origin: "https://app.cal.com" });
    Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "dark" },
      calLink: "earworm-accounts-fqzg4l/30min",
    });
    Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view", theme: "dark", cssVarsPerTheme: { dark: { "cal-bg": "transparent" } } });
  }, []);

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6">
      <div className="absolute top-[30%] left-[20%] w-[500px] h-[400px] blob-green-strong pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-100px] w-[400px] h-[300px] blob-oblong-blue pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Ready to build video content that supports{" "}
            <span className="text-gradient-green">real growth?</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed font-body">
            If you're thinking about using video podcasting to build authority, reach the right audience, and create consistent high-quality content, this is the best place to start.
          </p>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed font-body">
            No pitch deck. No pressure. Just a focused conversation on your goals and whether this is the right approach for your business.
          </p>

          <p className="text-sm text-foreground/80 font-semibold mb-2 font-body">
            Book a time below — it takes 30 seconds.
          </p>

          <p className="text-xs text-muted-foreground font-body">
            Free 30-minute call · No commitment · Straightforward advice
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            id="my-cal-inline-30min"
            style={{ width: "100%", height: "700px", overflow: "scroll" }}
            className="rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Calendly;

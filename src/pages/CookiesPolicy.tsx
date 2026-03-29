import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold font-display mb-6"
          >
            Cookie Policy 🍪
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-muted-foreground mb-12 text-lg"
          >
            Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="prose prose-invert prose-sm max-w-none space-y-8"
          >
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What are cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and understand how you interact with the content. They're standard across virtually every website you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How we use cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use a small number of cookies to keep things running smoothly and to understand what's working on our site. Here's the breakdown:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-card/50 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Essential cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    These are necessary for the site to function — things like remembering your cookie preference. They can't be switched off.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-card/50 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Analytics cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    We use analytics to understand how visitors use our site — which pages are popular, where people drop off, and how we can improve. This data is aggregated and anonymous.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-card/50 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Functional cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    These help us remember choices you make (like your cookie consent) so we don't keep asking you the same thing.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third-party cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some of our pages embed third-party content (like Calendly for booking calls). These services may set their own cookies. We don't control those cookies — check their respective privacy policies for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Managing your cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You can control and delete cookies through your browser settings. Most browsers let you block or remove cookies — but doing so may affect how our site works for you. You can also clear cookies at any time to reset your preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Questions?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about how we use cookies, feel free to get in touch at{" "}
                <a href="mailto:hello@earworm.co" className="text-primary hover:underline">
                  hello@earworm.co
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiesPolicy;

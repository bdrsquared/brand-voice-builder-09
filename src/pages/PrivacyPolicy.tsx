import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import DotsBackground from "@/components/landing/DotsBackground";
import useMetaTags from "@/hooks/useMetaTags";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
    <h2 className="text-xl md:text-2xl font-heading font-semibold mb-4">{title}</h2>
    <div className="text-muted-foreground font-body leading-relaxed space-y-4">{children}</div>
  </motion.section>
);

const PrivacyPolicy = () => {
  useMetaTags();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Mini hero */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-6 overflow-hidden">
        <DotsBackground />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground font-body text-base sm:text-lg max-w-lg mx-auto"
          >
            How we collect, use, and protect your data — no jargon, no surprises.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-muted-foreground/50 text-xs mt-4 font-body"
          >
            Last updated: 2 April 2026
          </motion.p>
        </div>
      </section>

      <main className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-muted-foreground font-body leading-relaxed mb-12"
          >
            Earworm Agency Limited ("Earworm", "we", "us", or "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal data when you use our website or engage with us.
          </motion.p>

          <Section title="1. Who we are">
            <div className="space-y-4">
              <div>
                <p className="text-foreground font-medium mb-1">UK (Registered Office)</p>
                <p>Earworm Agency Limited</p>
                <p>Studio D &amp; B, 25–27 Stokes Croft</p>
                <p>Bristol, BS1 3PY</p>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">USA Office</p>
                <p>Earworm Agency</p>
                <p>99 Wall Street #2421</p>
                <p>New York, NY 10005</p>
              </div>
              <p>Earworm Agency Limited is registered in England and Wales (Company No. 14843820). VAT Registration No. 449 7546 43.</p>
              <p>We are registered with the Information Commissioner's Office (ICO) and comply with UK data protection regulations.</p>
            </div>
          </Section>

          <Section title="2. What data we collect">
            <p className="text-foreground font-medium">Information you provide</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name</li>
              <li>Job title</li>
              <li>Any information you include in forms or messages</li>
            </ul>
            <p className="text-foreground font-medium">Automatically collected data</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on the site</li>
              <li>Device and usage data</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Respond to enquiries or requests</li>
              <li>Provide services and communicate with you</li>
              <li>Manage bookings and consultations</li>
              <li>Improve our website and user experience</li>
              <li>Understand how visitors use our site</li>
              <li>Send relevant communications where appropriate</li>
            </ul>
            <p>We take a practical, minimal approach to data — collecting only what is necessary to deliver our services effectively.</p>
          </Section>

          <Section title="4. Legal basis for processing">
            <p>We process your data under the following lawful bases:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="text-foreground font-medium">Legitimate interests</span> – to operate and improve our business</li>
              <li><span className="text-foreground font-medium">Consent</span> – where you have opted in to receive communications</li>
              <li><span className="text-foreground font-medium">Contractual necessity</span> – where required to deliver services</li>
            </ul>
          </Section>

          <Section title="5. How we store and protect your data">
            <p>We implement appropriate technical and organisational measures to protect your data, including secure storage, access controls, and restricted internal access on a need-to-know basis.</p>
            <p>We regularly review our data handling practices to ensure they remain aligned with current standards.</p>
          </Section>

          <Section title="6. Sharing your data">
            <p>We do not sell your personal data.</p>
            <p>We may share your data with a limited number of trusted third-party providers where necessary to operate our services (including hosting, analytics, and communication platforms). These providers are selected based on their security and compliance standards.</p>
          </Section>

          <Section title="7. International data transfers">
            <p>As we operate in both the UK and the United States, your data may be processed outside the UK.</p>
            <p>Where this happens, we ensure appropriate safeguards are in place to protect your data in line with applicable data protection laws.</p>
          </Section>

          <Section title="8. AI and data use">
            <p>We use AI tools to support internal workflows and service delivery. These tools are used in a controlled manner and are subject to internal policies governing data usage, access, and security.</p>
            <p>We do not use client data to train public AI models.</p>
            <p>You may request a copy of our AI policy at any time by contacting us.</p>
          </Section>

          <Section title="9. Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise your rights, please contact us at: <a href="mailto:data@earworm.co" className="text-primary hover:underline">data@earworm.co</a></p>
          </Section>

          <Section title="10. Cookies">
            <p>We use cookies to improve your experience and understand how our website is used.</p>
            <p>For more information, please see our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.</p>
          </Section>

          <Section title="11. Data retention">
            <p>We retain personal data only for as long as necessary to fulfil the purposes it was collected for, including satisfying legal, accounting, or reporting requirements.</p>
            <p>Where data is no longer required, it is securely deleted or anonymised.</p>
          </Section>

          <Section title="12. Contact us">
            <p>If you have any questions about this policy or how your data is handled, you can contact us at:</p>
            <p>Email: <a href="mailto:data@earworm.co" className="text-primary hover:underline">data@earworm.co</a></p>
          </Section>

          <Section title="13. Updates to this policy">
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

import { motion } from "framer-motion";

const Showreel = () => {
  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
      <div className="absolute top-[-50px] right-[-150px] w-[400px] h-[300px] blob-oblong-blue pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-100px] w-[350px] h-[350px] blob-green pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-accent font-medium text-sm mb-6 block">
            ● Working with businesses worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Check out our <span className="text-gradient-green">showreel</span>
          </h2>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-border bg-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ padding: "56.25% 0 0 0", position: "relative" }}
        >
          <iframe
            src="https://player.vimeo.com/video/1103156714?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
            title="Showreel"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Showreel;

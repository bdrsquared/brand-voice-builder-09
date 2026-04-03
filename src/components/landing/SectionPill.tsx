interface SectionPillProps {
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
}

const SectionPill = ({ children, variant = "dark", className = "" }: SectionPillProps) => {
  const styles =
    variant === "dark"
      ? "bg-gradient-to-r from-primary/[0.08] via-card/60 to-accent/[0.06] text-foreground border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_20px_rgba(28,250,118,0.06),0_4px_12px_rgba(0,0,0,0.4)]"
      : "bg-gradient-to-r from-black/[0.04] via-black/[0.02] to-accent/[0.04] text-light-text-primary border-black/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]";

  return (
    <span
      className={`inline-flex items-center gap-2 font-medium px-5 py-2 rounded-full border backdrop-blur-xl tracking-widest uppercase text-xs ${styles} ${className}`}
    >
      {children}
    </span>
  );
};

export default SectionPill;

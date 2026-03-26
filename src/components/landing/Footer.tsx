const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold tracking-tight">
          pod<span className="text-gradient-gold">cast</span>
        </span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} · Video podcasting for B2B companies
        </p>
      </div>
    </footer>
  );
};

export default Footer;

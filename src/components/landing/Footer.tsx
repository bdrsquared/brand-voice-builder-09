import logo from "@/assets/earworm-logo.webp";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6 pb-24 sm:pb-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Earworm" className="h-5" />
        <p className="text-sm text-text-tertiary font-body">
          © {new Date().getFullYear()} · Video podcasting for B2B companies
        </p>
      </div>
    </footer>
  );
};

export default Footer;

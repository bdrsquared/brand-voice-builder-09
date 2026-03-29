import { Link } from "react-router-dom";
import logo from "@/assets/earworm-logo.webp";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6 pb-24 sm:pb-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Earworm" className="h-5" />
        <div className="flex items-center gap-4">
          <p className="text-sm text-text-tertiary font-body">
            © {new Date().getFullYear()} · Video podcasting for B2B companies
          </p>
          <Link to="/admin/login" className="text-xs text-text-tertiary/40 hover:text-text-tertiary transition-colors font-body">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

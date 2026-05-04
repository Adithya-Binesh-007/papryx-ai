import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

export const Logo = ({ to = "/" }: { to?: string }) => (
  <Link to={to} className="flex items-center gap-2 group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-primary blur-md opacity-50 group-hover:opacity-80 transition-opacity rounded-lg" />
      <img
        src={logoMark}
        alt="ExamForge AI logo"
        className="relative h-9 w-9 rounded-lg object-contain bg-white"
      />
    </div>
    <span className="font-display font-bold text-xl tracking-tight">
      ExamForge <span className="gradient-text">AI</span>
    </span>
  </Link>
);

import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ to = "/" }: { to?: string }) => (
  <Link to={to} className="flex items-center gap-2 group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
    </div>
    <span className="font-display font-bold text-xl tracking-tight">
      ExamForge <span className="gradient-text">AI</span>
    </span>
  </Link>
);

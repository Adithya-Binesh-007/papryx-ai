import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/GlowOrb";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <GlowOrb className="-top-40 -left-40" color="violet" size={500} />
    <GlowOrb className="-bottom-40 -right-40" color="blue" size={500} />
    <div className="text-center relative">
      <h1 className="font-display text-7xl font-bold gradient-text mb-4">404</h1>
      <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
      <Button asChild className="btn-gradient text-white border-0">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;

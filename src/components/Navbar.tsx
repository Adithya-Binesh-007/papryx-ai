import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props { variant?: "landing" | "app" }

export const Navbar = ({ variant = "landing" }: Props) => {
  const { user, signOut } = useAuth();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="container py-4">
        <nav className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo to={user ? "/dashboard" : "/"} />
          {variant === "landing" && (
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#why" className="hover:text-foreground transition-colors">Why us</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
          )}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={() => signOut()} variant="outline" size="sm">Logout</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild size="sm" className="btn-gradient text-white border-0">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

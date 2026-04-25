import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import mohaLogo from "@/assets/moha/moha-portrait.jpeg";

const links = [
  { to: "/", label: "Home" },
  { to: "/priorities", label: "Priorities" },
  { to: "/foundations", label: "Foundations" },
  { to: "/stories", label: "Featured Stories" },
  { to: "/news", label: "Top Stories" },
  { to: "/polling", label: "Polling" },
  { to: "/advertise", label: "Advertise With Us" },
  { to: "/ask", label: "Ask Me" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-lg text-primary-foreground">M</span>
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={cn(
                  "font-display font-bold text-lg transition-colors",
                  transparent ? "text-white" : "text-foreground"
                )}
              >
                MOHA
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-widest uppercase transition-colors",
                  transparent ? "text-gold" : "text-primary"
                )}
              >
                Mathare 2027
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "px-3 py-2 text-sm font-semibold rounded-md transition-all relative",
                    transparent
                      ? "text-white/90 hover:text-gold"
                      : "text-foreground/80 hover:text-primary",
                    active && (transparent ? "text-gold" : "text-primary")
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="hero" size="default">
              <Link to="/donate">Donate</Link>
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "lg:hidden p-2 rounded-md transition-colors",
              transparent ? "text-white" : "text-foreground"
            )}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-6 pt-2 animate-fade-in">
            <nav className="flex flex-col gap-1 bg-background/95 rounded-xl border border-border p-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 rounded-md text-foreground hover:bg-primary/5 hover:text-primary font-semibold transition"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="hero" className="mt-2">
                <Link to="/donate">Donate Now</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

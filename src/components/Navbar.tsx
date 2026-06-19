import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/lib/user-auth";
import { toast } from "sonner";
import mohaLogo from "@/assets/moha/moha-portrait.jpeg";

const links = [
  { to: "/", label: "Home" },
  { to: "/priorities", label: "Priorities" },
  { to: "/foundations", label: "Foundation" },
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
  const navigate = useNavigate();
  const { isSignedIn, displayName, signOut } = useUserAuth();

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

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

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
            <div className="h-11 w-11 rounded-xl overflow-hidden bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform ring-2 ring-gold/40">
              <img src={mohaLogo} alt="Moha portrait" className="h-full w-full object-cover object-top" />
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
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className={cn(
                      "gap-2",
                      transparent && "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    )}
                  >
                    <User className="h-4 w-4" />
                    {displayName}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Signed in as {displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/foundations" })}>
                    Apply for Bursary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/advertise" })}>
                    List My Business
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                size="default"
                className={cn(
                  transparent && "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                )}
              >
                <Link to="/signin">
                  <User className="h-4 w-4" /> Sign In
                </Link>
              </Button>
            )}
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

              <div className="border-t border-border my-1" />

              {isSignedIn ? (
                <>
                  <p className="px-4 py-1 text-xs text-muted-foreground font-semibold">
                    Signed in as {displayName}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-3 rounded-md text-left text-destructive hover:bg-destructive/5 font-semibold transition flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="px-4 py-3 rounded-md text-foreground hover:bg-primary/5 hover:text-primary font-semibold transition flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Sign In
                </Link>
              )}

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
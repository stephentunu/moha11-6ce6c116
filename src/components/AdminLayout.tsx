import { useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Store,
  FileText,
  BarChart3,
  Inbox,
  LogOut,
  ShieldCheck,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth, adminLogout, useMessages } from "@/lib/admin-store";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/businesses", label: "Business Moderation", icon: Store },
  { to: "/admin/content", label: "Content Manager", icon: FileText },
  { to: "/admin/polls", label: "Poll Analytics", icon: BarChart3 },
  { to: "/admin/inbox", label: "Message Inbox", icon: Inbox },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { authed, ready } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [messages] = useMessages();
  const unread = messages.filter((m) => !m.read).length;

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/admin/login" });
  }, [ready, authed, navigate]);

  if (!ready || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Verifying session…
      </div>
    );
  }

  const handleLogout = () => {
    adminLogout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col bg-primary text-primary-foreground border-r border-primary/40">
          <div className="p-6 border-b border-primary-foreground/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gold flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-gold-foreground" />
              </div>
              <div>
                <p className="font-display font-bold leading-tight">Moha Admin</p>
                <p className="text-[10px] uppercase tracking-widest text-gold">Console</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    active
                      ? "bg-gold text-gold-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.to === "/admin/inbox" && unread > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-primary-foreground/10 space-y-1">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
            >
              <Home className="h-4 w-4" /> Back to site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-col min-w-0">
          <header className="bg-card border-b border-border sticky top-0 z-30">
            <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
              <h1 className="font-display text-lg md:text-xl font-bold truncate">{title}</h1>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">admin2027</span>
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Home</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="lg:hidden">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Mobile nav */}
            <div className="lg:hidden border-t border-border overflow-x-auto">
              <div className="flex gap-1 px-3 py-2 min-w-max">
                {NAV.map((item) => {
                  const active = item.exact
                    ? pathname === item.to
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap",
                        active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>
          <div className="flex-1 p-4 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

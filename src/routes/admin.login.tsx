import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { adminLogin, isAdminAuthed } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Moha Delivers" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthed()) navigate({ to: "/admin" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = adminLogin(email, password);
      setLoading(false);
      if (!ok) {
        toast.error("Invalid credentials", {
          description: "Check your email and password and try again.",
        });
        return;
      }
      toast.success("Welcome back, Admin.");
      navigate({ to: "/admin" });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center px-4">
      <Toaster />
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to public site
        </Link>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Admin Console</h1>
              <p className="text-xs text-muted-foreground">
                Restricted area. Authorized personnel only.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Signing in…</>
              ) : (
                <>Sign in to Dashboard</>
              )}
            </Button>
          </form>
          <p className="mt-6 text-[11px] text-center text-muted-foreground">
            Session is stored locally on this device.
          </p>
        </div>
      </div>
    </div>
  );
}

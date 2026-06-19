import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Mail, Lock, User, ArrowLeft, Loader2, ShieldCheck, GraduationCap, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { userSignIn, userSignUp, useUserAuth } from "@/lib/user-auth";
import { adminLogin } from "@/lib/admin-store";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signin")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign In — Moha Delivers" },
      {
        name: "description",
        content: "Sign in or create a free account to apply for a Moha bursary or list your business on the Mathare Business Hub.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/signin" });
  const { isSignedIn, loading: authLoading } = useUserAuth();
  const redirectTo = search.redirect || "/";

  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign in form
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  // Sign up form
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suLoading, setSuLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isSignedIn) {
      navigate({ to: redirectTo });
    }
  }, [authLoading, isSignedIn, navigate, redirectTo]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiLoading(true);

    // First, check if these are the Moha admin credentials.
    // If so, log in as admin and go straight to the dashboard — no separate
    // admin login page or extra click needed.
    const isAdmin = adminLogin(siEmail, siPassword);
    if (isAdmin) {
      setSiLoading(false);
      toast.success("Welcome back, Admin.");
      navigate({ to: "/admin" });
      return;
    }

    // Otherwise, try regular user sign-in
    const res = await userSignIn(siEmail, siPassword);
    setSiLoading(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: redirectTo });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suPassword !== suConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!suName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    setSuLoading(true);
    const res = await userSignUp(suEmail, suPassword, suName);
    setSuLoading(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Account created!", {
      description: "You can now continue with your application.",
    });
    // Try to sign in immediately (works if email confirmation is disabled)
    const signInRes = await userSignIn(suEmail, suPassword);
    if (signInRes.ok) {
      navigate({ to: redirectTo });
    } else {
      toast.info("Please check your email to confirm your account, then sign in.");
      setTab("signin");
      setSiEmail(suEmail);
    }
  };

  const redirectContext = (() => {
    if (redirectTo.includes("foundations")) {
      return { icon: GraduationCap, text: "Sign in to continue your bursary application" };
    }
    if (redirectTo.includes("advertise")) {
      return { icon: Store, text: "Sign in to list your business on the Mathare Business Hub" };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center px-4 py-16">
      <Toaster />
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">My Account</h1>
              <p className="text-xs text-muted-foreground">
                Required for bursary applications and business listings
              </p>
            </div>
          </div>

          {redirectContext && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 px-4 py-3 text-sm font-medium text-foreground">
              <redirectContext.icon className="h-4 w-4 text-gold shrink-0" />
              {redirectContext.text}
            </div>
          )}

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            {/* ── SIGN IN ──────────────────────────────────────────────────── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-5">
                <div>
                  <Label htmlFor="si-email" className="font-semibold">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="si-email"
                      type="email"
                      autoComplete="email"
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="si-password" className="font-semibold">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="si-password"
                      type="password"
                      autoComplete="current-password"
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={siLoading}>
                  {siLoading ? (<><Loader2 className="h-5 w-5 animate-spin" /> Signing in…</>) : "Sign In"}
                </Button>
              </form>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => setTab("signup")} className="font-semibold text-primary hover:underline">
                  Create one
                </button>
              </p>
            </TabsContent>

            {/* ── SIGN UP ──────────────────────────────────────────────────── */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-5">
                <div>
                  <Label htmlFor="su-name" className="font-semibold">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="su-name"
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      placeholder="Jane Wanjiru"
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="su-email" className="font-semibold">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="su-email"
                      type="email"
                      autoComplete="email"
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="su-password" className="font-semibold">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="su-password"
                      type="password"
                      autoComplete="new-password"
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="pl-9 h-11"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="su-confirm" className="font-semibold">Confirm Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="su-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={suConfirm}
                      onChange={(e) => setSuConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className="pl-9 h-11"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={suLoading}>
                  {suLoading ? (<><Loader2 className="h-5 w-5 animate-spin" /> Creating account…</>) : "Create Account"}
                </Button>
              </form>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setTab("signin")} className="font-semibold text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
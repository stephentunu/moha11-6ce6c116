import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useNavigate, f as useSearch, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./router-CiepFxU2.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { L as Label } from "./label-CrVjKyup.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { c as createSsrRpc } from "./createSsrRpc-C2cGivNr.mjs";
import { c as createServerFn } from "./index.mjs";
import { a as adminLogin } from "./admin-store-Pu01Ao05.mjs";
import "../_libs/seroval.mjs";
import { G as GraduationCap, f as Store, A as ArrowLeft, g as ShieldCheck, U as User, h as Lock, d as LoaderCircle, I as Info, C as ChevronDown, b as Mail } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client-r8zzNwlx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const SignUpSchema = objectType({
  fullName: stringType().trim().min(2).max(100),
  password: stringType().min(4).max(100)
});
const simpleSignUp = createServerFn({
  method: "POST"
}).inputValidator((d) => SignUpSchema.parse(d)).handler(createSsrRpc("91470433042195b042731f475f5e0bf41b319f444101ffebc960505bee251237"));
const SignInSchema = objectType({
  fullName: stringType().trim().min(2).max(100),
  password: stringType().min(1).max(100)
});
const simpleSignIn = createServerFn({
  method: "POST"
}).inputValidator((d) => SignInSchema.parse(d)).handler(createSsrRpc("629de4d32d45e43757545161a70c3bae7f7d9e46f5b35000932ec239a7baf732"));
const ValidateSchema = objectType({
  token: stringType().min(10)
});
const validateSession = createServerFn({
  method: "POST"
}).inputValidator((d) => ValidateSchema.parse(d)).handler(createSsrRpc("1bead37f43c67904514299ecab03298164d39c52f096ee6c7e44fafecda291d5"));
const SignOutSchema = objectType({
  token: stringType().min(10)
});
const simpleSignOut = createServerFn({
  method: "POST"
}).inputValidator((d) => SignOutSchema.parse(d)).handler(createSsrRpc("49d710a1dc764df44b030b7dca0edb793cfc5b2d813132b82f01efd79893c2b6"));
const SESSION_KEY = "moha.user.session.v1";
function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeSession(session) {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("moha-user-session"));
}
async function userSignUp(fullName, password) {
  if (!fullName.trim() || fullName.trim().length < 2) {
    return { ok: false, message: "Please enter your full name" };
  }
  if (!password || password.length < 4) {
    return { ok: false, message: "Password must be at least 4 characters" };
  }
  try {
    const res = await simpleSignUp({ data: { fullName, password } });
    writeSession({ token: res.token, userId: res.userId, fullName: res.fullName });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not create account" };
  }
}
async function userSignIn(fullName, password) {
  if (!fullName.trim()) return { ok: false, message: "Please enter your name" };
  if (!password) return { ok: false, message: "Please enter your password" };
  try {
    const res = await simpleSignIn({ data: { fullName, password } });
    writeSession({ token: res.token, userId: res.userId, fullName: res.fullName });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not sign in" };
  }
}
async function userSignOut() {
  const session = readSession();
  if (session) {
    try {
      await simpleSignOut({ data: { token: session.token } });
    } catch {
    }
  }
  writeSession(null);
}
function useUserAuth() {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const refresh = reactExports.useCallback(async () => {
    const stored = readSession();
    if (!stored) {
      setSession(null);
      setLoading(false);
      return;
    }
    try {
      const res = await validateSession({ data: { token: stored.token } });
      if (res.valid) {
        setSession({ token: stored.token, userId: res.userId, fullName: res.fullName });
      } else {
        writeSession(null);
        setSession(null);
      }
    } catch {
      setSession(stored);
    }
    setLoading(false);
  }, []);
  reactExports.useEffect(() => {
    refresh();
    const onChange = () => {
      setSession(readSession());
    };
    window.addEventListener("moha-user-session", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("moha-user-session", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);
  const signOut = reactExports.useCallback(async () => {
    await userSignOut();
  }, []);
  return {
    loading,
    isSignedIn: !!session,
    displayName: session?.fullName || "",
    userId: session?.userId || "",
    signOut
  };
}
function SignInPage() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/signin"
  });
  const {
    isSignedIn,
    loading: authLoading
  } = useUserAuth();
  const redirectTo = search.redirect || "/";
  const [tab, setTab] = reactExports.useState("signin");
  const [siName, setSiName] = reactExports.useState("");
  const [siPassword, setSiPassword] = reactExports.useState("");
  const [siLoading, setSiLoading] = reactExports.useState(false);
  const [suName, setSuName] = reactExports.useState("");
  const [suPassword, setSuPassword] = reactExports.useState("");
  const [suConfirm, setSuConfirm] = reactExports.useState("");
  const [suLoading, setSuLoading] = reactExports.useState(false);
  const [showAdmin, setShowAdmin] = reactExports.useState(false);
  const [adminEmail, setAdminEmail] = reactExports.useState("");
  const [adminPassword, setAdminPassword] = reactExports.useState("");
  const [adminLoading, setAdminLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!authLoading && isSignedIn) {
      navigate({
        to: redirectTo
      });
    }
  }, [authLoading, isSignedIn, navigate, redirectTo]);
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiLoading(true);
    const res = await userSignIn(siName, siPassword);
    setSiLoading(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({
      to: redirectTo
    });
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (suPassword !== suConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSuLoading(true);
    const res = await userSignUp(suName, suPassword);
    setSuLoading(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Account created! Welcome to Moha.");
    navigate({
      to: redirectTo
    });
  };
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = adminLogin(adminEmail, adminPassword);
    setAdminLoading(false);
    if (!ok) {
      toast.error("Invalid admin credentials");
      return;
    }
    toast.success("Welcome back, Admin.");
    navigate({
      to: "/admin"
    });
  };
  const redirectContext = (() => {
    if (redirectTo.includes("foundations")) {
      return {
        icon: GraduationCap,
        text: "Sign in to continue your bursary application"
      };
    }
    if (redirectTo.includes("advertise")) {
      return {
        icon: Store,
        text: "Sign in to list your business on the Mathare Business Hub"
      };
    }
    return null;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl p-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "My Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Just your name and a password — that's it" })
          ] })
        ] }),
        redirectContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 px-4 py-3 text-sm font-medium text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(redirectContext.icon, { className: "h-4 w-4 text-gold shrink-0" }),
          redirectContext.text
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", children: "Sign In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Create Account" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "signin", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignIn, className: "space-y-4 mt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "si-name", className: "font-semibold", children: "Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "si-name", value: siName, onChange: (e) => setSiName(e.target.value), placeholder: "Jane Wanjiru", className: "pl-9 h-11", required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "si-password", className: "font-semibold", children: "Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "si-password", type: "password", autoComplete: "current-password", value: siPassword, onChange: (e) => setSiPassword(e.target.value), placeholder: "••••••••", className: "pl-9 h-11", required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: siLoading, children: siLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                " Signing in…"
              ] }) : "Sign In" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-center text-muted-foreground", children: [
              "Don't have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("signup"), className: "font-semibold text-primary hover:underline", children: "Create one" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "signup", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignUp, className: "space-y-4 mt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-name", className: "font-semibold", children: "Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "su-name", value: suName, onChange: (e) => setSuName(e.target.value), placeholder: "Jane Wanjiru", className: "pl-9 h-11", required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-password", className: "font-semibold", children: "Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "su-password", type: "password", autoComplete: "new-password", value: suPassword, onChange: (e) => setSuPassword(e.target.value), placeholder: "At least 4 characters", className: "pl-9 h-11", required: true, minLength: 4 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "su-confirm", className: "font-semibold", children: "Confirm Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "su-confirm", type: "password", autoComplete: "new-password", value: suConfirm, onChange: (e) => setSuConfirm(e.target.value), placeholder: "Re-enter password", className: "pl-9 h-11", required: true, minLength: 4 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 text-xs text-blue-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Tip:" }),
                  " Use your National ID number or phone number as your password — it's something you'll always remember."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: suLoading, children: suLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                " Creating account…"
              ] }) : "Create Account" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-center text-muted-foreground", children: [
              "Already have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("signin"), className: "font-semibold text-primary hover:underline", children: "Sign in" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowAdmin((v) => !v), className: "w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Moha Administrator?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${showAdmin ? "rotate-180" : ""}` })
          ] }),
          showAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdminLogin, className: "space-y-3 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: adminEmail, onChange: (e) => setAdminEmail(e.target.value), placeholder: "Admin email", className: "pl-8 h-9 text-xs" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: adminPassword, onChange: (e) => setAdminPassword(e.target.value), placeholder: "Admin password", className: "pl-8 h-9 text-xs" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "outline", size: "sm", className: "w-full", disabled: adminLoading, children: adminLoading ? "Signing in…" : "Admin Sign In" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  SignInPage as component
};

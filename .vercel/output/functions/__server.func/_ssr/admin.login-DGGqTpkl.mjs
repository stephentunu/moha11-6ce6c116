import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./router-CXbsBUWo.mjs";
import { I as Input } from "./input-DKkwU37r.mjs";
import { L as Label } from "./label-CJiRYFTX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { m as isAdminAuthed, a as adminLogin } from "./admin-store-Pu01Ao05.mjs";
import { A as ArrowLeft, g as ShieldCheck, b as Mail, h as Lock, d as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isAdminAuthed()) {
      navigate({
        to: "/admin"
      });
    }
  }, [navigate]);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = adminLogin(email, password);
      setLoading(false);
      if (!ok) {
        toast.error("Invalid credentials", {
          description: "Check your email and password and try again."
        });
        return;
      }
      toast.success("Welcome back, Admin.");
      navigate({
        to: "/admin"
      });
    }, 400);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to public site"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl p-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Admin Console" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Restricted area. Authorized personnel only." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "font-semibold", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@example.com", className: "pl-9 h-11", required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "font-semibold", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "pl-9 h-11", required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
            " Signing in…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Sign in to Dashboard" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[11px] text-center text-muted-foreground", children: "Session is stored locally on this device." })
      ] })
    ] })
  ] });
}
export {
  AdminLoginPage as component
};

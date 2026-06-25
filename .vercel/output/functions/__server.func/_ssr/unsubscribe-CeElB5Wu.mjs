import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useSearch } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./router-CiepFxU2.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function UnsubscribePage() {
  const {
    token
  } = useSearch({
    from: "/unsubscribe"
  });
  const [state, setState] = reactExports.useState("idle");
  const [name, setName] = reactExports.useState("");
  const optOut = async () => {
    if (!token) {
      setState("error");
      return;
    }
    setState("working");
    const {
      data,
      error
    } = await supabase.from("supporters").update({
      opted_out: true
    }).eq("opt_out_token", token).select("name").maybeSingle();
    if (error || !data) {
      setState("error");
      return;
    }
    setName(data.name);
    setState("done");
  };
  reactExports.useEffect(() => {
    if (token) optOut();
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen flex items-center justify-center p-6 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-8 max-w-md w-full text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold mb-3", children: "Unsubscribe" }),
    state === "working" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Processing your request…" }),
    state === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
      name ? `${name}, you have ` : "You have ",
      " been opted out. You will not receive further SMS from Team Moha."
    ] }),
    state === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive mb-4", children: "Invalid or expired link." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: optOut, disabled: !token, children: "Try again" })
    ] })
  ] }) });
}
export {
  UnsubscribePage as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useNavigate, d as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as cn, B as Button } from "./router-CiepFxU2.mjs";
import { j as useAdminAuth, i as useMessages, k as adminLogout } from "./admin-store-Pu01Ao05.mjs";
import { g as ShieldCheck, ai as LayoutDashboard, f as Store, G as GraduationCap, aj as FileText, p as Calendar, ak as ChartColumn, w as Users, al as MessageSquare, af as Inbox, a5 as House, am as LogOut } from "../_libs/lucide-react.mjs";
const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/businesses", label: "Business Moderation", icon: Store },
  { to: "/admin/bursaries", label: "Bursary Applications", icon: GraduationCap },
  { to: "/admin/content", label: "Content Manager", icon: FileText },
  { to: "/admin/activities", label: "Daily Activities", icon: Calendar },
  { to: "/admin/polls", label: "Poll Analytics", icon: ChartColumn },
  { to: "/admin/supporters", label: "Supporters", icon: Users },
  { to: "/admin/sms", label: "Bulk SMS", icon: MessageSquare },
  { to: "/admin/inbox", label: "Message Inbox", icon: Inbox }
];
function AdminLayout({ children, title }) {
  const { authed, ready } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [messages] = useMessages();
  const unread = messages.filter((m) => !m.read).length;
  reactExports.useEffect(() => {
    if (ready && !authed) navigate({ to: "/admin/login" });
  }, [ready, authed, navigate]);
  if (!ready || !authed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-muted-foreground", children: "Verifying session…" });
  }
  const handleLogout = () => {
    adminLogout();
    navigate({ to: "/admin/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[260px_1fr] min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex flex-col bg-primary text-primary-foreground border-r border-primary/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-primary-foreground/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-gold-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold leading-tight", children: "Moha Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Console" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-3 space-y-1", children: NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
              active ? "bg-gold text-gold-foreground" : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: item.label }),
              item.to === "/admin/inbox" && unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 min-w-[20px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center", children: unread })
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-primary-foreground/10 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
              " Back to site"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
              " Sign out"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b border-border sticky top-0 z-30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 lg:px-8 h-16 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg md:text-xl font-bold truncate", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline text-xs text-muted-foreground", children: [
              "Signed in as ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "admin2027" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline ml-1", children: "Home" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleLogout, className: "lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden border-t border-border overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 px-3 py-2 min-w-max", children: NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              className: cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap",
                active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
                item.label
              ]
            },
            item.to
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-4 lg:p-8", children })
    ] })
  ] }) });
}
export {
  AdminLayout as A
};

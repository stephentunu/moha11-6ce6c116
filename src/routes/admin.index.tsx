import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Store, Vote, Inbox as InboxIcon, ArrowUpRight, Activity } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useBusinesses, usePolls, useMessages } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Moha Delivers" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const [businesses] = useBusinesses();
  const [polls] = usePolls();
  const [messages] = useMessages();

  const totalVotes = useMemo(
    () => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0),
    [polls]
  );
  const activeBiz = businesses.filter((b) => b.status === "active").length;
  const suspended = businesses.filter((b) => b.status === "suspended").length;
  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    {
      label: "Total Businesses",
      value: businesses.length,
      sub: `${activeBiz} active · ${suspended} suspended`,
      icon: Store,
      color: "text-primary bg-primary/10",
      to: "/admin/businesses" as const,
    },
    {
      label: "Total Votes Polled",
      value: totalVotes.toLocaleString(),
      sub: `${polls.length} active polls`,
      icon: Vote,
      color: "text-gold bg-gold/10",
      to: "/admin/polls" as const,
    },
    {
      label: "Total Messages",
      value: messages.length,
      sub: `${unread} unread`,
      icon: InboxIcon,
      color: "text-accent bg-accent/10",
      to: "/admin/inbox" as const,
    },
  ];

  const recentMessages = messages.slice(0, 5);
  const recentBusinesses = businesses.slice(0, 5);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                to={s.to}
                className="group bg-card border border-border rounded-2xl p-3 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="mt-2 text-2xl font-display font-black">{s.value}</p>
                <p className="text-xs font-semibold text-foreground mt-1">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {/* Recent messages */}
          <div className="bg-card border border-border rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Recent Messages
              </h2>
              <Link to="/admin/inbox" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="text-xs text-muted-foreground py-5 text-center">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentMessages.map((m) => (
                  <li key={m.id} className="py-2 flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${m.read ? "bg-muted-foreground/40" : "bg-gold"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">
                        {m.name}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          · {m.kind === "ask" ? "Ask Me" : "Opinion"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent businesses */}
          <div className="bg-card border border-border rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-bold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" /> New Listings
              </h2>
              <Link to="/admin/businesses" className="text-xs font-semibold text-primary hover:underline">
                Moderate
              </Link>
            </div>
            {recentBusinesses.length === 0 ? (
              <p className="text-xs text-muted-foreground py-5 text-center">No listings yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentBusinesses.map((b) => (
                  <li key={b.id} className="py-2 flex items-center gap-2">
                    <img
                      src={b.imageUrl}
                      alt={b.businessName}
                      className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{b.businessName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {b.category} · {b.ward}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        b.status === "active"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MessageSquare, Trash2, Check, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { useMessages, deleteMessage, markMessageRead, type Message } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Message Inbox — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminInboxPage,
});

type Filter = "all" | "opinion" | "ask" | "unread";

function AdminInboxPage() {
  const [messages] = useMessages();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "opinion" && m.kind !== "opinion") return false;
      if (filter === "ask" && m.kind !== "ask") return false;
      if (!s) return true;
      return (
        m.name.toLowerCase().includes(s) ||
        m.body.toLowerCase().includes(s) ||
        m.contact.toLowerCase().includes(s)
      );
    });
  }, [messages, q, filter]);

  const selected = messages.find((m) => m.id === selectedId) || filtered[0] || null;

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AdminLayout title="Message Inbox">
      <Toaster />

      <div className="grid gap-4 mb-4 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={messages.length}
          icon={Inbox}
          color="text-primary bg-primary/10"
        />
        <StatCard
          label="Opinions"
          value={messages.filter((m) => m.kind === "opinion").length}
          icon={MessageSquare}
          color="text-accent bg-accent/10"
        />
        <StatCard
          label="Questions"
          value={messages.filter((m) => m.kind === "ask").length}
          icon={Mail}
          color="text-gold bg-gold/10"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-[380px_1fr] min-h-[520px]">
          {/* List */}
          <div className="border-b lg:border-b-0 lg:border-r border-border flex flex-col">
            <div className="p-3 border-b border-border space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "unread", "opinion", "ask"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-semibold capitalize transition",
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {f === "ask" ? "Questions" : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No messages found.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {filtered.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => {
                          setSelectedId(m.id);
                          if (!m.read) markMessageRead(m.id, true);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-muted/50 transition",
                          selected?.id === m.id && "bg-muted/60"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            {!m.read && <span className="h-2 w-2 rounded-full bg-gold shrink-0" />}
                            <p className="font-semibold text-sm truncate">{m.name}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground shrink-0">
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                          {m.body}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            m.kind === "ask"
                              ? "bg-gold/10 text-gold-foreground"
                              : "bg-accent/10 text-accent-foreground"
                          )}
                        >
                          {m.kind === "ask" ? "Question" : "Opinion"}
                        </Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Detail */}
          <div className="p-6">
            {selected ? (
              <MessageDetail message={selected} onDeleted={() => setSelectedId(null)} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Select a message to read.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function MessageDetail({ message, onDeleted }: { message: Message; onDeleted: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Badge
            className={cn(
              "mb-2",
              message.kind === "ask"
                ? "bg-gold/15 text-gold-foreground border-gold/30"
                : "bg-accent/15 text-accent-foreground border-accent/30"
            )}
          >
            {message.kind === "ask" ? "Ask Me" : "Opinion"}
          </Badge>
          <h2 className="font-display text-2xl font-bold">{message.name}</h2>
          <p className="text-sm text-muted-foreground">
            {message.kind === "ask" ? "Contact" : "Ward"}:{" "}
            <span className="font-medium text-foreground">{message.contact}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              markMessageRead(message.id, !message.read);
              toast.success(message.read ? "Marked as unread" : "Marked as read");
            }}
          >
            <Check className="h-4 w-4" />
            {message.read ? "Mark unread" : "Mark read"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              deleteMessage(message.id);
              toast.success("Message deleted");
              onDeleted();
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 border border-border rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed">
        {message.body}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-black leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Vote, TrendingUp, CheckCircle2, MapPin, ChevronDown, Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { usePolls, votePoll, MATHARE_WARDS, type Poll } from "@/lib/admin-store";

export const Route = createFileRoute("/polling")({
  head: () => ({
    meta: [
      { title: "Community Polling — Moha for Mathare" },
      {
        name: "description",
        content:
          "Select your Mathare ward and vote on Moha's initiatives, projects and 2027 MP candidacy. Your voice shapes the manifesto.",
      },
      { property: "og:title", content: "Community Polling — Moha for Mathare" },
      {
        property: "og:description",
        content: "Pick your ward and cast your vote — every voice from Mathare counts.",
      },
    ],
  }),
  component: PollingPage,
});

const RATING_OPTIONS: { id: "best" | "fair" | "worst"; label: string; color: string; bg: string; border: string }[] = [
  { id: "best",  label: "Best",   color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-400" },
  { id: "fair",  label: "Fairly", color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-400"   },
  { id: "worst", label: "Worst",  color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-400"    },
];

function isServicePoll(p: Poll) {
  return p.id.startsWith("p_svc_");
}

function serviceNameFromQuestion(q: string) {
  const m = q.match(/delivery on (.+)\?/i);
  return m ? m[1].trim() : q;
}

function PollingPage() {
  const [polls] = usePolls();
  const [ward, setWard] = useState<string>("");
  const [voted, setVoted] = useState<Record<string, string>>({});

  const { servicePolls, otherPolls } = useMemo(() => {
    const servicePolls = polls.filter(isServicePoll);
    const otherPolls = polls.filter((p) => !isServicePoll(p));
    return { servicePolls, otherPolls };
  }, [polls]);

  const handleVote = (pollId: string, optionId: string) => {
    if (!ward) {
      toast.error("Please select your ward before voting.");
      return;
    }
    if (voted[pollId]) {
      toast.info("You've already rated this service.");
      return;
    }
    votePoll(pollId, optionId, ward);
    setVoted((v) => ({ ...v, [pollId]: optionId }));
    toast.success(`Asante! Your vote from ${ward} ward has been recorded.`);
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Your Voice"
        title="Vote on what matters"
        subtitle="Pick your Mathare ward, then tell Moha where you stand. Every vote shapes the action plan."
      />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Ward selector */}
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-5 md:p-6 mb-8 shadow-elegant">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="text-base md:text-lg font-display font-bold text-foreground">
                  Step 1 — Select your ward
                </h2>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  We use this only to break results down by ward. One vote per question per device.
                </p>
                <Select value={ward} onValueChange={setWard}>
                  <SelectTrigger className="w-full md:max-w-sm">
                    <SelectValue placeholder="Choose your Mathare ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATHARE_WARDS.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {ward && (
                  <p className="mt-2 text-xs font-semibold text-gold">
                    ✓ Voting as a resident of {ward} ward
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Service rating — Best / Fairly / Worst as accordion headers */}
          {servicePolls.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 mb-8 shadow-elegant">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
                    Rate how the following services are offered in Mathare by the Government and people's Representatives
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click a rating, then tick the services it applies to. One vote per service per device.
                  </p>
                </div>
              </div>

              {/* Three rating headers in the same row */}
              <div className="grid grid-cols-3 gap-3">
                {RATING_OPTIONS.map((rating) => (
                  <RatingAccordion
                    key={rating.id}
                    rating={rating}
                    polls={servicePolls}
                    voted={voted}
                    ward={ward}
                    onVote={handleVote}
                  />
                ))}
              </div>

              {!ward && (
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  ↑ Select your ward above to unlock voting.
                </p>
              )}
            </div>
          )}

          {/* Other polls */}
          <div className="space-y-6">
            {otherPolls.map((poll, i) => {
              const userVote = voted[poll.id];
              const locked = !ward;

              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-elegant"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Vote className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-display font-bold text-foreground text-balance">
                        {poll.question}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Results are kept private and shared with Moha's team only.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const isUserChoice = userVote === opt.id;
                      const voteCast = !!userVote;
                      const disabled = locked || voteCast;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVote(poll.id, opt.id)}
                          disabled={disabled}
                          className={cn(
                            "w-full text-left rounded-xl border-2 transition-all px-4 py-3 flex items-center justify-between gap-3",
                            disabled && !isUserChoice
                              ? "border-border cursor-not-allowed opacity-60"
                              : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer",
                            isUserChoice && "border-gold bg-gold/5 opacity-100",
                          )}
                        >
                          <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
                            {isUserChoice && <CheckCircle2 className="h-4 w-4 text-gold" />}
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {userVote ? (
                    <p className="mt-3 text-xs font-semibold text-gold">
                      ✓ Asante! Your vote from {ward} ward has been recorded.
                    </p>
                  ) : locked ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Select your ward above to unlock voting.
                    </p>
                  ) : null}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="lg">
              <a href="/opinion">Have a different idea? Send a message</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── RatingAccordion ──────────────────────────────────────────────────────────
// Each rating option (Best / Fairly / Worst) is its own collapsible header.
// All three sit side-by-side in a row. Opening one reveals a checklist of
// services the voter can tick.

function RatingAccordion({
  rating,
  polls,
  voted,
  ward,
  onVote,
}: {
  rating: { id: "best" | "fair" | "worst"; label: string; color: string; bg: string; border: string };
  polls: Poll[];
  voted: Record<string, string>;
  ward: string;
  onVote: (pollId: string, optionId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const locked = !ward;
  const countVoted = polls.filter((p) => voted[p.id] === rating.id).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "w-full flex flex-col items-center justify-center gap-1.5 px-3 py-4 rounded-xl border-2 transition-all",
          "border-border hover:bg-muted/40",
          open && rating.border,
          open && rating.bg,
        )}
      >
        <span className={cn("text-base md:text-lg font-display font-bold", rating.color)}>
          {rating.label}
        </span>
        {countVoted > 0 && (
          <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", rating.bg, rating.color)}>
            {countVoted} voted
          </span>
        )}
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 rounded-xl border border-border overflow-hidden">
          {locked && (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              Select your ward above to unlock voting.
            </p>
          )}
          {polls.map((p) => {
            const userVote = voted[p.id];
            const votedThisRating = userVote === rating.id;
            const votedOtherRating = !!userVote && userVote !== rating.id;
            const service = serviceNameFromQuestion(p.question);
            const disabled = locked || votedOtherRating;

            return (
              <label
                key={p.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors",
                  disabled
                    ? "opacity-50 cursor-not-allowed bg-muted/20"
                    : votedThisRating
                      ? cn("cursor-default", rating.bg)
                      : "cursor-pointer hover:bg-muted/30",
                )}
              >
                <Checkbox
                  checked={votedThisRating}
                  onCheckedChange={() => {
                    if (!disabled && !userVote) onVote(p.id, rating.id);
                  }}
                  disabled={disabled || !!userVote}
                  className={cn(
                    rating.id === "best"
                      ? "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      : rating.id === "fair"
                        ? "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        : "data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600",
                  )}
                />
                <span className="text-sm font-medium text-foreground leading-tight flex-1">
                  {service}
                </span>
                {votedThisRating && (
                  <CheckCircle2 className={cn("h-4 w-4 shrink-0", rating.color)} />
                )}
                {votedOtherRating && (
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase shrink-0">
                    Rated {RATING_OPTIONS.find((r) => r.id === userVote)?.label}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
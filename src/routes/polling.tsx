import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, TrendingUp, CheckCircle2, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { usePolls, votePoll, MATHARE_WARDS } from "@/lib/admin-store";

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

function PollingPage() {
  const [polls] = usePolls();
  const [ward, setWard] = useState<string>("");
  const [voted, setVoted] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    if (!ward) {
      toast.error("Please select your ward before voting.");
      return;
    }
    if (voted[pollId]) return;
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
        subtitle="Pick your Mathare ward, then tell Moha where you stand on his initiatives, projects and 2027 MP bid. Every vote shapes the action plan."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Ward selector */}
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 md:p-8 mb-10 shadow-elegant">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                  Step 1 — Select your ward
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
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
                  <p className="mt-3 text-xs font-semibold text-gold">
                    ✓ Voting as a resident of {ward} ward
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {polls.map((poll, i) => {
              const userVote = voted[poll.id];
              const locked = !ward;

              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Vote className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-foreground text-balance">
                        {poll.question}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Results are kept private and shared with Moha's team only.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
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
                            "w-full text-left relative rounded-xl border-2 transition-all overflow-hidden",
                            disabled && !isUserChoice
                              ? "border-border cursor-not-allowed opacity-60"
                              : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer",
                            isUserChoice && "border-gold bg-gold/5 opacity-100"
                          )}
                        >
                          <div className="relative px-5 py-4 flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 font-semibold text-foreground">
                              {isUserChoice && <CheckCircle2 className="h-4 w-4 text-gold" />}
                              {opt.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {userVote ? (
                    <p className="mt-4 text-xs font-semibold text-gold">
                      ✓ Asante! Your vote from {ward} ward has been recorded privately.
                    </p>
                  ) : locked ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Select your ward above to unlock voting.
                    </p>
                  ) : (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Tap an option to cast your vote.
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="lg">
              <a href="/opinion">Have a different idea? Send a message</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

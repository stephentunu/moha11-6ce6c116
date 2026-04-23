import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, TrendingUp, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/polling")({
  head: () => ({
    meta: [
      { title: "Community Polling — Moha for Mathare" },
      {
        name: "description",
        content: "Vote on the issues that matter most to Mathare. Your voice shapes the manifesto.",
      },
      { property: "og:title", content: "Community Polling — Moha for Mathare" },
      {
        property: "og:description",
        content: "Vote on Mathare's biggest issues — your voice counts.",
      },
    ],
  }),
  component: PollingPage,
});

interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number }[];
}

const initialPolls: Poll[] = [
  {
    id: "p1",
    question: "What is the #1 issue Mathare needs solved first?",
    options: [
      { id: "a", label: "Youth unemployment", votes: 4820 },
      { id: "b", label: "Drainage & flooding", votes: 3210 },
      { id: "c", label: "Insecurity at night", votes: 2870 },
      { id: "d", label: "Affordable healthcare", votes: 3540 },
    ],
  },
  {
    id: "p2",
    question: "Where should the next youth hub be built?",
    options: [
      { id: "a", label: "Mathare 4A", votes: 1820 },
      { id: "b", label: "Huruma", votes: 2110 },
      { id: "c", label: "Mlango Kubwa", votes: 1560 },
      { id: "d", label: "Hospital Ward", votes: 1340 },
    ],
  },
  {
    id: "p3",
    question: "Which education program should we expand next?",
    options: [
      { id: "a", label: "University tuition fund", votes: 2400 },
      { id: "b", label: "Digital learning labs", votes: 3120 },
      { id: "c", label: "TVET scholarships", votes: 1980 },
      { id: "d", label: "Adult literacy classes", votes: 980 },
    ],
  },
];

function PollingPage() {
  const [polls, setPolls] = useState(initialPolls);
  const [voted, setVoted] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    if (voted[pollId]) return;
    setPolls((prev) =>
      prev.map((p) =>
        p.id !== pollId
          ? p
          : {
              ...p,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o
              ),
            }
      )
    );
    setVoted((v) => ({ ...v, [pollId]: optionId }));
    toast.success("Asante! Your vote has been recorded.");
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Your Voice"
        title="Vote on what matters"
        subtitle="Real-time community polls. Tell Moha what to prioritize next — every vote shapes the action plan."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-8">
            {polls.map((poll, i) => {
              const total = poll.options.reduce((s, o) => s + o.votes, 0);
              const userVote = voted[poll.id];

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
                        {total.toLocaleString()} votes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {poll.options.map((opt) => {
                      const pct = total > 0 ? (opt.votes / total) * 100 : 0;
                      const isUserChoice = userVote === opt.id;
                      const showResults = !!userVote;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVote(poll.id, opt.id)}
                          disabled={showResults}
                          className={cn(
                            "w-full text-left relative rounded-xl border-2 transition-all overflow-hidden",
                            showResults
                              ? "border-border cursor-default"
                              : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer",
                            isUserChoice && "border-gold bg-gold/5"
                          )}
                        >
                          {showResults && (
                            <div
                              className={cn(
                                "absolute inset-y-0 left-0 transition-all duration-700",
                                isUserChoice ? "bg-gold/20" : "bg-primary/10"
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          )}
                          <div className="relative px-5 py-4 flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 font-semibold text-foreground">
                              {isUserChoice && <CheckCircle2 className="h-4 w-4 text-gold" />}
                              {opt.label}
                            </span>
                            {showResults && (
                              <span className="text-sm font-bold text-foreground">
                                {pct.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!userVote && (
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

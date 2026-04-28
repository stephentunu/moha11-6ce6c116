import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Loader2, MessageCircleQuestion } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { addMessage } from "@/lib/admin-store";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask Moha — Direct Q&A" },
      {
        name: "description",
        content:
          "Ask Moha anything — about the manifesto, his vision for Mathare, or how to get involved.",
      },
      { property: "og:title", content: "Ask Moha — Direct Q&A" },
      {
        property: "og:description",
        content: "Your questions deserve answers.",
      },
    ],
  }),
  component: AskPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(5, "Phone or email required").max(120),
  question: z.string().trim().min(10, "Ask a real question").max(800),
});

const popularQs = [
  "What's your plan for youth unemployment?",
  "How will you handle insecurity in Mathare?",
  "Where can I find your full manifesto?",
  "How do I volunteer for the campaign?",
  "What is the bursary application process?",
];

function AskPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", contact: "", question: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addMessage({ kind: "ask", name: data.name, contact: data.contact, body: data.question });
      setLoading(false);
      toast.success("Question received! Moha or his team will get back to you.");
      setData({ name: "", contact: "", question: "" });
    }, 800);
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Direct Line"
        title="Ask Moha anything."
        subtitle="No filters. No PR speak. Submit your question and get a real answer from Moha or his team."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <form
              onSubmit={submit}
              className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant space-y-5"
            >
              <div>
                <Label htmlFor="name" className="font-bold mb-2 block">
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  maxLength={100}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact" className="font-bold mb-2 block">
                  Phone or Email
                </Label>
                <Input
                  id="contact"
                  placeholder="07XX or you@email.com"
                  value={data.contact}
                  maxLength={120}
                  onChange={(e) => setData((d) => ({ ...d, contact: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="question" className="font-bold mb-2 block">
                  Your Question
                </Label>
                <Textarea
                  id="question"
                  placeholder="Ask Moha…"
                  value={data.question}
                  maxLength={800}
                  onChange={(e) => setData((d) => ({ ...d, question: e.target.value }))}
                  className="min-h-[140px]"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Ask Moha
                  </>
                )}
              </Button>
            </form>

            {/* Popular */}
            <aside className="lg:col-span-2">
              <div className="sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-gold" />
                  Popular questions
                </h3>
                <ul className="space-y-2">
                  {popularQs.map((q, i) => (
                    <motion.li
                      key={q}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <button
                        type="button"
                        onClick={() => setData((d) => ({ ...d, question: q }))}
                        className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition text-sm text-foreground"
                      >
                        {q}
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Tip: try the floating chat (bottom-right) for instant manifesto answers from Moha's AI.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
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
import { seoMeta, seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: seoMeta({
      title: "Ask Moha — Direct Q&A",
      description: "Ask Moha anything — about the manifesto, his vision for Mathare, or how to get involved.",
      path: "/ask",
    }),
    links: seoLinks("/ask"),
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
  const { t } = useLanguage();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(t(result.error.issues[0].message));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addMessage({ kind: "ask", name: data.name, contact: data.contact, body: data.question });
      setLoading(false);
      toast.success(t("Question received! Moha or his team will get back to you."));
      setData({ name: "", contact: "", question: "" });
    }, 800);
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow={t("Direct Line")}
        title={t("Ask Moha anything.")}
        subtitle={t("No filters. No PR speak. Submit your question and get a real answer from Moha or his team.")}
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
                  {t("Your Name")}
                </Label>
                <Input
                  id="name"
                  placeholder={t("Enter your name...")}
                  value={data.name}
                  maxLength={100}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact" className="font-bold mb-2 block">
                  {t("Phone or Email")}
                </Label>
                <Input
                  id="contact"
                  placeholder={t("07XX or you@email.com")}
                  value={data.contact}
                  maxLength={120}
                  onChange={(e) => setData((d) => ({ ...d, contact: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="question" className="font-bold mb-2 block">
                  {t("Your Question")}
                </Label>
                <Textarea
                  id="question"
                  placeholder={t("Ask Moha…")}
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
                    <Loader2 className="h-5 w-5 animate-spin" /> {t("Submitting...")}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" /> {t("Ask Moha")}
                  </>
                )}
              </Button>
            </form>

            {/* Popular */}
            <aside className="lg:col-span-2">
              <div className="sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-gold" />
                  {t("Popular questions")}
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
                        {t(q)}
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  {t("Tip: try the floating chat (bottom-right) for instant manifesto answers from Moha's AI.")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
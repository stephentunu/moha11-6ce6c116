import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/opinion")({
  head: () => ({
    meta: [
      { title: "Send Your Opinion — Moha for Mathare" },
      {
        name: "description",
        content:
          "Tell Moha what Mathare needs. Every voice shapes the manifesto and the work.",
      },
      { property: "og:title", content: "Send Your Opinion — Moha for Mathare" },
      {
        property: "og:description",
        content: "Your message. Real action.",
      },
    ],
  }),
  component: OpinionPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  ward: z.string().trim().min(2, "Tell us your ward").max(60),
  message: z.string().trim().min(10, "Share a bit more").max(1000),
});

function OpinionPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", ward: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Asante! Your message has reached Moha's team.");
      setData({ name: "", ward: "", message: "" });
    }, 1200);
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Speak Up"
        title="Your message. Real action."
        subtitle="Tell us what Mathare needs — ideas, complaints, suggestions, encouragement. Moha's team reads every single message."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <form
            onSubmit={submit}
            className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-elegant space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
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
                <Label htmlFor="ward" className="font-bold mb-2 block">
                  Ward / Estate
                </Label>
                <Input
                  id="ward"
                  placeholder="e.g. Mlango Kubwa"
                  value={data.ward}
                  maxLength={60}
                  onChange={(e) => setData((d) => ({ ...d, ward: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message" className="font-bold mb-2 block">
                Your Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell Moha what's on your mind…"
                value={data.message}
                maxLength={1000}
                onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                className="min-h-[160px] resize-y"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {data.message.length}/1000
              </p>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" /> Send to Moha
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

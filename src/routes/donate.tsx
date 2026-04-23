import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, CreditCard, CheckCircle2, Loader2, Heart, Shield } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Power Moha's Movement | Mathare 2027" },
      {
        name: "description",
        content:
          "Support Moha's 2027 campaign for Mathare via M-Pesa or Card. From KSh 500 to KSh 10,000 — every shilling delivers.",
      },
      { property: "og:title", content: "Donate — Power the Movement" },
      {
        property: "og:description",
        content: "M-Pesa or Card. Every shilling moves Mathare forward.",
      },
    ],
  }),
  component: DonatePage,
});

const tiers = [500, 1000, 2500, 5000, 10000];

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+?254|0)?(7\d{8}|1\d{8})$/, "Enter a valid Kenyan phone number");

function DonatePage() {
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const finalAmount = custom ? Number(custom) : amount;

  const handleMpesa = (e: React.FormEvent) => {
    e.preventDefault();
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum donation is KSh 10");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      toast.success(`STK Push sent to ${phone}. Enter your M-Pesa PIN.`);
    }, 2200);
  };

  const handleCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum donation is KSh 10");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      toast.success("Card payment confirmation sent to your email.");
    }, 1800);
  };

  if (status === "success") {
    return (
      <>
        <Toaster />
        <PageHero eyebrow="Asante Sana" title="You powered the movement" />
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
              className="mx-auto h-24 w-24 rounded-full bg-gold flex items-center justify-center shadow-gold mb-6"
            >
              <CheckCircle2 className="h-12 w-12 text-gold-foreground" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Asante kwa kuwa pamoja nasi!
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Your contribution of{" "}
              <span className="font-bold text-primary">KSh {finalAmount.toLocaleString()}</span>{" "}
              is fueling real change in Mathare. We'll send a receipt shortly.
            </p>
            <Button
              variant="hero"
              size="lg"
              className="mt-8"
              onClick={() => {
                setStatus("idle");
                setPhone("");
                setName("");
              }}
            >
              Donate Again
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Power the Movement"
        title="Every shilling delivers."
        subtitle="From KSh 500 to KSh 10,000 — your donation funds bursaries, clinics, clean-ups, and youth programs across Mathare."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-elegant">
            {/* Method tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-8">
              <button
                onClick={() => setMethod("mpesa")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all",
                  method === "mpesa"
                    ? "bg-card text-primary shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Smartphone className="h-4 w-4" />
                M-PESA
              </button>
              <button
                onClick={() => setMethod("card")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all",
                  method === "card"
                    ? "bg-card text-primary shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Card
              </button>
            </div>

            {/* Amount tiers */}
            <div className="mb-8">
              <Label className="text-sm font-bold text-foreground mb-3 block">
                Choose an amount (KSh)
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {tiers.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setAmount(t);
                      setCustom("");
                    }}
                    className={cn(
                      "py-4 rounded-xl font-bold transition-all border-2",
                      amount === t && !custom
                        ? "bg-gradient-gold text-gold-foreground border-gold shadow-gold"
                        : "bg-card text-foreground border-border hover:border-primary"
                    )}
                  >
                    {t.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <Input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={custom}
                  min={10}
                  max={5000000}
                  onChange={(e) => setCustom(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {/* Forms */}
            {method === "mpesa" ? (
              <form onSubmit={handleMpesa} className="space-y-5">
                <div>
                  <Label htmlFor="phone" className="text-sm font-bold mb-2 block">
                    M-Pesa Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={15}
                    className="h-12 text-lg"
                    required
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    You will receive an STK Push prompt to confirm.
                  </p>
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm">
                  <p className="font-bold text-foreground mb-1">Or use Paybill manually:</p>
                  <p className="text-muted-foreground">
                    Paybill:{" "}
                    <span className="font-mono font-bold text-primary">247247</span> • Account:{" "}
                    <span className="font-mono font-bold text-primary">MOHA2027</span>
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending STK Push…
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" /> Support Moha — KSh{" "}
                      {finalAmount.toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCard} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold mb-2 block">
                    Cardholder Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card" className="text-sm font-bold mb-2 block">
                    Card Number
                  </Label>
                  <Input
                    id="card"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="h-12 font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="exp" className="text-sm font-bold mb-2 block">
                      Expiry
                    </Label>
                    <Input id="exp" placeholder="MM/YY" maxLength={5} className="h-12 font-mono" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-bold mb-2 block">
                      CVV
                    </Label>
                    <Input id="cvv" placeholder="123" maxLength={4} className="h-12 font-mono" required />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" /> Donate KSh {finalAmount.toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="mt-6 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Secure payment. Your information is never shared.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

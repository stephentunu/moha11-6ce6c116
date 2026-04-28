import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Upload,
  Plus,
  Store,
  Scissors,
  UtensilsCrossed,
  ShoppingBasket,
  Wrench,
  Shirt,
  Stethoscope,
  GraduationCap,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise With Us — Mathare Business Hub | Moha Delivers" },
      {
        name: "description",
        content:
          "List your Mathare business on the Moha Business Hub. Reach customers across Mabatini, Huruma, Hospital, Kiamaiko, Ngei and Mlango Kubwa wards.",
      },
      {
        property: "og:title",
        content: "Advertise With Us — Mathare Business Hub",
      },
      {
        property: "og:description",
        content:
          "Supporting Mathare Businesses — Moha Delivers. Free directory for local entrepreneurs.",
      },
    ],
  }),
  component: AdvertisePage,
});

const WARDS = [
  "Mabatini",
  "Huruma",
  "Hospital",
  "Kiamaiko",
  "Ngei",
  "Mlango Kubwa",
] as const;

const CATEGORIES = [
  { value: "Groceries & Mboga", icon: ShoppingBasket },
  { value: "Food & Restaurant", icon: UtensilsCrossed },
  { value: "Salon & Barber", icon: Scissors },
  { value: "Tailoring & Fashion", icon: Shirt },
  { value: "Hardware & Repair", icon: Wrench },
  { value: "Health & Pharmacy", icon: Stethoscope },
  { value: "Education & Tutoring", icon: GraduationCap },
  { value: "Beauty & Cosmetics", icon: Sparkles },
  { value: "General Shop", icon: Store },
] as const;

type Business = {
  id: string;
  ownerName: string;
  businessName: string;
  category: string;
  ward: string;
  location: string;
  phone: string;
  description: string;
  imageUrl: string;
};

function categoryIcon(name: string) {
  const found = CATEGORIES.find((c) => c.value === name);
  return found ? found.icon : Store;
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("7") || digits.startsWith("1")) return "254" + digits;
  return digits;
}

function whatsappLink(phone: string, businessName: string) {
  const normalized = normalizePhone(phone);
  const text = encodeURIComponent(
    `Hello, I found ${businessName} on the Moha Mathare Business Hub. I'd like to enquire about your services.`
  );
  return `https://wa.me/${normalized}?text=${text}`;
}

type FormState = {
  ownerName: string;
  businessName: string;
  category: string;
  ward: string;
  location: string;
  phone: string;
  description: string;
  imageUrl: string;
};

const EMPTY_FORM: FormState = {
  ownerName: "",
  businessName: "",
  category: "",
  ward: "",
  location: "",
  phone: "",
  description: "",
  imageUrl: "",
};

function AdvertisePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return businesses.filter((b) => {
      if (wardFilter !== "all" && b.ward !== wardFilter) return false;
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        b.businessName.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q)
      );
    });
  }, [businesses, search, wardFilter, categoryFilter]);

  const handleAdd = (b: Business) => {
    setBusinesses((prev) => [b, ...prev]);
    toast.success("Your business is now live on the hub!", {
      description: "Residents can now find and contact you on WhatsApp.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="Mathare Business Hub"
        title="Advertise With Us"
        subtitle="Supporting Mathare Businesses — Moha Delivers. List your hustle for free and reach customers across all six wards."
      />

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-elegant p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold">
              Ready to grow your customer base?
            </h2>
            <p className="text-sm text-muted-foreground">
              List your business in under 2 minutes. Always free.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="hero" onClick={() => setOpen(true)}>
              <Plus className="h-5 w-5" />
              Advertise Your Business
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("marketplace")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </section>

      <section id="marketplace" className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            {businesses.length} businesses listed
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4">
            Mathare's <span className="text-gradient-primary">Marketplace</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover trusted local businesses run by your neighbours. Filter by
            ward or category to find exactly what you need.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses, owners or services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <div className="md:col-span-3">
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Wards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wards</SelectItem>
                  {WARDS.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(wardFilter !== "all" || categoryFilter !== "all" || search) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Active filters:
              </span>
              {wardFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {wardFilter}
                  <button
                    onClick={() => setWardFilter("all")}
                    aria-label="Clear ward filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {categoryFilter}
                  <button
                    onClick={() => setCategoryFilter("all")}
                    aria-label="Clear category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1">
                  "{search}"
                  <button onClick={() => setSearch("")} aria-label="Clear search">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              No businesses match your search
            </h3>
            <p className="text-muted-foreground mb-6">
              Try clearing filters or be the first to list in this category.
            </p>
            <Button onClick={() => setOpen(true)} variant="hero">
              <Plus className="h-4 w-4" />
              List Your Business
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((b, i) => (
                <BusinessCard key={b.id} business={b} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="container mx-auto px-4 lg:px-8 pb-20">
        <div className="bg-gradient-primary rounded-3xl p-8 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-5xl font-black text-primary-foreground mb-4">
            Your hustle deserves to be seen
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of Mathare entrepreneurs growing their customer base
            through Moha's free community marketplace.
          </p>
          <Button
            size="xl"
            variant="hero"
            onClick={() => setOpen(true)}
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Plus className="h-5 w-5" />
            Advertise Your Business — Free
          </Button>
        </div>
      </section>

      <RegistrationDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleAdd}
      />
    </div>
  );
}

function BusinessCard({ business, index }: { business: Business; index: number }) {
  const Icon = categoryIcon(business.category);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={business.imageUrl}
          alt={business.businessName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-background/95 text-foreground border border-border backdrop-blur-sm gap-1.5">
            <MapPin className="h-3 w-3" />
            {business.ward} Ward
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          {business.category}
        </p>
        <h3 className="font-display text-xl font-bold mb-1 line-clamp-1">
          {business.businessName}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
          {business.description || `Run by ${business.ownerName}`}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{business.location}</span>
        </div>
        <a
          href={whatsappLink(business.phone, business.businessName)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Contact via WhatsApp
        </a>
      </div>
    </motion.article>
  );
}

function RegistrationDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (b: Business) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep(0);
    setForm(EMPTY_FORM);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      // small delay so closing animation doesn't show reset state
      setTimeout(reset, 200);
    }
    onOpenChange(v);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please upload an image under 5MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("imageUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (!form.ownerName.trim()) return "Please enter your name";
      if (!form.businessName.trim()) return "Please enter your business name";
      if (!form.category) return "Please choose a business category";
    }
    if (s === 1) {
      if (!form.ward) return "Please select your ward";
      if (!form.location.trim()) return "Please enter your street/location";
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 9) return "Please enter a valid WhatsApp number";
    }
    if (s === 2) {
      if (!form.imageUrl) return "Please upload a photo of your business";
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateStep(2);
    if (err) {
      toast.error(err);
      return;
    }
    onSubmit({
      id: `b-${Date.now()}`,
      ownerName: form.ownerName.trim(),
      businessName: form.businessName.trim(),
      category: form.category,
      ward: form.ward,
      location: form.location.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl,
    });
    handleClose(false);
  };

  const steps = ["About You", "Location & Contact", "Photo & Launch"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            List Your Business
          </DialogTitle>
          <DialogDescription>
            Free for every Mathare entrepreneur. Takes about 2 minutes.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 my-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-muted rounded-full" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Your Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g. Jane Wanjiku"
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g. Jane's Fresh Mboga"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => update("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => {
                        const Icon = c.icon;
                        return (
                          <SelectItem key={c.value} value={c.value}>
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {c.value}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Ward *</Label>
                  <Select
                    value={form.ward}
                    onValueChange={(v) => update("ward", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Mathare ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {WARDS.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Street / Precise Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Opposite Huruma Stage, 1st floor"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp / Phone Contact *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="pl-9"
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customers will reach you here on WhatsApp.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What do you sell or offer?"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    maxLength={200}
                    rows={3}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Business Photo *</Label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                  {form.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-border">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => update("imageUrl", "")}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/95 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Upload className="h-8 w-8" />
                      <span className="font-semibold">Click to upload photo</span>
                      <span className="text-xs">JPG or PNG, up to 5MB</span>
                    </button>
                  )}
                </div>

                <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1">
                  <p className="font-semibold text-foreground">Preview:</p>
                  <p>
                    <span className="text-muted-foreground">Business:</span>{" "}
                    {form.businessName || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ward:</span>{" "}
                    {form.ward || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    {form.category || "—"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button type="button" variant="default" onClick={next}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" variant="hero">
                <CheckCircle2 className="h-4 w-4" />
                Publish My Business
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

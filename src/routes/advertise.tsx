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
  ExternalLink,
  Truck,
  Bus,
  Share2,
  Globe,
  Banknote,
  Briefcase,
  HardHat,
  Monitor,
  Music,
  Church,
  Home,
  Settings,
  Sofa,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import {
  useBusinesses,
  addBusiness,
  addMessage,
  type Business as StoreBusiness,
  type PaymentMethod,
} from "@/lib/admin-store";
import { useLoyalty, shareBusiness } from "@/lib/loyalty";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise With Us — Mathare Business Hub | Moha Delivers" },
      {
        name: "description",
        content:
          "List your Mathare business on the Moha Business Hub. Multiple photos, payment options, delivery info — free for every hustler.",
      },
      { property: "og:title", content: "Advertise With Us — Mathare Business Hub" },
      {
        property: "og:description",
        content: "Supporting Mathare Businesses — Moha Delivers. Free directory for local entrepreneurs.",
      },
    ],
  }),
  component: AdvertisePage,
});

const WARDS = ["Mabatini", "Huruma", "Hospital", "Kiamaiko", "Ngei", "Mlango Kubwa"] as const;

const CATEGORIES = [
  { value: "Beauty and Skincare- Cosmetics, Salons, Barbershops & Related", icon: Sparkles },
  { value: "Building and Construction -Electrical, Plumbing & Hardware", icon: HardHat },
  { value: "Clothing and Fashion -Uniforms, Shoes, Clothes & Related", icon: Shirt },
  { value: "Consultancy, Job Offers and Seeking", icon: Briefcase },
  { value: "Education and Training -Bookshops, Colleges, Teaching & Related", icon: GraduationCap },
  { value: "Electronics – Phones, Computers, TVs & Related", icon: Monitor },
  { value: "Entertainment – Pubs, Night Clubs, Video Shows & Related", icon: Music },
  { value: "Evangelical, Crusades and Worship", icon: Church },
  { value: "Food -Hotels, Water, Butcheries & Related", icon: UtensilsCrossed },
  { value: "General Shops and Vending– Retail, Wholesale, Agrovets & Related", icon: Store },
  { value: "Groceries and Fish -Fresh Farm Produce & Related", icon: ShoppingBasket },
  { value: "Health -Pharmacies, Chemicals, Fitness Centres & Related", icon: Stethoscope },
  { value: "Home Accessories – Juakali, Garden, Kitchen, Furniture & Related", icon: Sofa },
  { value: "Machinery and Spare Shops – Cars, Motorbikes, Electronics & Related", icon: Settings },
  { value: "Photography – Portraits, Events, Passports & Related", icon: Sparkles },
  { value: "Artwork and Drawing – Paintings, Illustrations, Graphic Design & Related", icon: Monitor },
  { value: "Property and Houses to Rent, Sale or Lease", icon: Home },
  { value: "Services – Repairs, Cleaning, Transport, Garage, Printing & Related", icon: Wrench },
] as const;

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "send_money", label: "Send Money" },
  { value: "pochi", label: "Pochi la Biashara" },
  { value: "till", label: "Till Number" },
  { value: "paybill", label: "Paybill" },
  { value: "cash", label: "Cash" },
];

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  send_money: "Send Money",
  pochi: "Pochi la Biashara",
  till: "Till",
  paybill: "Paybill",
  cash: "Cash",
};

type Business = StoreBusiness;

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
    `Hello, I found ${businessName} on the Moha Mathare Business Hub. I'd like to enquire about your services.`,
  );
  return `https://wa.me/${normalized}?text=${text}`;
}

type FormState = {
  ownerName: string;
  businessName: string;
  category: string;
  ward: string;
  location: string;
  street: string;
  phone: string;
  contacts: string;
  description: string;
  websiteUrl: string;
  imageUrls: string[];
  paymentMethods: PaymentMethod[];
  tillPaybillNumber: string;
  nearestTransport: string;
  deliveryAvailable: boolean;
  dataConsent: boolean;
};

const EMPTY_FORM: FormState = {
  ownerName: "",
  businessName: "",
  category: "",
  ward: "",
  location: "",
  street: "",
  phone: "",
  contacts: "",
  description: "",
  websiteUrl: "",
  imageUrls: [],
  paymentMethods: [],
  tillPaybillNumber: "",
  nearestTransport: "",
  deliveryAvailable: false,
  dataConsent: false,
};

function AdvertisePage() {
  const [allBusinesses] = useBusinesses();
  const businesses = useMemo(
    () => allBusinesses.filter((b) => b.status === "active"),
    [allBusinesses],
  );
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

  const handleAdd = async (b: Business) => {
    try {
      await addBusiness(b);
      toast.success("Your business is now live on the hub!", {
        description: "Residents can now find and contact you on WhatsApp.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not save your listing", {
        description: "Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="Mathare Business Hub"
        title="Advertise With Us"
        subtitle="Supporting Mathare Businesses — Moha Delivers. List your hustle for free with photos, payment options and delivery info."
      />

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-elegant p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold">Ready to grow your customer base?</h2>
            <p className="text-sm text-muted-foreground">List your business in under 2 minutes. Always free.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="hero" onClick={() => setOpen(true)}>
              <Plus className="h-5 w-5" />
              Advertise Your Business
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })}
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
            Discover trusted local businesses run by your neighbours. Filter by ward or category to find exactly what you need.
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
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active filters:</span>
              {wardFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {wardFilter}
                  <button onClick={() => setWardFilter("all")} aria-label="Clear ward filter">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter("all")} aria-label="Clear category filter">
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

        {filtered.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">No businesses match your search</h3>
            <p className="text-muted-foreground mb-6">Try clearing filters or be the first to list in this category.</p>
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

      <section className="container mx-auto px-4 lg:px-8 pb-20">
        <div className="bg-gradient-primary rounded-3xl p-8 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-5xl font-black text-primary-foreground mb-4">
            Your hustle deserves to be seen
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of Mathare entrepreneurs growing their customer base through Moha's free community marketplace.
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

      <RegistrationDialog open={open} onOpenChange={setOpen} onSubmit={handleAdd} />
    </div>
  );
}

function BusinessCard({ business, index }: { business: Business; index: number }) {
  const Icon = categoryIcon(business.category);
  const loyalty = useLoyalty();
  const images = business.imageUrls.length ? business.imageUrls : business.imageUrl ? [business.imageUrl] : [];
  const [editOpen, setEditOpen] = useState(false);

  const handleShare = async () => {
    const result = await shareBusiness(business);
    if (result.shared) return;
    if (result.copied) toast.success("Link copied — share it with friends!");
    else toast.info(result.url);
  };

  const ImgWrap = ({ children }: { children: React.ReactNode }) =>
    business.websiteUrl ? (
      <a
        href={business.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
        aria-label={`Open ${business.businessName} website`}
      >
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <motion.article
      id={`biz-${business.id}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {images.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {images.map((src, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div className="relative w-full aspect-[4/3]">
                    <ImgWrap>
                      <img
                        src={src}
                        alt={`${business.businessName} photo ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </ImgWrap>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <ImgWrap>
            <img
              src={images[0]}
              alt={business.businessName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </ImgWrap>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-background/95 text-foreground border border-border backdrop-blur-sm gap-1.5">
            <MapPin className="h-3 w-3" />
            {business.ward} Ward
          </Badge>
          {business.deliveryAvailable && (
            <Badge className="bg-emerald-600 text-white border-none gap-1.5">
              <Truck className="h-3 w-3" />
              Delivery
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {business.websiteUrl && (
            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Open website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <div className="h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 line-clamp-1">{business.category}</p>
        <h3 className="font-display text-xl font-bold mb-1 line-clamp-1">{business.businessName}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
          {business.description || `Run by ${business.ownerName}`}
        </p>

        <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{business.street || business.location}</span>
          </div>
          {business.nearestTransport && (
            <div className="flex items-center gap-1.5">
              <Bus className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{business.nearestTransport}</span>
            </div>
          )}
        </div>

        {business.paymentMethods.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {business.paymentMethods.map((m) => (
              <Badge key={m} variant="outline" className="text-[10px] gap-1">
                <Banknote className="h-3 w-3" />
                {PAYMENT_LABELS[m]}
                {(m === "till" || m === "paybill") && business.tillPaybillNumber
                  ? ` ${business.tillPaybillNumber}`
                  : ""}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={whatsappLink(business.phone, business.businessName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Contact via WhatsApp
          </a>
          {loyalty.unlocked && (
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold transition-colors text-sm"
            >
              <Share2 className="h-4 w-4" />
              Share this business
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary font-semibold transition-colors text-sm"
          >
            Request edits to this listing
          </button>
        </div>
      </div>
      <EditRequestDialog business={business} open={editOpen} onOpenChange={setEditOpen} />
    </motion.article>
  );
}

function EditRequestDialog({
  business,
  open,
  onOpenChange,
}: {
  business: Business;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState(business.ownerName);
  const [contact, setContact] = useState(business.phone);
  const [changes, setChanges] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (!name.trim() || !contact.trim() || changes.trim().length < 5) {
      toast.error("Please fill in your name, contact and the changes you need.");
      return;
    }
    setBusy(true);
    try {
      addMessage({
        kind: "opinion",
        name: name.trim(),
        contact: contact.trim(),
        body: `BUSINESS EDIT REQUEST\nListing: ${business.businessName} (ID: ${business.id})\nCategory: ${business.category}\nWard: ${business.ward}\n\nRequested changes:\n${changes.trim()}`,
      });
      toast.success("Edit request sent to the admin team", {
        description: "Moha's team will review and update your listing shortly.",
      });
      setChanges("");
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Request edits to your listing</DialogTitle>
          <DialogDescription>
            Tell the admin what to change about <strong>{business.businessName}</strong> (location,
            contacts, photos, payment details, etc.). The team will verify and update for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="er-name">Your name</Label>
            <Input id="er-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="er-contact">Phone / WhatsApp contact</Label>
            <Input id="er-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={40} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="er-changes">What needs to change?</Label>
            <Textarea
              id="er-changes"
              rows={5}
              maxLength={1000}
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              placeholder="e.g. New location: Mathare 4B, opposite Mary's Pharmacy. Update phone to 07XX…"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="hero" onClick={submit} disabled={busy}>Send request</Button>
        </div>
      </DialogContent>
    </Dialog>
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
    if (!v) setTimeout(reset, 200);
    onOpenChange(v);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const togglePayment = (pm: PaymentMethod) =>
    setForm((f) => ({
      ...f,
      paymentMethods: f.paymentMethods.includes(pm)
        ? f.paymentMethods.filter((x) => x !== pm)
        : [...f.paymentMethods, pm],
    }));

  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = Math.max(0, 5 - form.imageUrls.length);
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error("You can upload up to 5 photos");
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is over 5MB and was skipped`);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("business-images")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("business-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...uploaded] }));
    } catch (err) {
      console.error(err);
      toast.error("Could not upload one or more images");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (!form.ownerName.trim()) return "Please enter your name";
      if (!form.businessName.trim()) return "Please enter your business name";
      if (!form.category) return "Please choose a business category";
    }
    if (s === 1) {
      if (!form.ward) return "Please select your ward";
      if (!form.location.trim()) return "Please enter your area / location";
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 9) return "Please enter a valid WhatsApp number";
    }
    if (s === 2) {
      if (form.paymentMethods.length === 0) return "Select at least one payment method";
      if ((form.paymentMethods.includes("till") || form.paymentMethods.includes("paybill")) && !form.tillPaybillNumber.trim()) {
        return "Enter your Till / Paybill number";
      }
    }
    if (s === 3) {
      if (form.imageUrls.length === 0) return "Please upload at least one photo";
      if (!form.dataConsent) return "Please read and accept the Data Policy before publishing";
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateStep(3);
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
      street: form.street.trim() || undefined,
      phone: form.phone.trim(),
      contacts: form.contacts.trim() || undefined,
      description: form.description.trim(),
      websiteUrl: form.websiteUrl.trim() || undefined,
      imageUrl: form.imageUrls[0] ?? "",
      imageUrls: form.imageUrls,
      paymentMethods: form.paymentMethods,
      tillPaybillNumber: form.tillPaybillNumber.trim() || undefined,
      nearestTransport: form.nearestTransport.trim() || undefined,
      deliveryAvailable: form.deliveryAvailable,
      status: "active",
      createdAt: Date.now(),
    });
    handleClose(false);
  };

  const steps = ["About You", "Location & Contact", "Payments & Service", "Photos & Launch"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">List Your Business</DialogTitle>
          <DialogDescription>Free for every Mathare entrepreneur. Takes about 3 minutes.</DialogDescription>
        </DialogHeader>

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
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-muted rounded-full" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Your Name *</Label>
                  <Input id="ownerName" placeholder="e.g. Jane Wanjiku" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} maxLength={80} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" placeholder="e.g. Jane's Fresh Mboga" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} maxLength={80} />
                </div>
                <div className="space-y-2">
                  <Label>Business Type *</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
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
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Website / Social Page (optional)
                  </Label>
                  <Input id="websiteUrl" type="url" placeholder="https://yourbiz.co.ke" value={form.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} maxLength={200} />
                  <p className="text-xs text-muted-foreground">Your photos will open this link when customers click them.</p>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Ward *</Label>
                  <Select value={form.ward} onValueChange={(v) => update("ward", v)}>
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
                  <Label htmlFor="location">Area / Estate *</Label>
                  <Input id="location" placeholder="e.g. Mathare 4A" value={form.location} onChange={(e) => update("location", e.target.value)} maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street / Precise Location</Label>
                  <Input id="street" placeholder="e.g. Opposite Huruma Stage, 1st floor" value={form.street} onChange={(e) => update("street", e.target.value)} maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp / Phone Contact *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="07XX XXX XXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="pl-9" maxLength={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contacts">Additional Contacts (optional)</Label>
                  <Input id="contacts" placeholder="e.g. 07XX XXX XXX, info@biz.co.ke" value={form.contacts} onChange={(e) => update("contacts", e.target.value)} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description (optional)</Label>
                  <Textarea id="description" placeholder="What do you sell or offer?" value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={200} rows={3} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Methods Accepted *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const checked = form.paymentMethods.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                            checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                          )}
                        >
                          <Checkbox checked={checked} onCheckedChange={() => togglePayment(opt.value)} />
                          <span className="text-sm font-semibold">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {(form.paymentMethods.includes("till") || form.paymentMethods.includes("paybill")) && (
                  <div className="space-y-2">
                    <Label htmlFor="tillPaybill">Till / Paybill Number *</Label>
                    <Input id="tillPaybill" placeholder="e.g. 522522 or 123456" value={form.tillPaybillNumber} onChange={(e) => update("tillPaybillNumber", e.target.value)} maxLength={20} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="nearestTransport">Means of Transport</Label>
                  <Input id="nearestTransport" placeholder="e.g. Taxi, Bodaboda, Matatu, Tuk-tuk" value={form.nearestTransport} onChange={(e) => update("nearestTransport", e.target.value)} maxLength={120} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <Label htmlFor="delivery" className="cursor-pointer">Delivery Available</Label>
                    <p className="text-xs text-muted-foreground">Toggle on if you deliver to customers.</p>
                  </div>
                  <Switch id="delivery" checked={form.deliveryAvailable} onCheckedChange={(v) => update("deliveryAvailable", v)} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Photos * (up to 5)</Label>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.imageUrls.map((src, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-border aspect-square">
                        <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-background/95 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {form.imageUrls.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary disabled:opacity-60 disabled:cursor-wait"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs font-semibold">{uploading ? "Uploading…" : "Add photo"}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">JPG or PNG, up to 5MB each. The first photo becomes your cover.</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1">
                  <p className="font-semibold text-foreground">Preview:</p>
                  <p><span className="text-muted-foreground">Business:</span> {form.businessName || "—"}</p>
                  <p><span className="text-muted-foreground">Ward:</span> {form.ward || "—"}</p>
                  <p><span className="text-muted-foreground">Payments:</span> {form.paymentMethods.map((m) => PAYMENT_LABELS[m]).join(", ") || "—"}</p>
                  <p><span className="text-muted-foreground">Delivery:</span> {form.deliveryAvailable ? "Yes" : "No"}</p>
                </div>

                {/* Data Policy & Consent */}
                <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                    <h4 className="font-display font-bold text-sm text-foreground">Data Policy & Consent</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The information you provide will be displayed publicly on the Mathare Business Hub to connect you
                    with customers. Your name, business details, and contact information will be visible to visitors of
                    this platform. We do not sell your data to third parties. You may request removal of your listing at
                    any time by contacting us at <em>hello@mohadelivers.com</em> or the Moha Coordination Office, Kiamako-Mathare.
                    By publishing, you confirm that the information is accurate and that you have the right to list this business.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={form.dataConsent}
                      onCheckedChange={(v) => update("dataConsent", Boolean(v))}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      I have read and understood the data policy. I consent to my business information being displayed
                      publicly on the Mathare Business Hub. *
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={back}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button type="button" variant="default" onClick={next}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" variant="hero" disabled={!form.dataConsent}>
                <CheckCircle2 className="h-4 w-4" /> Publish My Business
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Save, Upload, ImageIcon, RotateCcw, Home, Target, HeartHandshake, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { useContent, updateContent, useBursaryWindow, saveBursaryWindowStart, saveBursaryWindowDuration, DEFAULT_BURSARY_WINDOW_DURATION_DAYS, type SiteContent, useBursaryTerm, saveBursaryTerm, TERM_NAMES, buildTermLabel, parseTermLabel } from "@/lib/admin-store";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "Content Manager — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContentPage,
});

function AdminContentPage() {
  const [content] = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const { windowStart, windowDurationDays, loading: windowLoading } = useBursaryWindow();
  const [draftWindowStart, setDraftWindowStart] = useState<string>("");
  const [draftWindowDuration, setDraftWindowDuration] = useState<string>(String(DEFAULT_BURSARY_WINDOW_DURATION_DAYS));
  const [savingWindow, setSavingWindow] = useState(false);
  const { term: currentTerm, loading: termLoading } = useBursaryTerm();
  const currentYear = new Date().getFullYear();
  const [draftTermName, setDraftTermName] = useState<string>(TERM_NAMES[0]);
  const [draftTermYear, setDraftTermYear] = useState<string>(String(currentYear));
  const [savingTerm, setSavingTerm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(content); }, [content]);
  useEffect(() => { setDraftWindowStart(windowStart); }, [windowStart]);
  useEffect(() => { setDraftWindowDuration(String(windowDurationDays)); }, [windowDurationDays]);
  useEffect(() => {
    if (!currentTerm) return;
    const { termName, year } = parseTermLabel(currentTerm);
    if (termName) setDraftTermName(termName);
    if (year) setDraftTermYear(year);
  }, [currentTerm]);

  const update = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("heroImageUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateContent(draft);
    toast.success("Content updated", { description: "Changes are now live on the public site." });
  };

  const reset = () => {
    setDraft(content);
    toast.info("Changes discarded");
  };

  const saveWindow = async (dateStr: string) => {
    setSavingWindow(true);
    const parsedDays = parseInt(draftWindowDuration, 10);
    const validDays = Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : DEFAULT_BURSARY_WINDOW_DURATION_DAYS;
    await Promise.all([
      saveBursaryWindowStart(dateStr),
      saveBursaryWindowDuration(validDays),
    ]);
    setSavingWindow(false);
    toast.success(
      dateStr
        ? `Bursary window set — opens ${dateStr}, open for ${validDays} day${validDays === 1 ? "" : "s"}`
        : "Bursary window closed",
    );
  };

  const draftTermLabel = buildTermLabel(draftTermName, draftTermYear || currentYear);
  const isOpeningNewTerm = !!currentTerm && draftTermLabel !== currentTerm;

  /**
   * Opening a new term is what gives every term its own "folder" of
   * applications: from this point on, every new application gets stamped
   * with `draftTermLabel`. Nothing needs to move — applications already
   * stamped with the previous term simply stop showing up in the admin
   * dashboard's default (current-term) view, while remaining fully
   * accessible from the Term filter there.
   */
  const saveTerm = async () => {
    if (isOpeningNewTerm) {
      const ok = window.confirm(
        `Open "${draftTermLabel}"?\n\nAll applications currently in "${currentTerm}" will be archived under that term name and the admin dashboard's current application list will start empty for "${draftTermLabel}".\n\nThis does not delete any data — past terms stay accessible from the Term filter.`
      );
      if (!ok) return;
    }
    setSavingTerm(true);
    try {
      await saveBursaryTerm(draftTermLabel);
      toast.success(`Now accepting applications for ${draftTermLabel}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save term");
    } finally {
      setSavingTerm(false);
    }
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  return (
    <AdminLayout title="Content Manager">
      <Toaster />
      <div className="space-y-3 max-w-4xl">
        {/* Home page */}
        <Section title="Home Page" icon={Home}>
          <div className="grid gap-3">
            <Field label="Headline (Large Gold Word)">
              <Input
                value={draft.homeHeadline}
                onChange={(e) => update("homeHeadline", e.target.value)}
                maxLength={40}
              />
            </Field>
            <Field label="Tagline / Slogan">
              <Input
                value={draft.homeTagline}
                onChange={(e) => update("homeTagline", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Pull Quote">
              <Textarea
                value={draft.homeQuote}
                onChange={(e) => update("homeQuote", e.target.value)}
                rows={3}
                maxLength={300}
              />
            </Field>
            <Field label="Quote Author">
              <Input
                value={draft.homeQuoteAuthor}
                onChange={(e) => update("homeQuoteAuthor", e.target.value)}
                maxLength={40}
              />
            </Field>

            {/* Hero image */}
            <div>
              <Label className="font-semibold mb-2 block">Hero Image</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
              <div className="flex items-start gap-3">
                <div className="relative h-28 w-40 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                  {draft.heroImageUrl ? (
                    <img src={draft.heroImageUrl} alt="hero" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Upload new image
                  </Button>
                  {draft.heroImageUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => update("heroImageUrl", "")}
                      className="text-destructive hover:text-destructive"
                    >
                      Use default
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Recommended: portrait orientation, at least 1200×1600px. Leave empty to use the default Moha portrait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Priorities */}
        <Section title="Priorities Page" icon={Target}>
          <div className="grid gap-3">
            <Field label="Headline">
              <Input
                value={draft.prioritiesHeadline}
                onChange={(e) => update("prioritiesHeadline", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Subtitle">
              <Textarea
                value={draft.prioritiesSubtitle}
                onChange={(e) => update("prioritiesSubtitle", e.target.value)}
                rows={2}
                maxLength={200}
              />
            </Field>
          </div>
        </Section>

        {/* Foundations */}
        <Section title="Foundations Page" icon={HeartHandshake}>
          <div className="grid gap-3">
            <Field label="Headline">
              <Input
                value={draft.foundationsHeadline}
                onChange={(e) => update("foundationsHeadline", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Subtitle">
              <Textarea
                value={draft.foundationsSubtitle}
                onChange={(e) => update("foundationsSubtitle", e.target.value)}
                rows={2}
                maxLength={200}
              />
            </Field>
          </div>
        </Section>

        {/* Bursary Application Window */}
        <Section icon={GraduationCap} title="Bursary Application Window">
          <div className="space-y-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5">🌐</span>
              <span>
                This setting is stored in the <strong>database</strong> and is immediately visible to
                all users on all devices the moment you save it.
              </span>
            </div>

            {/* Term selection — determines which "folder" new applications fall into */}
            <div className="rounded-lg border border-border bg-muted/20 px-2.5 py-1.5 space-y-2">
              <div>
                <p className="text-xs font-semibold">Term this window is for</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every application submitted while this window is open is tagged with the term below.
                  Opening a new term automatically empties the admin dashboard's current application list —
                  applications from the previous term stay saved and browsable under their own term name.
                </p>
              </div>
              {!termLoading && currentTerm && (
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                  Currently open: {currentTerm}
                </div>
              )}
              <div className="flex flex-wrap gap-2 items-end">
                <div className="w-40">
                  <Label className="text-xs font-semibold mb-1.5 block">Term</Label>
                  <Select value={draftTermName} onValueChange={setDraftTermName}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TERM_NAMES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-28">
                  <Label className="text-xs font-semibold mb-1.5 block">Year</Label>
                  <Input
                    type="number"
                    value={draftTermYear}
                    onChange={(e) => setDraftTermYear(e.target.value)}
                  />
                </div>
                <Button
                  variant="hero"
                  onClick={saveTerm}
                  disabled={savingTerm || termLoading || draftTermLabel === currentTerm}
                >
                  {savingTerm ? "Saving…" : isOpeningNewTerm ? `Open ${draftTermLabel}` : "Save Term"}
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Set the start date and how many days the window should stay open for. Applications
              automatically close that many days after the start date. Leave the start date blank
              to close the window.
            </p>
            <div className="flex flex-wrap gap-2 items-end">
              <Field label="Application Window Start Date">
                <Input
                  type="date"
                  value={draftWindowStart}
                  onChange={(e) => setDraftWindowStart(e.target.value)}
                  disabled={windowLoading}
                  className="w-44"
                />
              </Field>
              <Field label="Duration (Days)">
                <Input
                  type="number"
                  min={1}
                  value={draftWindowDuration}
                  onChange={(e) => setDraftWindowDuration(e.target.value)}
                  disabled={windowLoading}
                  className="w-24"
                />
              </Field>
              <Button
                variant="hero"
                onClick={() => saveWindow(draftWindowStart)}
                disabled={
                  savingWindow ||
                  windowLoading ||
                  (draftWindowStart === windowStart && draftWindowDuration === String(windowDurationDays))
                }
              >
                {savingWindow ? "Saving…" : "Save & Publish"}
              </Button>
            </div>
            {windowStart && (() => {
              const start = new Date(windowStart);
              const end = new Date(start);
              end.setDate(end.getDate() + windowDurationDays);
              const now = new Date();
              const open = now >= start && now <= end;
              return (
                <div className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${open ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700"}`}>
                  {open
                    ? `✓ Window OPEN — closes ${end.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })} (${windowDurationDays}-day window)`
                    : now < start
                      ? `⏳ Window opens ${start.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })} (${windowDurationDays}-day window)`
                      : `✗ Window CLOSED — ended ${end.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`
                  }
                </div>
              );
            })()}
            {!windowStart && !windowLoading && (
              <div className="rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground">
                No window set — the bursary form is currently hidden from all users.
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setDraftWindowStart(""); saveWindow(""); }}
              disabled={savingWindow || !windowStart}
            >
              Clear / Close window immediately
            </Button>
          </div>
        </Section>

        {/* Sticky save bar */}
        <div className="sticky bottom-4 bg-card border border-border rounded-2xl p-3 shadow-elegant flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={reset} disabled={!dirty}>
              <RotateCcw className="h-4 w-4" /> Discard
            </Button>
            <Button variant="hero" onClick={save} disabled={!dirty}>
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Home;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-sm">
      <h2 className="font-display text-sm font-bold flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-semibold text-xs mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
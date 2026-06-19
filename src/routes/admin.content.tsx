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
import { useContent, updateContent, useBursaryWindow, saveBursaryWindowStart, type SiteContent } from "@/lib/admin-store";

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
  const { windowStart, loading: windowLoading } = useBursaryWindow();
  const [draftWindowStart, setDraftWindowStart] = useState<string>("");
  const [savingWindow, setSavingWindow] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(content); }, [content]);
  useEffect(() => { setDraftWindowStart(windowStart); }, [windowStart]);

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
    await saveBursaryWindowStart(dateStr);
    setSavingWindow(false);
    toast.success(dateStr ? `Bursary window set — opens ${dateStr}` : "Bursary window closed");
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  return (
    <AdminLayout title="Content Manager">
      <Toaster />
      <div className="space-y-6 max-w-4xl">
        {/* Home page */}
        <Section title="Home Page" icon={Home}>
          <div className="grid gap-4">
            <Field label="Headline (large gold word)">
              <Input
                value={draft.homeHeadline}
                onChange={(e) => update("homeHeadline", e.target.value)}
                maxLength={40}
              />
            </Field>
            <Field label="Tagline / slogan">
              <Input
                value={draft.homeTagline}
                onChange={(e) => update("homeTagline", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Pull quote">
              <Textarea
                value={draft.homeQuote}
                onChange={(e) => update("homeQuote", e.target.value)}
                rows={3}
                maxLength={300}
              />
            </Field>
            <Field label="Quote author">
              <Input
                value={draft.homeQuoteAuthor}
                onChange={(e) => update("homeQuoteAuthor", e.target.value)}
                maxLength={40}
              />
            </Field>

            {/* Hero image */}
            <div>
              <Label className="font-semibold mb-2 block">Hero image</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
              <div className="flex items-start gap-4">
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
          <div className="grid gap-4">
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
          <div className="grid gap-4">
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
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5">🌐</span>
              <span>
                This setting is stored in the <strong>database</strong> and is immediately visible to
                all users on all devices the moment you save it.
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Set the start date for the bursary application window. Applications will automatically
              close <strong>10 days</strong> after the start date. Leave blank to close the window.
            </p>
            <Field label="Application window start date">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={draftWindowStart}
                  onChange={(e) => setDraftWindowStart(e.target.value)}
                  disabled={windowLoading}
                  className="flex-1"
                />
                <Button
                  variant="hero"
                  onClick={() => saveWindow(draftWindowStart)}
                  disabled={savingWindow || windowLoading || draftWindowStart === windowStart}
                >
                  {savingWindow ? "Saving…" : "Save & Publish"}
                </Button>
              </div>
            </Field>
            {windowStart && (() => {
              const start = new Date(windowStart);
              const end = new Date(start);
              end.setDate(end.getDate() + 10);
              const now = new Date();
              const open = now >= start && now <= end;
              return (
                <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${open ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700"}`}>
                  {open
                    ? `✓ Window OPEN — closes ${end.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`
                    : now < start
                      ? `⏳ Window opens ${start.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`
                      : `✗ Window CLOSED — ended ${end.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`
                  }
                </div>
              );
            })()}
            {!windowStart && !windowLoading && (
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
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
        <div className="sticky bottom-4 bg-card border border-border rounded-2xl p-4 shadow-elegant flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
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
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-5">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-semibold text-sm mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  FolderOpen,
  Trash2,
  Image as ImageIcon,
  Video,
  X,
  RotateCw,
  Crop,
  Tag,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import {
  listMedia,
  listTopics,
  uploadMediaBlob,
  deleteMedia,
  updateMediaMeta,
  detectMediaType,
  type CampaignMediaWithUrl,
} from "@/lib/campaign-media";
import {
  applyEdit,
  isEditableImage,
  DEFAULT_EDIT,
  type Aspect,
  type ImageEdit,
} from "@/lib/image-edit";

type FolderInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  webkitdirectory?: string;
  directory?: string;
};

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Campaign Media — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMediaPage,
});

type Pending = {
  id: string;
  file: File;
  previewUrl: string;
  mediaType: "image" | "video";
  edit: ImageEdit;
  title: string;
};

const ASPECTS: Aspect[] = ["original", "1:1", "16:9", "4:3", "3:4"];

function AdminMediaPage() {
  const [items, setItems] = useState<CampaignMediaWithUrl[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [topic, setTopic] = useState("");
  const [captionAll, setCaptionAll] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [editingMeta, setEditingMeta] = useState<string | null>(null);
  const [metaDraft, setMetaDraft] = useState<{ title: string; topic: string; caption: string }>({
    title: "",
    topic: "",
    caption: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    Promise.all([listMedia(), listTopics()])
      .then(([m, t]) => {
        setItems(m);
        setTopics(t);
      })
      .catch((e) => toast.error(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // Clean up preview URLs on unmount / change
  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: Pending[] = [];
    let skipped = 0;
    for (const f of Array.from(files)) {
      const mt = detectMediaType(f);
      if (!mt) {
        skipped++;
        continue;
      }
      next.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        mediaType: mt,
        edit: { ...DEFAULT_EDIT },
        title: f.name,
      });
    }
    if (next.length === 0) {
      toast.error("No supported image or video files found");
      return;
    }
    setPending((prev) => [...prev, ...next]);
    if (skipped) toast.message(`${skipped} unsupported file(s) skipped`);
    if (fileRef.current) fileRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearPending = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPending([]);
  };

  const rotatePending = (id: string) => {
    setPending((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, edit: { ...p.edit, rotate: (((p.edit.rotate + 90) % 360) as ImageEdit["rotate"]) } }
          : p,
      ),
    );
  };

  const setAspect = (id: string, aspect: Aspect) => {
    setPending((prev) =>
      prev.map((p) => (p.id === id ? { ...p, edit: { ...p.edit, aspect } } : p)),
    );
  };

  const setPendingTitle = (id: string, title: string) => {
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const doUpload = async () => {
    if (pending.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: pending.length });
    let ok = 0;
    let failed = 0;
    for (let i = 0; i < pending.length; i++) {
      const p = pending[i];
      try {
        let blob: Blob = p.file;
        let name = p.file.name;
        if (p.mediaType === "image" && isEditableImage(p.file)) {
          const hasEdit =
            p.edit.rotate !== 0 || p.edit.aspect !== "original";
          if (hasEdit) {
            blob = await applyEdit(p.file, p.edit);
            const ext = blob.type === "image/png" ? "png" : "jpg";
            name = name.replace(/\.[^.]+$/, "") + `.edited.${ext}`;
          }
        }
        await uploadMediaBlob(blob, name, {
          title: p.title || name,
          caption: captionAll || undefined,
          topic: topic || undefined,
          mediaType: p.mediaType,
        });
        ok++;
      } catch (e) {
        failed++;
        console.error("upload failed", p.file.name, e);
      }
      setProgress({ done: i + 1, total: pending.length });
    }
    setUploading(false);
    setProgress({ done: 0, total: 0 });
    clearPending();
    toast.success(`Uploaded ${ok}${failed ? ` · ${failed} failed` : ""}`);
    load();
  };

  const handleDelete = async (item: CampaignMediaWithUrl) => {
    if (!confirm(`Delete "${item.title ?? item.storage_path}"?`)) return;
    try {
      await deleteMedia(item);
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());
  const selectAllShown = () => setSelected(new Set(shown.map((i) => i.id)));

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected item(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const targets = items.filter((i) => selected.has(i.id));
    let ok = 0;
    let failed = 0;
    for (const item of targets) {
      try {
        await deleteMedia(item);
        ok++;
      } catch (e) {
        failed++;
        console.error("delete failed", item.storage_path, e);
      }
    }
    setBulkDeleting(false);
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    clearSelection();
    toast.success(`Deleted ${ok}${failed ? ` · ${failed} failed` : ""}`);
    load();
  };

  const openMetaEditor = (item: CampaignMediaWithUrl) => {
    setEditingMeta(item.id);
    setMetaDraft({
      title: item.title ?? "",
      topic: item.topic ?? "",
      caption: item.caption ?? "",
    });
  };

  const saveMeta = async () => {
    if (!editingMeta) return;
    try {
      await updateMediaMeta(editingMeta, {
        title: metaDraft.title || null,
        topic: metaDraft.topic.trim() || null,
        caption: metaDraft.caption || null,
      });
      toast.success("Updated");
      setEditingMeta(null);
      load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      toast.error(msg);
    }
  };

  const shown = useMemo(
    () => (filterTopic === "all" ? items : items.filter((i) => (i.topic ?? "") === filterTopic)),
    [items, filterTopic],
  );

  const images = items.filter((i) => i.media_type === "image").length;
  const videos = items.filter((i) => i.media_type === "video").length;

  return (
    <AdminLayout title="Campaign Media">
      <Toaster />
      <div className="space-y-6 max-w-6xl">
        {/* Upload panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold mb-1">Upload photos &amp; videos</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pick files, group them by campaign topic, edit each photo (rotate &amp; crop), then upload.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            <div>
              <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Topic (groups this batch)
              </Label>
              <Input
                list="topic-suggestions"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Mabatini Rally, Education Drive"
                disabled={uploading}
              />
              <datalist id="topic-suggestions">
                {topics.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Optional caption for this batch</Label>
              <Input
                value={captionAll}
                onChange={(e) => setCaptionAll(e.target.value)}
                placeholder="e.g. June 30 community meeting"
                disabled={uploading}
              />
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <input
            ref={folderRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
            {...({ webkitdirectory: "", directory: "" } as FolderInputProps)}
          />

          <div className="flex flex-wrap gap-2">
            <Button variant="hero" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> Pick files
            </Button>
            <Button variant="outline" onClick={() => folderRef.current?.click()} disabled={uploading}>
              <FolderOpen className="h-4 w-4" /> Pick folder
            </Button>
            {pending.length > 0 && (
              <>
                <Button variant="hero" onClick={doUpload} disabled={uploading}>
                  <Check className="h-4 w-4" /> Upload {pending.length}
                </Button>
                <Button variant="ghost" onClick={clearPending} disabled={uploading}>
                  Clear
                </Button>
              </>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Uploading {progress.done} of {progress.total}…
              </p>
            </div>
          )}

          {/* Pending editor */}
          {pending.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Review &amp; edit before upload</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map((p) => (
                  <div key={p.id} className="border border-border rounded-xl p-3 bg-background">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      {p.mediaType === "image" ? (
                        <img
                          src={p.previewUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform"
                          style={{ transform: `rotate(${p.edit.rotate}deg)` }}
                        />
                      ) : (
                        <>
                          <video src={p.previewUrl} className="h-full w-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video className="h-8 w-8 text-white" />
                          </div>
                        </>
                      )}
                      <button
                        onClick={() => removePending(p.id)}
                        className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-destructive"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Input
                      value={p.title}
                      onChange={(e) => setPendingTitle(p.id, e.target.value)}
                      placeholder="Title"
                      className="mb-2"
                    />
                    {p.mediaType === "image" && isEditableImage(p.file) ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Button size="sm" variant="outline" onClick={() => rotatePending(p.id)}>
                            <RotateCw className="h-3.5 w-3.5" /> Rotate
                          </Button>
                          <span className="text-xs text-muted-foreground">{p.edit.rotate}°</span>
                        </div>
                        <div>
                          <Label className="text-[11px] font-semibold flex items-center gap-1 mb-1">
                            <Crop className="h-3 w-3" /> Crop
                          </Label>
                          <div className="flex flex-wrap gap-1">
                            {ASPECTS.map((a) => (
                              <button
                                key={a}
                                onClick={() => setAspect(p.id, a)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold border transition ${
                                  p.edit.aspect === a
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card border-border hover:border-primary/50"
                                }`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        {p.mediaType === "video"
                          ? "Video will upload as-is."
                          : "This format can't be edited in the browser."}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total" value={items.length} />
          <Stat label="Photos" value={images} icon={ImageIcon} />
          <Stat label="Videos" value={videos} icon={Video} />
        </div>

        {/* Gallery */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-lg font-bold">Uploaded media</h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              >
                <option value="all">All topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="">(No topic)</option>
              </select>
              {selected.size > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                  <Button size="sm" variant="outline" onClick={clearSelection} disabled={bulkDeleting}>
                    <X className="h-4 w-4" /> Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleting}
                  >
                    <Trash2 className="h-4 w-4" /> Delete selected
                  </Button>
                </>
              ) : (
                shown.length > 0 && (
                  <Button size="sm" variant="outline" onClick={selectAllShown}>
                    Select all
                  </Button>
                )
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : shown.length === 0 ? (
            <p className="text-muted-foreground">Nothing to show.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {shown.map((item) => {
                const isSelected = selected.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative aspect-square rounded-lg overflow-hidden bg-muted border-2 transition ${
                      isSelected ? "border-primary ring-2 ring-primary/40" : "border-border"
                    }`}
                  >
                    {item.media_type === "image" ? (
                      <img src={item.url} alt={item.title ?? ""} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <video src={item.url} className="h-full w-full object-cover" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className={`absolute top-1.5 left-1.5 h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold border-2 transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/90 text-transparent border-white hover:text-foreground"
                      }`}
                      aria-label={isSelected ? "Deselect" : "Select"}
                    >
                      ✓
                    </button>
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      <button
                        onClick={() => openMetaEditor(item)}
                        className="h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-primary md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Edit details"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-destructive md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pointer-events-none">
                      {item.topic && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white/90 bg-primary/80 rounded px-1.5 py-0.5 mb-1">
                          {item.topic}
                        </span>
                      )}
                      <p className="text-white text-[11px] font-semibold line-clamp-1">
                        {item.title ?? item.storage_path.split("/").pop()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Meta editor dialog */}
      {editingMeta && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setEditingMeta(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold mb-4">Edit details</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold mb-1 block">Title</Label>
                <Input
                  value={metaDraft.title}
                  onChange={(e) => setMetaDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1 block">Topic</Label>
                <Input
                  list="topic-suggestions"
                  value={metaDraft.topic}
                  onChange={(e) => setMetaDraft((d) => ({ ...d, topic: e.target.value }))}
                  placeholder="e.g. Mabatini Rally"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1 block">Caption</Label>
                <Input
                  value={metaDraft.caption}
                  onChange={(e) => setMetaDraft((d) => ({ ...d, caption: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="ghost" onClick={() => setEditingMeta(null)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={saveMeta}>
                <Check className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon?: typeof ImageIcon }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-primary" />}
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
      </div>
    </div>
  );
}

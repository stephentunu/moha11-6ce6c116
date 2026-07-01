import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Upload, FolderOpen, Trash2, Image as ImageIcon, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import {
  listMedia,
  uploadMedia,
  deleteMedia,
  publicUrl,
  detectMediaType,
  type CampaignMedia,
} from "@/lib/campaign-media";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Campaign Media — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMediaPage,
});

// Extend HTMLInputElement typing to include folder picker attributes
type FolderInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  webkitdirectory?: string;
  directory?: string;
};

function AdminMediaPage() {
  const [items, setItems] = useState<CampaignMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [captionAll, setCaptionAll] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    listMedia()
      .then(setItems)
      .catch((e) => toast.error(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => detectMediaType(f) !== null);
    const skipped = files.length - arr.length;
    if (arr.length === 0) {
      toast.error("No supported image or video files found");
      return;
    }
    setUploading(true);
    setProgress({ done: 0, total: arr.length });
    let ok = 0;
    let failed = 0;
    for (let i = 0; i < arr.length; i++) {
      try {
        await uploadMedia(arr[i], { caption: captionAll || undefined });
        ok++;
      } catch (e: any) {
        failed++;
        console.error("upload failed", arr[i].name, e);
      }
      setProgress({ done: i + 1, total: arr.length });
    }
    setUploading(false);
    setProgress({ done: 0, total: 0 });
    if (fileRef.current) fileRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
    toast.success(`Uploaded ${ok}${failed ? ` · ${failed} failed` : ""}${skipped ? ` · ${skipped} unsupported skipped` : ""}`);
    load();
  };

  const handleDelete = async (item: CampaignMedia) => {
    if (!confirm(`Delete "${item.title ?? item.storage_path}"?`)) return;
    try {
      await deleteMedia(item);
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  };

  const images = items.filter((i) => i.media_type === "image").length;
  const videos = items.filter((i) => i.media_type === "video").length;

  return (
    <AdminLayout title="Campaign Media">
      <Toaster />
      <div className="space-y-6 max-w-6xl">
        {/* Upload panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold mb-1">Upload photos & videos</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pick individual files or an entire folder from your computer. Supports JPG, PNG, GIF, WebP,
            HEIC, MP4, MOV, WebM, and more.
          </p>

          <div className="grid gap-3 mb-4">
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Optional caption for this batch</Label>
              <Input
                value={captionAll}
                onChange={(e) => setCaptionAll(e.target.value)}
                placeholder="e.g. Mabatini rally, June 30"
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
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={folderRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            {...({ webkitdirectory: "", directory: "" } as FolderInputProps)}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="hero"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4" /> Pick files
            </Button>
            <Button
              variant="outline"
              onClick={() => folderRef.current?.click()}
              disabled={uploading}
            >
              <FolderOpen className="h-4 w-4" /> Pick folder
            </Button>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total" value={items.length} />
          <Stat label="Photos" value={images} icon={ImageIcon} />
          <Stat label="Videos" value={videos} icon={Video} />
        </div>

        {/* Gallery */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold mb-4">Uploaded media</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">Nothing uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {items.map((item) => {
                const url = publicUrl(item.storage_path);
                return (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border"
                  >
                    {item.media_type === "image" ? (
                      <img src={url} alt={item.title ?? ""} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <video src={url} className="h-full w-full object-cover" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(item)}
                      className="absolute top-1.5 right-1.5 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
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

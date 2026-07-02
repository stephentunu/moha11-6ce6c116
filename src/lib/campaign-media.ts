import { supabase } from "@/integrations/supabase/client";

export type CampaignMedia = {
  id: string;
  storage_path: string;
  media_type: "image" | "video";
  mime_type: string | null;
  title: string | null;
  caption: string | null;
  topic: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type CampaignMediaWithUrl = CampaignMedia & { url: string };

export const BUCKET = "campaign-media";
const SIGN_TTL = 60 * 60 * 24 * 7; // 7 days

export function publicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function signUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGN_TTL);
  if (error || !data) return publicUrl(path);
  return data.signedUrl;
}

export async function signPaths(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, SIGN_TTL);
  const map: Record<string, string> = {};
  if (error || !data) {
    for (const p of paths) map[p] = publicUrl(p);
    return map;
  }
  for (const row of data) {
    if (row.path) map[row.path] = row.signedUrl ?? publicUrl(row.path);
  }
  return map;
}

export async function listMedia(): Promise<CampaignMediaWithUrl[]> {
  const { data, error } = await supabase
    .from("campaign_media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const items = (data ?? []) as CampaignMedia[];
  const urls = await signPaths(items.map((i) => i.storage_path));
  return items.map((i) => ({ ...i, url: urls[i.storage_path] ?? publicUrl(i.storage_path) }));
}

export async function listTopics(): Promise<string[]> {
  const { data, error } = await supabase
    .from("campaign_media")
    .select("topic")
    .not("topic", "is", null);
  if (error) return [];
  const set = new Set<string>();
  for (const row of data ?? []) {
    const t = (row as { topic: string | null }).topic;
    if (t && t.trim()) set.add(t.trim());
  }
  return Array.from(set).sort();
}

export function detectMediaType(file: File | Blob, name?: string): "image" | "video" | null {
  if (file.type?.startsWith("image/")) return "image";
  if (file.type?.startsWith("video/")) return "video";
  const ext = (name ?? (file as File).name ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (["jpg","jpeg","png","gif","webp","avif","bmp","svg","heic","heif","tif","tiff"].includes(ext)) return "image";
  if (["mp4","mov","webm","mkv","avi","m4v","3gp","ogv","flv","wmv"].includes(ext)) return "video";
  return null;
}

export async function uploadMediaBlob(
  blob: Blob,
  fileName: string,
  opts?: { title?: string; caption?: string; topic?: string; mediaType?: "image" | "video" },
) {
  const mediaType = opts?.mediaType ?? detectMediaType(blob, fileName);
  if (!mediaType) throw new Error(`Unsupported file: ${fileName}`);

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${mediaType}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type || undefined, upsert: false });
  if (upErr) throw upErr;

  const { error: insErr } = await supabase.from("campaign_media").insert({
    storage_path: path,
    media_type: mediaType,
    mime_type: blob.type || null,
    title: opts?.title ?? fileName,
    caption: opts?.caption ?? null,
    topic: opts?.topic?.trim() || null,
    size_bytes: blob.size,
  });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw insErr;
  }
}

export async function deleteMedia(item: Pick<CampaignMedia, "id" | "storage_path">) {
  await supabase.storage.from(BUCKET).remove([item.storage_path]);
  const { error } = await supabase.from("campaign_media").delete().eq("id", item.id);
  if (error) throw error;
}

export async function updateMediaMeta(
  id: string,
  patch: Partial<Pick<CampaignMedia, "title" | "caption" | "topic">>,
) {
  const { error } = await supabase.from("campaign_media").update(patch).eq("id", id);
  if (error) throw error;
}

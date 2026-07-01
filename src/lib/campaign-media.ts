import { supabase } from "@/integrations/supabase/client";

export type CampaignMedia = {
  id: string;
  storage_path: string;
  media_type: "image" | "video";
  mime_type: string | null;
  title: string | null;
  caption: string | null;
  size_bytes: number | null;
  created_at: string;
};

export const BUCKET = "campaign-media";

export function publicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function signedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error || !data) return publicUrl(path);
  return data.signedUrl;
}

export async function listMedia(): Promise<CampaignMedia[]> {
  const { data, error } = await supabase
    .from("campaign_media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CampaignMedia[];
}

export function detectMediaType(file: File): "image" | "video" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  // fallback by extension
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg","jpeg","png","gif","webp","avif","bmp","svg","heic","heif","tif","tiff"].includes(ext)) return "image";
  if (["mp4","mov","webm","mkv","avi","m4v","3gp","ogv","flv","wmv"].includes(ext)) return "video";
  return null;
}

export async function uploadMedia(file: File, opts?: { title?: string; caption?: string }) {
  const mediaType = detectMediaType(file);
  if (!mediaType) throw new Error(`Unsupported file: ${file.name}`);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${mediaType}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (upErr) throw upErr;

  const { error: insErr } = await supabase.from("campaign_media").insert({
    storage_path: path,
    media_type: mediaType,
    mime_type: file.type || null,
    title: opts?.title ?? file.name,
    caption: opts?.caption ?? null,
    size_bytes: file.size,
  });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw insErr;
  }
}

export async function deleteMedia(item: CampaignMedia) {
  await supabase.storage.from(BUCKET).remove([item.storage_path]);
  const { error } = await supabase.from("campaign_media").delete().eq("id", item.id);
  if (error) throw error;
}

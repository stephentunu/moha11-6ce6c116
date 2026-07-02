// Lightweight client-side image editing: rotate + aspect crop, via canvas.
// No external deps.

export type Aspect = "original" | "1:1" | "16:9" | "4:3" | "3:4";

export type ImageEdit = {
  rotate: 0 | 90 | 180 | 270;
  aspect: Aspect;
};

export const DEFAULT_EDIT: ImageEdit = { rotate: 0, aspect: "original" };

function aspectRatio(a: Aspect): number | null {
  switch (a) {
    case "1:1": return 1;
    case "16:9": return 16 / 9;
    case "4:3": return 4 / 3;
    case "3:4": return 3 / 4;
    default: return null;
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

export async function renderPreview(file: File, edit: ImageEdit, maxSize = 400): Promise<string> {
  const blob = await applyEdit(file, edit, maxSize);
  return URL.createObjectURL(blob);
}

export async function applyEdit(file: File, edit: ImageEdit, maxSize?: number): Promise<Blob> {
  const img = await loadImage(file);

  // Post-rotation dimensions
  const swap = edit.rotate === 90 || edit.rotate === 270;
  const rW = swap ? img.height : img.width;
  const rH = swap ? img.width : img.height;

  // Compute crop within rotated frame
  const ratio = aspectRatio(edit.aspect);
  let cropW = rW;
  let cropH = rH;
  if (ratio) {
    if (rW / rH > ratio) {
      cropH = rH;
      cropW = Math.round(rH * ratio);
    } else {
      cropW = rW;
      cropH = Math.round(rW / ratio);
    }
  }

  // Optional downscale for previews
  let outW = cropW;
  let outH = cropH;
  if (maxSize) {
    const scale = Math.min(1, maxSize / Math.max(cropW, cropH));
    outW = Math.round(cropW * scale);
    outH = Math.round(cropH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;

  // Move origin to canvas center, rotate, draw image so the desired crop lands on the canvas
  ctx.save();
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate((edit.rotate * Math.PI) / 180);
  const scale = outW / cropW; // uniform (outH/cropH is same)
  ctx.scale(scale, scale);
  // Draw the original image centered — in the rotated space, image extends from -img.w/2..img.w/2
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();

  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const quality = type === "image/jpeg" ? 0.92 : undefined;
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), type, quality),
  );
}

export function isEditableImage(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  // Skip formats we can't reliably decode in <img>
  const bad = ["image/heic", "image/heif", "image/tiff"];
  return !bad.includes(file.type);
}

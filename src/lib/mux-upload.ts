/**
 * Admin-only utility for uploading a video file to Mux
 * and associating it with a product in Convex.
 *
 * Usage:
 *   import { uploadProductVideo } from '@/lib/mux';
 *   await uploadProductVideo(productId, file, "Product Showcase");
 */
import { createMuxUpload, uploadToMux, getMuxAssetPlayback } from "./mux";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;

async function insertVideoRecord(
  productId: string,
  muxAssetId: string,
  muxPlaybackId: string,
  title?: string,
  duration?: number
): Promise<string> {
  const res = await fetch(`${CONVEX_URL}/api/videos/insertVideo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, muxAssetId, muxPlaybackId, title, duration }),
  });

  if (!res.ok) throw new Error("Failed to save video record");
  const data = await res.json();
  return data.id;
}

/**
 * Upload a video file to Mux and link it to a product.
 * Returns the inserted video record ID.
 */
export async function uploadProductVideo(
  productId: string,
  file: File,
  title?: string
): Promise<string> {
  const { uploadId, uploadUrl, assetId } = await createMuxUpload();

  await uploadToMux(uploadUrl, file);

  let playbackId = "";
  let duration = 0;
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const info = await getMuxAssetPlayback(assetId);
      if (info.status === "ready") {
        playbackId = info.playbackId;
        duration = info.duration;
        break;
      }
    } catch {
      // asset may still be processing
    }
    attempts++;
  }

  if (!playbackId) {
    throw new Error("Video processing timed out");
  }

  const videoId = await insertVideoRecord(productId, assetId, playbackId, title, duration);
  return videoId;
}

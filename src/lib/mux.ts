/**
 * Mux client-side helper
 * Wraps direct upload creation for product videos
 */

export interface MuxUpload {
  uploadId: string;
  uploadUrl: string;
  assetId: string;
}

export interface MuxPlayback {
  assetId: string;
  playbackId: string;
  status: string;
  duration: number;
}

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;

/**
 * Create a direct upload URL for uploading a video to Mux.
 */
export async function createMuxUpload(): Promise<MuxUpload> {
  const res = await fetch(`${CONVEX_URL}/api/mux/createDirectUpload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Failed to create Mux upload: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get playback info for an asset.
 */
export async function getMuxAssetPlayback(assetId: string): Promise<MuxPlayback> {
  const res = await fetch(`${CONVEX_URL}/api/mux/getAssetPlaybackId`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get Mux playback: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Upload a file directly to Mux using the upload URL.
 */
export async function uploadToMux(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Mux upload failed: ${res.statusText}`);
  }
}

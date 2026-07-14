import { httpAction } from "./_generated/server";

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID ?? "";
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET ?? "";
const MUX_API = "https://api.mux.com";

function getAuthHeader(): string {
  return "Basic " + Buffer.from(MUX_TOKEN_ID + ":" + MUX_TOKEN_SECRET).toString("base64");
}

export const createDirectUpload = httpAction(async (_ctx, request) => {
  const res = await fetch(MUX_API + "/video/v1/uploads", {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
      cors_origin: "*",
    }),
  });

  const data = await res.json();

  if (!data.data) {
    return new Response(JSON.stringify({ error: "Failed to create upload" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      upload_id: data.data.id,
      upload_url: data.data.url,
      asset_id: data.data.asset_id,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});

export const getAssetPlaybackId = httpAction(async (_ctx, request) => {
  const body = await request.json();
  const assetId = body.assetId;

  const res = await fetch(MUX_API + "/video/v1/assets/" + assetId, {
    headers: { Authorization: getAuthHeader() },
  });

  const data = await res.json();

  if (!data.data) {
    return new Response(JSON.stringify({ error: "Asset not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const playbackId = data.data.playback_ids && data.data.playback_ids.length > 0
    ? data.data.playback_ids[0].id
    : "";

  return new Response(
    JSON.stringify({
      asset_id: data.data.id,
      playback_id: playbackId,
      status: data.data.status,
      duration: data.data.duration,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});

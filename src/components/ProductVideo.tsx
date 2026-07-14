import { lazy, Suspense } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Film } from "lucide-react";

const MuxPlayerLazy = lazy(() => import("@mux/mux-player-react"));

interface ProductVideoProps {
  productId: string;
}

function MuxPlayerFallback() {
  return (
    <div className="aspect-video w-full bg-luxury-gray-100 flex items-center justify-center">
      <span className="text-xs text-luxury-gray-400 font-mono uppercase tracking-wider">Loading video player...</span>
    </div>
  );
}

export default function ProductVideo({ productId }: ProductVideoProps) {
  const videos = useQuery(api.videos.getByProduct, { productId }) ?? [];

  if (videos.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Film className="h-4 w-4 text-luxury-gray-400" />
        <span className="text-[10px] font-bold tracking-widest text-luxury-gray-400 uppercase font-mono">
          Product Video
        </span>
      </div>
      {videos.map((video) => (
        <div
          key={video._id}
          className="rounded-2xl overflow-hidden border border-luxury-gray-200/50 bg-black"
        >
          <Suspense fallback={<MuxPlayerFallback />}>
            <MuxPlayerLazy
              playbackId={video.muxPlaybackId}
              metadata={{
                video_title: video.title ?? "Product Video",
              }}
              className="aspect-video w-full"
              accentColor="#000"
            />
          </Suspense>
          {video.title && (
            <div className="px-4 py-2.5 bg-white border-t border-luxury-gray-200/50">
              <p className="text-[10px] font-bold tracking-wider text-luxury-gray-500 uppercase font-mono">
                {video.title}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

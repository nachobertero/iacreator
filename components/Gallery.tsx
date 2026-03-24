"use client";

import { Download, ImageIcon, Film, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationResult } from "@/lib/types";

interface GalleryProps {
  results: GenerationResult[];
}

export default function Gallery({ results }: GalleryProps) {
  if (results.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="px-4 sm:px-6 pt-6">
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
        {results.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[65vh] px-6 select-none">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/10 flex items-center justify-center animate-float">
          <Sparkles className="w-7 h-7 text-violet-400/40" />
        </div>
        <div className="absolute -inset-3 rounded-3xl border border-violet-500/[0.06] animate-pulse" />
      </div>

      <div className="text-center space-y-2.5 mb-8">
        <h2 className="text-white/80 text-lg font-semibold tracking-[-0.01em]">
          Tu estudio creativo
        </h2>
        <p className="text-white/25 text-sm max-w-sm leading-relaxed">
          Escribe un prompt abajo para generar tu primera imagen o video con inteligencia artificial
        </p>
      </div>

      {/* Mode hints */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-white/15 text-xs">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Imagenes</span>
        </div>
        <div className="w-px h-3 bg-white/[0.06]" />
        <div className="flex items-center gap-1.5 text-white/15 text-xs">
          <Film className="w-3.5 h-3.5" />
          <span>Videos</span>
        </div>
        <div className="w-px h-3 bg-white/[0.06]" />
        <span className="text-white/10 text-xs font-mono">Cmd + Enter</span>
      </div>
    </div>
  );
}

// ── Gallery card ────────────────────────────────────────────────
function GalleryCard({ item, index }: { item: GenerationResult; index: number }) {
  const handleDownload = () => {
    if (!item.url) return;
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `ai-creator-${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
    a.target = "_blank";
    a.click();
  };

  // ── Loading state ─────────────────────────────────────────────
  if (item.status === "pending" || item.status === "processing") {
    return (
      <div
        className="break-inside-avoid rounded-xl overflow-hidden border border-violet-500/10 bg-[#0c0c10] animate-fade-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                {item.type === "video" ? (
                  <Film className="w-5 h-5 text-violet-400/40" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-violet-400/40" />
                )}
              </div>
            </div>
            <Loader2 className="w-4 h-4 text-violet-400/30 animate-spin" />
          </div>
        </div>

        <div className="px-3 py-2.5 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-pulse shrink-0" />
            <p className="text-[11px] text-violet-400/60 font-medium truncate">
              {item.statusText || "Generando..."}
            </p>
          </div>
          <p className="text-[11px] text-white/20 line-clamp-1">{item.prompt}</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (item.status === "failed") {
    return (
      <div className="break-inside-avoid rounded-xl overflow-hidden border border-red-500/10 bg-[#0c0c10] animate-fade-up">
        <div className="h-32 bg-red-950/15 flex flex-col items-center justify-center gap-2 px-4">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-400/50" />
          </div>
          <p className="text-[11px] text-red-400/50 text-center leading-relaxed max-w-[200px]">
            {item.statusText || "Error en la generacion"}
          </p>
        </div>
        <div className="px-3 py-2.5 border-t border-white/[0.04]">
          <p className="text-[11px] text-white/20 line-clamp-1">{item.prompt}</p>
        </div>
      </div>
    );
  }

  // ── Completed state ───────────────────────────────────────────
  return (
    <div
      className="break-inside-avoid rounded-xl overflow-hidden group relative bg-[#0c0c10] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {item.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url!}
          alt={item.prompt}
          className="w-full object-cover"
          loading="lazy"
        />
      ) : (
        <video
          src={item.url!}
          className="w-full object-cover"
          loop
          muted
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white/60 text-[10px] font-medium px-2 py-1 rounded-md border border-white/[0.06]">
            {item.type === "video" ? (
              <><Film className="w-3 h-3" />Video</>
            ) : (
              <><ImageIcon className="w-3 h-3" />Imagen</>
            )}
          </span>
          <button
            onClick={handleDownload}
            className="w-7 h-7 bg-black/50 backdrop-blur-md hover:bg-violet-600 text-white/70 hover:text-white rounded-md flex items-center justify-center transition-all duration-200 border border-white/[0.06] hover:border-violet-500/50"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom prompt */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">{item.prompt}</p>
        </div>
      </div>
    </div>
  );
}

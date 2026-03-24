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
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3.5 space-y-3.5">
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
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/10 flex items-center justify-center animate-float">
          <Sparkles className="w-9 h-9 text-violet-400/40" />
        </div>
        <div className="absolute -inset-4 rounded-3xl border border-violet-500/[0.06] animate-pulse" />
      </div>

      <div className="text-center space-y-3 mb-10">
        <h2 className="text-white/90 text-2xl font-bold tracking-[-0.02em]">
          Tu estudio creativo
        </h2>
        <p className="text-white/35 text-base max-w-md leading-relaxed">
          Escribe un prompt abajo para generar tu primera imagen o video con inteligencia artificial
        </p>
      </div>

      {/* Mode hints */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-white/25 text-sm">
          <ImageIcon className="w-4 h-4" />
          <span>Imagenes</span>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <div className="flex items-center gap-2 text-white/25 text-sm">
          <Film className="w-4 h-4" />
          <span>Videos</span>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <span className="text-white/15 text-sm font-mono">Cmd + Enter</span>
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
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                {item.type === "video" ? (
                  <Film className="w-5 h-5 text-violet-400/40" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-violet-400/40" />
                )}
              </div>
            </div>
            <Loader2 className="w-5 h-5 text-violet-400/30 animate-spin" />
          </div>
        </div>

        <div className="px-3.5 py-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400/50 animate-pulse shrink-0" />
            <p className="text-xs text-violet-400/70 font-medium truncate">
              {item.statusText || "Generando..."}
            </p>
          </div>
          <p className="text-xs text-white/30 line-clamp-1">{item.prompt}</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (item.status === "failed") {
    return (
      <div className="break-inside-avoid rounded-xl overflow-hidden border border-red-500/10 bg-[#0c0c10] animate-fade-up">
        <div className="h-36 bg-red-950/15 flex flex-col items-center justify-center gap-2.5 px-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400/50" />
          </div>
          <p className="text-xs text-red-400/60 text-center leading-relaxed max-w-[220px]">
            {item.statusText || "Error en la generacion"}
          </p>
        </div>
        <div className="px-3.5 py-3 border-t border-white/[0.04]">
          <p className="text-xs text-white/30 line-clamp-1">{item.prompt}</p>
        </div>
      </div>
    );
  }

  // ── Completed state ───────────────────────────────────────────
  return (
    <div
      className="break-inside-avoid rounded-xl overflow-hidden group relative bg-[#0c0c10] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 animate-fade-up"
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
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white/70 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-white/[0.08]">
            {item.type === "video" ? (
              <><Film className="w-3.5 h-3.5" />Video</>
            ) : (
              <><ImageIcon className="w-3.5 h-3.5" />Imagen</>
            )}
          </span>
          <button
            onClick={handleDownload}
            className="w-8 h-8 bg-black/50 backdrop-blur-md hover:bg-violet-600 text-white/70 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 border border-white/[0.08] hover:border-violet-500/50"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom prompt */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{item.prompt}</p>
        </div>
      </div>
    </div>
  );
}

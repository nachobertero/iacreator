"use client";

import { useState } from "react";
import {
  Download, ImageIcon, Film, Loader2, AlertCircle, Sparkles,
  Heart, Search, Filter, Trash2, Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationResult, GalleryFilter } from "@/lib/types";

interface GalleryProps {
  results: GenerationResult[];
  onClickItem: (item: GenerationResult) => void;
  onToggleFavorite: (id: string) => void;
  onOpenTemplates: () => void;
}

const FILTER_OPTIONS: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "images", label: "Imagenes" },
  { id: "videos", label: "Videos" },
  { id: "favorites", label: "Favoritos" },
];

export default function Gallery({ results, onClickItem, onToggleFavorite, onOpenTemplates }: GalleryProps) {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  if (results.length === 0) {
    return <EmptyState onOpenTemplates={onOpenTemplates} />;
  }

  // Apply filters
  let filtered = results;
  if (filter === "images") filtered = filtered.filter((r) => r.type === "image");
  if (filter === "videos") filtered = filtered.filter((r) => r.type === "video");
  if (filter === "favorites") filtered = filtered.filter((r) => r.favorite);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((r) => r.prompt.toLowerCase().includes(q));
  }

  const completedCount = results.filter((r) => r.status === "completed").length;
  const favCount = results.filter((r) => r.favorite).length;

  return (
    <div className="px-4 sm:px-6 pt-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                filter === f.id
                  ? "bg-violet-500/15 border-violet-500/30 text-white"
                  : "bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white/55 hover:bg-white/[0.05]"
              )}
            >
              {f.label}
              {f.id === "favorites" && favCount > 0 && (
                <span className="ml-1.5 text-xs text-pink-400/60">{favCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Right side: count + search toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/20 hidden sm:block">
            {completedCount} creacion{completedCount !== 1 ? "es" : ""}
          </span>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-all border",
              showSearch
                ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                : "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/50"
            )}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="mb-4 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por prompt..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-violet-500/30"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Empty filter state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="w-8 h-8 text-white/15 mb-3" />
          <p className="text-white/35 text-sm">No hay resultados con este filtro</p>
        </div>
      )}

      {/* Masonry grid */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3.5 space-y-3.5">
        {filtered.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => item.status === "completed" && onClickItem(item)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ onOpenTemplates }: { onOpenTemplates: () => void }) {
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

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-300 text-sm font-medium hover:bg-violet-600/25 transition-all"
        >
          <Wand2 className="w-4 h-4" />
          Ver plantillas
        </button>
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
function GalleryCard({
  item,
  index,
  onClick,
  onToggleFavorite,
}: {
  item: GenerationResult;
  index: number;
  onClick: () => void;
  onToggleFavorite: () => void;
}) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.url) return;
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `ai-creator-${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
    a.target = "_blank";
    a.click();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
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
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
              {item.type === "video" ? (
                <Film className="w-5 h-5 text-violet-400/40" />
              ) : (
                <ImageIcon className="w-5 h-5 text-violet-400/40" />
              )}
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
      onClick={onClick}
      className="break-inside-avoid rounded-xl overflow-hidden group relative bg-[#0c0c10] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 animate-fade-up cursor-pointer"
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

      {/* Favorite indicator (always visible if favorited) */}
      {item.favorite && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <Heart className="w-4 h-4 text-pink-400 fill-current drop-shadow-lg" />
        </div>
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

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFavorite}
              className={cn(
                "w-8 h-8 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center transition-all duration-200 border border-white/[0.08]",
                item.favorite
                  ? "text-pink-400 hover:text-pink-300"
                  : "text-white/50 hover:text-pink-400"
              )}
            >
              <Heart className={cn("w-4 h-4", item.favorite && "fill-current")} />
            </button>
            <button
              onClick={handleDownload}
              className="w-8 h-8 bg-black/50 backdrop-blur-md hover:bg-violet-600 text-white/70 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 border border-white/[0.08] hover:border-violet-500/50"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom prompt */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{item.prompt}</p>
        </div>
      </div>
    </div>
  );
}

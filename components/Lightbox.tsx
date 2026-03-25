"use client";

import { useEffect, useCallback } from "react";
import {
  X, Download, Heart, Trash2,
  Copy, RefreshCw, Film, ImageIcon, Zap, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationResult } from "@/lib/types";

interface LightboxProps {
  item: GenerationResult | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (prompt: string, mode: "image" | "video") => void;
}

export default function Lightbox({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
  onRegenerate,
}: LightboxProps) {
  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!item) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item || item.status !== "completed" || !item.url) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = item.url!;
    a.download = `ai-creator-${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
    a.target = "_blank";
    a.click();
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
  };

  const handleRegenerate = () => {
    onClose();
    onRegenerate(item.prompt, item.type);
  };

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };

  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-white/70" />
      </button>

      <div className="flex flex-col lg:flex-row max-w-6xl w-full max-h-[90vh] mx-4 gap-0 lg:gap-6">

        {/* Media */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.prompt}
              className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          ) : (
            <video
              src={item.url}
              className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-xl shadow-2xl"
              controls
              autoPlay
              loop
              playsInline
            />
          )}
        </div>

        {/* Sidebar info */}
        <div className="w-full lg:w-80 shrink-0 bg-[#0c0c10]/90 backdrop-blur-sm border border-white/[0.06] rounded-xl p-5 mt-4 lg:mt-0 overflow-y-auto max-h-[30vh] lg:max-h-[85vh] animate-slide-up">

          {/* Type badge + time */}
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/50 bg-white/[0.05] border border-white/[0.06] px-2.5 py-1 rounded-lg">
              {item.type === "video" ? (
                <><Film className="w-3.5 h-3.5" />Video</>
              ) : (
                <><ImageIcon className="w-3.5 h-3.5" />Imagen</>
              )}
            </span>
            <span className="text-xs text-white/30 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          {/* Prompt */}
          <div className="mb-5">
            <p className="text-xs text-white/35 uppercase tracking-wider font-semibold mb-2">Prompt</p>
            <p className="text-sm text-white/75 leading-relaxed">{item.prompt}</p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-2 mb-5">
            {item.modelName && (
              <span className="text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                {item.modelName}
              </span>
            )}
            {item.ratio && (
              <span className="text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                {item.ratio}
              </span>
            )}
            {item.duration && (
              <span className="text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                {item.duration}s
              </span>
            )}
            {item.credits && (
              <span className="text-xs text-yellow-400/60 bg-yellow-500/[0.05] border border-yellow-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Zap className="w-3 h-3" /> {item.credits} cr
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all active:scale-[0.97]"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>

            <button
              onClick={() => onToggleFavorite(item.id)}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] border",
                item.favorite
                  ? "bg-pink-500/15 border-pink-500/25 text-pink-400"
                  : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.07]"
              )}
            >
              <Heart className={cn("w-4 h-4", item.favorite && "fill-current")} />
              {item.favorite ? "Favorito" : "Favorito"}
            </button>

            <button
              onClick={handleCopyPrompt}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.07] text-sm font-medium transition-all active:scale-[0.97]"
            >
              <Copy className="w-4 h-4" />
              Copiar prompt
            </button>

            <button
              onClick={handleRegenerate}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.07] text-sm font-medium transition-all active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4" />
              Re-generar
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-red-400/40 hover:text-red-400/70 hover:bg-red-500/[0.05] text-xs font-medium transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Time ago helper ──────────────────────────────────────────────
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return new Date(timestamp).toLocaleDateString("es");
}

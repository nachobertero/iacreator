"use client";

import { useState } from "react";
import { X, Wand2, Loader2, Film, ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/lib/prompts";
import type { PreviewCache } from "@/lib/template-previews";
import type { PromptCategory, Mode } from "@/lib/types";

interface PromptTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelect: (prompt: string, mode: Mode) => void;
  previewCache: PreviewCache;
  pendingCount: number; // how many previews still generating
}

export default function PromptTemplates({
  open,
  onClose,
  onSelect,
  previewCache,
  pendingCount,
}: PromptTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<PromptCategory | "all">("all");

  if (!open) return null;

  const filtered =
    activeCategory === "all"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.category === activeCategory);

  const total = PROMPT_TEMPLATES.length;
  const ready = Object.keys(previewCache).length;
  const allReady = ready >= total;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-3xl bg-[#0a0a0f] border border-white/[0.07] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Wand2 className="w-[18px] h-[18px] text-violet-400" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold tracking-[-0.02em]">
                Plantillas de prompts
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                {allReady ? (
                  <p className="text-white/35 text-sm">
                    Click en una plantilla para usarla
                  </p>
                ) : (
                  <p className="text-white/35 text-sm flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-violet-400/50" />
                    Generando previews ({ready}/{total})
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors shrink-0 ml-3"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Category filter */}
        <div className="px-6 py-3.5 shrink-0 border-b border-white/[0.04]">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                activeCategory === "all"
                  ? "bg-violet-500/15 border-violet-500/30 text-white"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
              )}
            >
              Todas
            </button>
            {PROMPT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-1.5",
                  activeCategory === cat.id
                    ? "bg-violet-500/15 border-violet-500/30 text-white"
                    : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60"
                )}
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates grid */}
        <div className="px-5 py-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((template) => {
              const previewUrl = previewCache[template.id];
              const catInfo = PROMPT_CATEGORIES.find((c) => c.id === template.category);
              const isGenerating = !previewUrl && pendingCount > 0;

              return (
                <div
                  key={template.id}
                  onClick={() => onSelect(template.prompt, template.mode)}
                  className="rounded-xl overflow-hidden border border-white/[0.06] bg-[#0c0c10] hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition-all duration-200 group cursor-pointer flex flex-col"
                >
                  {/* Preview image area */}
                  <div className="relative aspect-square overflow-hidden bg-[#0d0d14]">
                    {previewUrl ? (
                      /* Real AI-generated preview */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    ) : isGenerating ? (
                      /* Still generating in background */
                      <div className="w-full h-full bg-gradient-to-br from-violet-950/30 to-fuchsia-950/15 flex flex-col items-center justify-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-violet-400/35" />
                          </div>
                          <Loader2 className="absolute -bottom-1.5 -right-1.5 w-5 h-5 text-violet-400/50 animate-spin" />
                        </div>
                        <p className="text-[11px] text-violet-400/40 font-medium">Generando...</p>
                      </div>
                    ) : (
                      /* No preview, no generation in progress */
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">{catInfo?.emoji ?? "✨"}</span>
                      </div>
                    )}

                    {/* Mode badge — always visible */}
                    <div className="absolute bottom-2 left-2">
                      <span className={cn(
                        "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md",
                        template.mode === "video"
                          ? "bg-fuchsia-900/70 text-fuchsia-300/70 border border-fuchsia-500/20"
                          : "bg-violet-900/70 text-violet-300/70 border border-violet-500/20"
                      )}>
                        {template.mode === "video"
                          ? <><Film className="w-2.5 h-2.5" />Video</>
                          : <><ImageIcon className="w-2.5 h-2.5" />Imagen</>
                        }
                      </span>
                    </div>

                    {/* Hover: "Usar este" overlay */}
                    {previewUrl && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg">
                          Usar este
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info row */}
                  <div className="px-3.5 py-3">
                    <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-tight">
                      {template.title}
                    </p>
                    <p className="text-xs text-white/30 line-clamp-1 mt-0.5 leading-snug">
                      {template.prompt.slice(0, 65)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

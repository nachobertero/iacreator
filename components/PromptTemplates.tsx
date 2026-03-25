"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Wand2, Loader2, RefreshCw, Zap, Film, ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/lib/prompts";
import {
  loadPreviewCache,
  savePreviewToCache,
  generateTemplatePreview,
  type PreviewCache,
} from "@/lib/template-previews";
import type { PromptCategory, Mode } from "@/lib/types";

interface PromptTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelect: (prompt: string, mode: Mode) => void;
}

export default function PromptTemplates({ open, onClose, onSelect }: PromptTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<PromptCategory | "all">("all");
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  // Map of templateId → "loading" | "error" | undefined (idle)
  const [generating, setGenerating] = useState<Record<string, "loading" | "error">>({});

  // Load cached previews when modal opens
  useEffect(() => {
    if (open) {
      setPreviewCache(loadPreviewCache());
    }
  }, [open]);

  const handleGeneratePreview = useCallback(
    async (templateId: string, prompt: string) => {
      setGenerating((prev) => ({ ...prev, [templateId]: "loading" }));
      try {
        const url = await generateTemplatePreview(prompt);
        savePreviewToCache(templateId, url);
        setPreviewCache((prev) => ({ ...prev, [templateId]: url }));
        setGenerating((prev) => {
          const next = { ...prev };
          delete next[templateId];
          return next;
        });
      } catch {
        setGenerating((prev) => ({ ...prev, [templateId]: "error" }));
      }
    },
    []
  );

  if (!open) return null;

  const filtered =
    activeCategory === "all"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.category === activeCategory);

  const cachedCount = Object.keys(previewCache).length;

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
              <h2 className="text-white text-xl font-bold tracking-[-0.02em]">Plantillas de prompts</h2>
              <p className="text-white/35 text-sm mt-0.5">
                Click en una tarjeta para usarla &middot; Click en la imagen para generar preview
                {cachedCount > 0 && (
                  <span className="ml-1.5 text-violet-400/50">{cachedCount} preview{cachedCount !== 1 ? "s" : ""} guardado{cachedCount !== 1 ? "s" : ""}</span>
                )}
              </p>
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
              const genState = generating[template.id];
              const catInfo = PROMPT_CATEGORIES.find((c) => c.id === template.category);

              return (
                <div
                  key={template.id}
                  className="rounded-xl overflow-hidden border border-white/[0.06] bg-[#0c0c10] hover:border-violet-500/25 transition-all duration-200 group cursor-pointer flex flex-col"
                  onClick={() => onSelect(template.prompt, template.mode)}
                >
                  {/* Preview image area */}
                  <div
                    className="relative aspect-square overflow-hidden"
                    onClick={(e) => {
                      // If clicking the preview area without a preview, generate one
                      if (!previewUrl && genState !== "loading") {
                        e.stopPropagation(); // Don't also trigger onSelect
                        handleGeneratePreview(template.id, template.prompt);
                      }
                    }}
                  >
                    {previewUrl ? (
                      <>
                        {/* Actual preview */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt={template.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                        {/* Regenerate button overlay on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGeneratePreview(template.id, template.prompt);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/[0.1] hover:bg-black/80"
                          title="Regenerar preview"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-white/60" />
                        </button>
                      </>
                    ) : genState === "loading" ? (
                      /* Loading state */
                      <div className="w-full h-full bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20 flex flex-col items-center justify-center gap-2.5">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-violet-400/40" />
                          </div>
                          <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-violet-400/60 animate-spin" />
                        </div>
                        <p className="text-xs text-violet-400/50 font-medium px-3 text-center">Generando preview...</p>
                      </div>
                    ) : genState === "error" ? (
                      /* Error state */
                      <div
                        className="w-full h-full bg-red-950/20 flex flex-col items-center justify-center gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePreview(template.id, template.prompt);
                        }}
                      >
                        <p className="text-xs text-red-400/60 text-center px-3">Error. Click para reintentar</p>
                        <RefreshCw className="w-4 h-4 text-red-400/40" />
                      </div>
                    ) : (
                      /* No preview yet — click to generate */
                      <div className="w-full h-full bg-gradient-to-br from-[#0f0a1e] to-[#0a0f1e] flex flex-col items-center justify-center gap-3 group-hover:from-violet-950/30 group-hover:to-fuchsia-950/20 transition-all duration-300">
                        <div className="text-3xl">{catInfo?.emoji ?? "✨"}</div>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:bg-violet-500/[0.08] group-hover:border-violet-500/20 transition-all duration-200">
                            <Zap className="w-3 h-3 text-yellow-400/50" />
                            <span className="text-xs text-white/35 group-hover:text-white/60 transition-colors font-medium">Generar preview</span>
                          </div>
                          <p className="text-[10px] text-white/15 text-center px-4">~3 creditos &middot; 1x</p>
                        </div>
                      </div>
                    )}

                    {/* Mode badge */}
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
                  </div>

                  {/* Info row */}
                  <div className="px-3.5 py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-tight">{template.title}</p>
                      <p className="text-xs text-white/30 line-clamp-1 mt-0.5 leading-snug">{template.prompt.slice(0, 60)}...</p>
                    </div>
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-lg bg-violet-600/80 flex items-center justify-center">
                        <Wand2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
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

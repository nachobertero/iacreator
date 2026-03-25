"use client";

import { useState } from "react";
import { X, Wand2, Film, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/lib/prompts";
import type { PromptCategory, Mode } from "@/lib/types";

interface PromptTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelect: (prompt: string, mode: Mode) => void;
}

export default function PromptTemplates({ open, onClose, onSelect }: PromptTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<PromptCategory | "all">("all");

  if (!open) return null;

  const filtered =
    activeCategory === "all"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-2xl bg-[#0a0a0f] border border-white/[0.07] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[85vh] flex flex-col">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Wand2 className="w-[18px] h-[18px] text-violet-400" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold tracking-[-0.02em]">Plantillas</h2>
              <p className="text-white/35 text-sm mt-0.5">Click para usar el prompt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
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

        {/* Templates list */}
        <div className="px-4 py-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template.prompt, template.mode)}
                className="text-left p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/[0.04] transition-all duration-150 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    {template.title}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ml-2",
                    template.mode === "video"
                      ? "text-fuchsia-400/60 bg-fuchsia-500/10"
                      : "text-violet-400/60 bg-violet-500/10"
                  )}>
                    {template.mode === "video"
                      ? <><Film className="w-2.5 h-2.5" />Video</>
                      : <><ImageIcon className="w-2.5 h-2.5" />Imagen</>
                    }
                  </span>
                </div>
                <p className="text-xs text-white/35 leading-relaxed line-clamp-2 group-hover:text-white/50 transition-colors">
                  {template.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

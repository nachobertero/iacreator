"use client";

import { X, Zap, Sparkles, Crown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREDIT_PACKS } from "@/lib/credits";

const SKOOL_URL = "https://www.skool.com/tu-comunidad";

interface CreditModalProps {
  open: boolean;
  onClose: () => void;
}

const packIcons = [Zap, Sparkles, Crown];

export default function CreditModal({ open, onClose }: CreditModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-lg bg-[#0a0a0f] border border-white/[0.07] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-white/12" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 sm:pt-6">
          <div>
            <h2 className="text-white text-lg font-semibold tracking-[-0.01em]">Recargar creditos</h2>
            <p className="text-white/30 text-xs mt-1">
              1 credito ~ $0.10 &middot; No expiran
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>

        {/* Packs */}
        <div className="px-6 pb-4 grid grid-cols-3 gap-2">
          {CREDIT_PACKS.map((pack, i) => {
            const Icon = packIcons[i];
            const isPopular = pack.popular;

            const styleMap = [
              {
                card: "border-white/[0.06] bg-white/[0.02]",
                icon: "text-white/35 bg-white/[0.05]",
                button: "bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.06]",
              },
              {
                card: "border-violet-500/15 bg-violet-500/[0.05]",
                icon: "text-violet-400 bg-violet-500/12",
                button: "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/25",
              },
              {
                card: "border-fuchsia-500/20 bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.06]",
                icon: "text-fuchsia-400 bg-fuchsia-500/12",
                button: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border border-fuchsia-500/15 shadow-lg shadow-fuchsia-500/10",
              },
            ];

            const s = styleMap[i];

            return (
              <div
                key={pack.id}
                className={cn(
                  "relative rounded-xl border p-3.5 flex flex-col gap-3 transition-all duration-200",
                  s.card,
                  isPopular && "ring-1 ring-fuchsia-500/20"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                    Popular
                  </div>
                )}

                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.icon)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="text-white/45 text-[11px] font-medium mb-1">{pack.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold tabular-nums text-white">{pack.credits}</span>
                    <span className="text-white/25 text-[10px]">cr</span>
                  </div>
                  {pack.bonus && (
                    <p className="text-[10px] text-violet-400/70 mt-0.5 font-medium">{pack.bonus}</p>
                  )}
                </div>

                <div className="mt-auto space-y-2">
                  <p className="text-white/35 text-xs font-semibold">${pack.price}</p>
                  <a
                    href={SKOOL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center gap-1 w-full text-center text-[11px] font-semibold py-2 rounded-lg transition-all duration-200",
                      s.button
                    )}
                  >
                    Pedir
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* How to buy */}
        <div className="mx-6 mb-6 bg-violet-500/[0.05] border border-violet-500/10 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ExternalLink className="w-3 h-3 text-violet-400/60" />
            <p className="text-violet-300/70 text-xs font-medium">Como comprar?</p>
          </div>
          <p className="text-white/35 text-xs leading-relaxed">
            Haz click en &quot;Pedir&quot;, escribeme en Skool con el pack que quieres y tu email, y anado los creditos en minutos.
          </p>
          <p className="text-white/20 text-[11px] mt-1.5">
            PayPal &middot; Pronto disponible con tarjeta
          </p>
        </div>
      </div>
    </div>
  );
}

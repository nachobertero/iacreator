"use client";

import { useState } from "react";
import { Zap, ArrowLeft, Crown, ImageIcon, Film } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";
import { formatCredits, CREDIT_PACKS } from "@/lib/credits";
import CreditModal from "@/components/CreditModal";

export default function CuentaPage() {
  const { credits, loading } = useCredits();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <main className="min-h-screen pb-24">
        <div className="max-w-xl mx-auto px-6 pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium transition-colors duration-200 mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al studio
          </Link>

          {/* Credits card */}
          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-7 mb-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-base">Balance de creditos</h2>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-violet-300/80 hover:text-violet-200 bg-violet-500/8 hover:bg-violet-500/15 border border-violet-500/15 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                + Comprar
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/8 border border-yellow-500/15 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-white text-4xl font-bold tabular-nums">
                  {loading ? "--" : formatCredits(credits)}
                </div>
                <div className="text-white/35 text-sm">creditos disponibles</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="text-white font-bold text-base">{pack.credits}</div>
                  <div className="text-white/30 text-xs">creditos</div>
                  <div className="text-white/50 text-sm font-semibold mt-1.5">${pack.price}</div>
                  {pack.bonus && (
                    <div className="text-violet-400/60 text-xs mt-1">{pack.bonus}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What you can create */}
          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-7 mb-5">
            <h2 className="text-white font-bold text-base mb-5">Que puedes crear?</h2>
            <div className="space-y-1">
              {[
                { icon: ImageIcon, label: "Imagen basica (Dreamina v3)", cost: 4 },
                { icon: ImageIcon, label: "Imagen premium (DALL-E 3)", cost: 5 },
                { icon: Film, label: "Video basico (Cinematic)", cost: 12 },
                { icon: Film, label: "Video pro (Seedance 1.5 Pro)", cost: 3 },
              ].map(({ icon: Icon, label, cost }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-2.5 text-white/55 text-sm">
                    <Icon className="w-4 h-4 text-white/30" />
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400/80 text-sm font-bold">
                    <Zap className="w-3 h-3" /> {cost}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan badge */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-violet-500/[0.06] to-fuchsia-500/[0.06] border border-violet-500/12 rounded-2xl p-5">
            <Crown className="w-6 h-6 text-violet-400/70 shrink-0" />
            <div>
              <p className="text-white text-base font-semibold">Plan Beta</p>
              <p className="text-white/35 text-sm">Acceso anticipado &middot; Precios especiales para miembros de Skool</p>
            </div>
          </div>
        </div>
      </main>

      <CreditModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

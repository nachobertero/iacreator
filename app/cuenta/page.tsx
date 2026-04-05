"use client";

import { useState, useEffect } from "react";
import { Zap, ArrowLeft, Crown, ImageIcon, Film, TrendingUp, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";
import { formatCredits, CREDIT_PACKS } from "@/lib/credits";
import { loadStats, loadGallery } from "@/lib/storage";
import type { GenerationStats } from "@/lib/types";
import CreditModal from "@/components/CreditModal";

export default function CuentaPage() {
  const { credits, loading } = useCredits();
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setStats(loadStats());
    const gallery = loadGallery();
    setFavCount(gallery.filter((r) => r.favorite).length);
  }, []);

  const totalGenerations = (stats?.totalImages ?? 0) + (stats?.totalVideos ?? 0);
  const hasActivity = totalGenerations > 0;

  return (
    <>
      <main className="min-h-screen pb-24">
        <div className="max-w-xl mx-auto px-6 pt-10">

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white/75 text-sm font-medium transition-colors duration-200 mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al studio
          </Link>

          {/* Credits card */}
          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-7 mb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Balance de creditos</h2>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-violet-300 hover:text-white bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/25 px-4 py-2 rounded-xl transition-all duration-200 font-semibold"
              >
                + Comprar
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <div className="text-white text-5xl font-bold tabular-nums tracking-tight">
                  {loading ? "—" : formatCredits(credits)}
                </div>
                <div className="text-white/40 text-sm mt-0.5">creditos disponibles</div>
              </div>
            </div>

            {/* Packs preview */}
            <div className="grid grid-cols-3 gap-2">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setShowModal(true)}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.10] rounded-xl p-3.5 text-center transition-all duration-150 group"
                >
                  <div className="text-white font-bold text-base group-hover:text-violet-200 transition-colors">{pack.credits} <span className="text-white/30 text-xs font-normal">cr</span></div>
                  <div className="text-white/60 text-sm font-semibold mt-1">${pack.price}</div>
                  {pack.bonus && (
                    <div className="text-violet-400/70 text-xs mt-1 font-medium">{pack.bonus}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-7 mb-4">
            <div className="flex items-center gap-2.5 mb-5">
              <TrendingUp className="w-5 h-5 text-violet-400/70" />
              <h2 className="text-white font-bold text-lg">Tus estadisticas</h2>
            </div>

            {hasActivity ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: totalGenerations, label: "Total creadas", color: "text-white" },
                  { value: stats?.totalImages ?? 0, label: "Imagenes", color: "text-violet-300", icon: <ImageIcon className="w-4 h-4 text-violet-400/60" /> },
                  { value: stats?.totalVideos ?? 0, label: "Videos", color: "text-fuchsia-300", icon: <Film className="w-4 h-4 text-fuchsia-400/60" /> },
                  { value: stats?.totalCreditsSpent ?? 0, label: "Creditos usados", color: "text-yellow-300", icon: <Zap className="w-4 h-4 text-yellow-400/60" /> },
                  { value: favCount, label: "Favoritos", color: "text-pink-300", icon: <Heart className="w-4 h-4 text-pink-400/60 fill-current" /> },
                ].map(({ value, label, color, icon }) => (
                  <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                    <div className={`flex items-center gap-1.5 ${color} text-2xl font-bold tabular-nums mb-1`}>
                      {icon}
                      {value}
                    </div>
                    <div className="text-xs text-white/40">{label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-violet-400/20 mx-auto mb-3" />
                <p className="text-white/35 text-sm">Aun no has generado nada.</p>
                <Link href="/" className="inline-flex items-center gap-1.5 text-violet-400/70 hover:text-violet-300 text-sm font-medium mt-2 transition-colors">
                  Ir al studio →
                </Link>
              </div>
            )}
          </div>

          {/* What you can create */}
          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-7 mb-4">
            <div className="flex items-center gap-2.5 mb-5">
              <Sparkles className="w-5 h-5 text-violet-400/70" />
              <h2 className="text-white font-bold text-lg">Que puedes crear?</h2>
            </div>
            <div className="space-y-0.5">
              {[
                { icon: ImageIcon, label: "Imagen basica (Dreamina v3)", cost: 4 },
                { icon: ImageIcon, label: "Imagen premium (DALL-E 3)", cost: 5 },
                { icon: Film, label: "Video rapido (Seedance Fast)", cost: 3 },
                { icon: Film, label: "Video premium (Kling 3.0 Pro)", cost: 9 },
                { icon: Film, label: "Video ultra (Google Veo 3.1)", cost: 24 },
              ].map(({ icon: Icon, label, cost }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Icon className="w-4 h-4 text-white/30 shrink-0" />
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold shrink-0">
                    <Zap className="w-3.5 h-3.5" /> {cost}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan badge */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-violet-500/[0.07] to-fuchsia-500/[0.07] border border-violet-500/15 rounded-2xl p-5">
            <Crown className="w-6 h-6 text-violet-400/80 shrink-0" />
            <div>
              <p className="text-white text-base font-semibold">Plan Beta</p>
              <p className="text-white/45 text-sm mt-0.5">Acceso anticipado &middot; Precios especiales para miembros de Skool</p>
            </div>
          </div>

        </div>
      </main>

      <CreditModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

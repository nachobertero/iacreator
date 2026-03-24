"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Plus, Sparkles } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { formatCredits } from "@/lib/credits";
import CreditModal from "./CreditModal";

export default function Header() {
  const { credits, mounted } = useCredits();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="border-b border-white/[0.06] glass sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300">
              <Sparkles className="w-[18px] h-[18px] text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-white font-bold text-lg tracking-[-0.02em]">
                AI Creator
              </span>
              <span className="text-[11px] font-semibold text-white/25 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-md">
                BETA
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2.5">

            {/* Credit balance */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 group"
            >
              <Zap className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              <span className="text-sm font-bold text-white tabular-nums">
                {mounted ? formatCredits(credits) : "--"}
              </span>
            </button>

            {/* Buy credits button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Comprar</span>
            </button>

            {/* Account link */}
            <Link
              href="/cuenta"
              className="h-10 w-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 flex items-center justify-center"
              title="Mi cuenta"
            >
              <svg className="w-[18px] h-[18px] text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <CreditModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

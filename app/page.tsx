"use client";

import { useState, useCallback } from "react";
import Gallery from "@/components/Gallery";
import BottomBar from "@/components/BottomBar";
import Lightbox from "@/components/Lightbox";
import PromptTemplates from "@/components/PromptTemplates";
import { useGallery } from "@/hooks/useGallery";
import type { GenerationResult, Mode } from "@/lib/types";

export default function Home() {
  const { results, addResult, updateResult, toggleFavorite, deleteResult } = useGallery();

  const [lightboxItem, setLightboxItem] = useState<GenerationResult | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [injectedPrompt, setInjectedPrompt] = useState<{ prompt: string; mode: Mode } | null>(null);

  const handleRegenerate = useCallback((prompt: string, mode: Mode) => {
    setInjectedPrompt({ prompt, mode });
  }, []);

  const handleSelectTemplate = useCallback((prompt: string, mode: Mode) => {
    setShowTemplates(false);
    setInjectedPrompt({ prompt, mode });
  }, []);

  const currentLightboxItem = lightboxItem
    ? results.find((r) => r.id === lightboxItem.id) ?? lightboxItem
    : null;

  return (
    <main className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex-1 overflow-y-auto pb-52">
        <Gallery
          results={results}
          onClickItem={setLightboxItem}
          onToggleFavorite={toggleFavorite}
          onOpenTemplates={() => setShowTemplates(true)}
        />
      </div>

      <BottomBar
        onAddResult={addResult}
        onUpdateResult={updateResult}
        injectedPrompt={injectedPrompt}
        onInjectedPromptConsumed={() => setInjectedPrompt(null)}
        onOpenTemplates={() => setShowTemplates(true)}
      />

      <Lightbox
        item={currentLightboxItem}
        onClose={() => setLightboxItem(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteResult}
        onRegenerate={handleRegenerate}
      />

      <PromptTemplates
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleSelectTemplate}
      />
    </main>
  );
}

"use client";

import { useState, useCallback } from "react";
import Gallery from "@/components/Gallery";
import BottomBar from "@/components/BottomBar";
import type { GenerationResult } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<GenerationResult[]>([]);

  const handleAddResult = useCallback((result: GenerationResult) => {
    setResults((prev) => [result, ...prev]);
  }, []);

  const handleUpdateResult = useCallback((id: string, updates: Partial<GenerationResult>) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  return (
    <main className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      <div className="flex-1 overflow-y-auto pb-48">
        <Gallery results={results} />
      </div>
      <BottomBar onAddResult={handleAddResult} onUpdateResult={handleUpdateResult} />
    </main>
  );
}

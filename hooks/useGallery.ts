"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { GenerationResult } from "@/lib/types";
import { loadGallery, saveGallery, incrementStat } from "@/lib/storage";
import { playSuccessSound, playErrorSound } from "@/lib/sounds";

export function useGallery() {
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const prevStatusRef = useRef<Map<string, string>>(new Map());

  // Load persisted results on mount
  useEffect(() => {
    const saved = loadGallery();
    if (saved.length > 0) {
      setResults(saved);
    }
    setMounted(true);
  }, []);

  // Persist whenever results change (but only completed/failed ones)
  useEffect(() => {
    if (!mounted) return;
    saveGallery(results);
  }, [results, mounted]);

  const addResult = useCallback((result: GenerationResult) => {
    setResults((prev) => [result, ...prev]);
    prevStatusRef.current.set(result.id, result.status);
  }, []);

  const updateResult = useCallback((id: string, updates: Partial<GenerationResult>) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );

    // Play sound on completion
    const prevStatus = prevStatusRef.current.get(id);
    if (updates.status && updates.status !== prevStatus) {
      if (updates.status === "completed") {
        playSuccessSound();
      } else if (updates.status === "failed") {
        playErrorSound();
      }
      prevStatusRef.current.set(id, updates.status);
    }

    // Track stats on completion
    if (updates.status === "completed") {
      // Find the result to get its type and credits
      setResults((prev) => {
        const item = prev.find((r) => r.id === id);
        if (item) {
          incrementStat(item.type, item.credits ?? 0);
        }
        return prev;
      });
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );
  }, []);

  const deleteResult = useCallback((id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setResults((prev) => prev.filter((r) => r.status === "pending" || r.status === "processing"));
  }, []);

  return {
    results,
    mounted,
    addResult,
    updateResult,
    toggleFavorite,
    deleteResult,
    clearAll,
  };
}

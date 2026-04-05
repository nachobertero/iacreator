"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { GenerationResult } from "@/lib/types";
import { loadGallery, saveGallery, incrementStat } from "@/lib/storage";
import { playSuccessSound, playErrorSound } from "@/lib/sounds";

export function useGallery() {
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const prevStatusRef = useRef<Map<string, string>>(new Map());
  // Cache latest results ref to read inside callbacks without stale closure
  const resultsRef = useRef<GenerationResult[]>([]);

  // Load persisted results on mount
  useEffect(() => {
    const saved = loadGallery();
    if (saved.length > 0) {
      setResults(saved);
      resultsRef.current = saved;
    }
    setMounted(true);
  }, []);

  // Persist whenever results change (only completed/failed)
  useEffect(() => {
    if (!mounted) return;
    saveGallery(results);
    resultsRef.current = results;
  }, [results, mounted]);

  const addResult = useCallback((result: GenerationResult) => {
    setResults((prev) => {
      const next = [result, ...prev];
      resultsRef.current = next;
      return next;
    });
    prevStatusRef.current.set(result.id, result.status);
  }, []);

  const updateResult = useCallback((id: string, updates: Partial<GenerationResult>) => {
    // Play sound when status transitions
    const prevStatus = prevStatusRef.current.get(id);
    if (updates.status && updates.status !== prevStatus) {
      if (updates.status === "completed") {
        playSuccessSound();
        // Track stat — read from ref (not from setState callback)
        const item = resultsRef.current.find((r) => r.id === id);
        if (item) incrementStat(item.type, item.credits ?? 0);
      } else if (updates.status === "failed") {
        playErrorSound();
      }
      prevStatusRef.current.set(id, updates.status);
    }

    setResults((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      resultsRef.current = next;
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setResults((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r));
      resultsRef.current = next;
      return next;
    });
  }, []);

  const deleteResult = useCallback((id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      resultsRef.current = next;
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setResults((prev) => {
      const next = prev.filter((r) => r.status === "pending" || r.status === "processing");
      resultsRef.current = next;
      return next;
    });
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

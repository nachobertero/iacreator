// ─── Persistent gallery storage (localStorage) ──────────────────
import type { GenerationResult, GenerationStats } from "./types";

const GALLERY_KEY = "aicreator_gallery";
const STATS_KEY = "aicreator_stats";
const MAX_STORED_RESULTS = 200; // limit to prevent localStorage bloat

// ── Gallery persistence ──────────────────────────────────────────

export function loadGallery(): GenerationResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GenerationResult[];
    // Only return completed or failed results (no stale pending ones)
    return parsed.filter((r) => r.status === "completed" || r.status === "failed");
  } catch {
    return [];
  }
}

export function saveGallery(results: GenerationResult[]): void {
  if (typeof window === "undefined") return;
  try {
    // Only save completed/failed, limit size, strip large data
    const toSave = results
      .filter((r) => r.status === "completed" || r.status === "failed")
      .slice(0, MAX_STORED_RESULTS)
      .map((r) => ({
        ...r,
        // Don't store statusText (transient)
        statusText: undefined,
      }));
    localStorage.setItem(GALLERY_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full — silently ignore
  }
}

export function toggleFavorite(id: string): boolean {
  const results = loadGallery();
  const item = results.find((r) => r.id === id);
  if (!item) return false;
  item.favorite = !item.favorite;
  saveGallery(results);
  return item.favorite;
}

export function deleteResult(id: string): void {
  const results = loadGallery();
  const filtered = results.filter((r) => r.id !== id);
  saveGallery(filtered);
}

export function clearGallery(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GALLERY_KEY);
}

// ── Stats persistence ────────────────────────────────────────────

export function loadStats(): GenerationStats {
  if (typeof window === "undefined") {
    return { totalImages: 0, totalVideos: 0, totalCreditsSpent: 0, favoriteCount: 0 };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { totalImages: 0, totalVideos: 0, totalCreditsSpent: 0, favoriteCount: 0 };
    return JSON.parse(raw) as GenerationStats;
  } catch {
    return { totalImages: 0, totalVideos: 0, totalCreditsSpent: 0, favoriteCount: 0 };
  }
}

export function saveStats(stats: GenerationStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // silently ignore
  }
}

export function incrementStat(type: "image" | "video", creditsUsed: number): void {
  const stats = loadStats();
  if (type === "image") stats.totalImages++;
  else stats.totalVideos++;
  stats.totalCreditsSpent += creditsUsed;
  saveStats(stats);
}

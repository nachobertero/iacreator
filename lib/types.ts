export type Mode = "image" | "video";

export type ResultStatus = "pending" | "processing" | "completed" | "failed";

export interface GenerationResult {
  id: string;
  type: Mode;
  url?: string;
  prompt: string;
  status: ResultStatus;
  statusText?: string;
  createdAt: number; // timestamp, not Date (avoids SSR hydration mismatch)
  modelName?: string;
  credits?: number;
  favorite?: boolean;
  duration?: number; // for videos: duration in seconds
  ratio?: string;    // aspect ratio used
}

// ── Gallery filter types ─────────────────────────────────────────
export type GalleryFilter = "all" | "images" | "videos" | "favorites";

// ── Prompt template types ────────────────────────────────────────
export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: PromptCategory;
  mode: Mode;
}

export type PromptCategory =
  | "cinematic"
  | "product"
  | "portrait"
  | "landscape"
  | "abstract"
  | "animation"
  | "commercial";

// ── Stats types ──────────────────────────────────────────────────
export interface GenerationStats {
  totalImages: number;
  totalVideos: number;
  totalCreditsSpent: number;
  favoriteCount: number;
}

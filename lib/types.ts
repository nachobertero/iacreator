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
}

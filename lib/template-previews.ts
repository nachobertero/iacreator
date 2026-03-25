// ─── Template preview cache (localStorage) ──────────────────────
// Stores generated preview URLs keyed by template ID.
// Uses cheapest text-to-image model (WAN 2.6 = ~3cr) to generate previews.

const CACHE_KEY = "aicreator_template_previews";

export type PreviewCache = Record<string, string>; // templateId → imageUrl

export function loadPreviewCache(): PreviewCache {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePreviewToCache(templateId: string, url: string): void {
  if (typeof window === "undefined") return;
  try {
    const cache = loadPreviewCache();
    cache[templateId] = url;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // silently ignore
  }
}

export function clearPreviewCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}

// ─── Generate a preview for a template ──────────────────────────
// Uses the API to generate a square preview image with a cheap model.
// Returns the image URL on success.
export async function generateTemplatePreview(
  prompt: string,
): Promise<string> {
  // Step 1: Submit job
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      model: "alibaba/wan-2.6/text-to-image", // cheapest at ~3cr, good quality
      aspect_ratio: "1:1", // square for thumbnails
    }),
  });

  if (!res.ok) throw new Error("Error al iniciar generacion");
  const data = await res.json();

  // If already completed (synchronous model)
  if (data.images?.length > 0) return data.images[0];

  // Step 2: Poll for result
  const taskId = data.taskId;
  if (!taskId) throw new Error("No taskId returned");

  for (let i = 0; i < 60; i++) {
    await delay(2000);
    const pollRes = await fetch(`/api/status/${taskId}`);
    if (!pollRes.ok) continue;
    const status = await pollRes.json();

    if (status.status === "completed" && status.outputs?.length > 0) {
      return status.outputs[0];
    }
    if (status.status === "failed") {
      throw new Error(status.error || "Generacion fallida");
    }
  }

  throw new Error("Tiempo de espera agotado");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

"use client";

// ─── Auto-generates previews for all templates in background ────
// Runs on app startup, generates 2 at a time, caches results.
// Total cost: ~3cr × 19 templates = ~57cr (only on very first load).

import { useState, useEffect, useRef } from "react";
import { PROMPT_TEMPLATES } from "@/lib/prompts";
import {
  loadPreviewCache,
  savePreviewToCache,
  generateTemplatePreview,
  type PreviewCache,
} from "@/lib/template-previews";

const CONCURRENCY = 2; // generate 2 at a time

export function usePreviewGeneration() {
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  const [pendingCount, setPendingCount] = useState(0); // how many still generating
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const cache = loadPreviewCache();
    setPreviewCache(cache);

    // Find templates that don't have a preview yet
    const missing = PROMPT_TEMPLATES.filter((t) => !cache[t.id]);
    if (missing.length === 0) return;

    setPendingCount(missing.length);

    // Generate in batches of CONCURRENCY
    let queue = [...missing];
    let active = 0;

    const runNext = () => {
      while (active < CONCURRENCY && queue.length > 0) {
        const template = queue.shift()!;
        active++;

        generateTemplatePreview(template.prompt)
          .then((url) => {
            savePreviewToCache(template.id, url);
            setPreviewCache((prev) => ({ ...prev, [template.id]: url }));
          })
          .catch(() => {
            // silently skip failed previews — they'll show placeholder
          })
          .finally(() => {
            active--;
            setPendingCount((prev) => Math.max(0, prev - 1));
            runNext();
          });
      }
    };

    runNext();
  }, []);

  return { previewCache, pendingCount };
}

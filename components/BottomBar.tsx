"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ImageIcon, Film, Sparkles, Loader2,
  Upload, X, ChevronDown, Zap, Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCredits } from "@/hooks/useCredits";
import {
  IMAGE_MODELS, VIDEO_MODELS,
  DEFAULT_IMAGE_MODEL, DEFAULT_VIDEO_MODEL,
  type ModelDef,
} from "@/lib/models";
import type { Mode, GenerationResult } from "@/lib/types";

const IMAGE_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:2", "2:3"];

interface BottomBarProps {
  onAddResult: (result: GenerationResult) => void;
  onUpdateResult: (id: string, updates: Partial<GenerationResult>) => void;
}

export default function BottomBar({ onAddResult, onUpdateResult }: BottomBarProps) {
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState("");
  const [refImage, setRefImage] = useState<string | null>(null);
  const [endFrameImage, setEndFrameImage] = useState<string | null>(null);
  const [activeGenerations, setActiveGenerations] = useState(0);
  const loading = activeGenerations > 0;
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);

  const [imageModel, setImageModel] = useState<ModelDef>(DEFAULT_IMAGE_MODEL);
  const [imageRatio, setImageRatio] = useState("1:1");

  const [videoModel, setVideoModel] = useState<ModelDef>(DEFAULT_VIDEO_MODEL);
  const [videoRatio, setVideoRatio] = useState(
    DEFAULT_VIDEO_MODEL.constraints?.ratioDefault ?? "16:9"
  );
  const [videoDuration, setVideoDuration] = useState(
    DEFAULT_VIDEO_MODEL.constraints?.durationDefault ?? 5
  );

  const { credits, deduct, refund } = useCredits();
  const fileRef = useRef<HTMLInputElement>(null);
  const endFrameFileRef = useRef<HTMLInputElement>(null);

  const currentModel = mode === "image" ? imageModel : videoModel;
  const currentCredits = currentModel.credits;
  const canAfford = credits >= currentCredits;

  // ── Auto-correct ratio & duration when video model changes ────────
  useEffect(() => {
    const c = videoModel.constraints;
    if (!c) return;

    if (c.ratioParam !== "none" && c.ratios.length > 0) {
      const validLabels = c.ratios.map((r) => r.label);
      if (!validLabels.includes(videoRatio)) {
        setVideoRatio(c.ratioDefault);
      }
    }

    if (c.durationMode === "discrete" && c.durationOptions) {
      if (!c.durationOptions.includes(videoDuration)) {
        setVideoDuration(c.durationDefault);
      }
    } else if (c.durationMode === "range" && c.durationRange) {
      const { min, max } = c.durationRange;
      const clamped = Math.min(max, Math.max(min, videoDuration));
      if (clamped !== videoDuration) setVideoDuration(clamped);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoModel]);

  // ── File handling ─────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setRefImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // ── Drag & drop ───────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) setDraggingFile(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDraggingFile(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingFile(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Resolve ratio API value from label ────────────────────────
  const getVideoRatioApiValue = useCallback((): string => {
    const c = videoModel.constraints;
    if (!c || c.ratioParam === "none") return "";
    const opt = c.ratios.find((r) => r.label === videoRatio);
    return opt?.apiValue ?? videoRatio;
  }, [videoModel, videoRatio]);

  // ── Poll helper ───────────────────────────────────────────────
  const pollUntilDone = useCallback(
    (taskId: string, resultId: string, intervalMs = 1000): Promise<string[]> =>
      new Promise((resolve, reject) => {
        let elapsed = 0;
        const statusMessages = [
          "En cola...",
          "Procesando con IA...",
          "Renderizando...",
          "Casi listo...",
        ];
        const iv = setInterval(async () => {
          try {
            const res = await fetch(`/api/status/${taskId}`);
            const data = await res.json();
            elapsed += intervalMs;
            const tick = Math.floor(elapsed / 3000);
            const msg = statusMessages[Math.min(tick, statusMessages.length - 1)];

            if (data.status === "completed" && data.outputs?.length > 0) {
              clearInterval(iv);
              resolve(data.outputs);
            } else if (data.status === "failed") {
              clearInterval(iv);
              reject(new Error(data.error || "Generacion fallida en Wavespeed"));
            } else {
              onUpdateResult(resultId, {
                statusText: `${msg} (${Math.round(elapsed / 1000)}s)`,
              });
            }
          } catch (e) {
            clearInterval(iv);
            reject(e);
          }
        }, intervalMs);
      }),
    [onUpdateResult]
  );

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    if (!canAfford) {
      setError(`Necesitas ${currentCredits} creditos. Tienes ${credits}.`);
      return;
    }

    const deducted = await deduct(currentCredits);
    if (!deducted) {
      setError("No tienes suficientes creditos.");
      return;
    }

    setActiveGenerations((n) => n + 1);
    setError(null);

    const resultId = `${mode}-${Date.now()}`;

    onAddResult({
      id: resultId,
      type: mode,
      prompt,
      status: "pending",
      statusText: "Iniciando...",
      createdAt: Date.now(),
    });

    try {
      if (mode === "image") {
        onUpdateResult(resultId, { status: "processing", statusText: "Enviando solicitud..." });

        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            image: refImage || undefined,
            model: imageModel.id,
            aspect_ratio: imageRatio,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        let urls: string[] = data.images || [];
        if (!urls.length && data.taskId) {
          urls = await pollUntilDone(data.taskId, resultId, 1000);
        }

        onUpdateResult(resultId, { status: "completed", url: urls[0], statusText: undefined });
      } else {
        onUpdateResult(resultId, { status: "processing", statusText: "Enviando a Wavespeed..." });

        const c = videoModel.constraints;
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            image: refImage || undefined,
            model: videoModel.id,
            duration: videoDuration,
            ratioParam: c?.ratioParam ?? "aspect_ratio",
            ratioValue: getVideoRatioApiValue(),
            inputType: c?.inputType ?? "image",
            // Start/End frame params
            endFrame: endFrameImage || undefined,
            endFrameParam: c?.endFrameParam || undefined,
            startFrameParam: c?.startFrameParam || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const urls = await pollUntilDone(data.taskId, resultId, 2000);
        onUpdateResult(resultId, { status: "completed", url: urls[0], statusText: undefined });
      }

      setPrompt("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      onUpdateResult(resultId, { status: "failed", statusText: msg });
      refund(currentCredits);
    } finally {
      setActiveGenerations((n) => Math.max(0, n - 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  // ── Derived constraint helpers ─────────────────────────────────
  const vc = videoModel.constraints;
  const showRatio = mode === "image" || (vc && vc.ratioParam !== "none" && vc.ratios.length > 0);
  const showDuration = mode === "video" && vc && vc.durationMode !== "none";
  const isTextOnlyModel = mode === "video" && vc?.inputType === "text";
  const supportsEndFrame = mode === "video" && vc?.supportsEndFrame === true;

  const ratioLabel = mode === "image" ? imageRatio : videoRatio;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-5 pb-4 sm:pb-5 pt-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Gradient fade at the top */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-[#060608] to-transparent pointer-events-none" />

      {/* Drag overlay */}
      {draggingFile && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-violet-500/50 bg-violet-500/[0.06] backdrop-blur-sm flex items-center justify-center pointer-events-none z-10">
          <div className="flex flex-col items-center gap-2.5 text-violet-300">
            <Upload className="w-7 h-7" />
            <span className="text-sm font-medium">Suelta como referencia</span>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="max-w-3xl mx-auto mb-3 bg-red-950/50 border border-red-500/15 rounded-xl px-4 py-3 flex items-center justify-between backdrop-blur-sm animate-slide-up">
          <span className="text-sm text-red-400">{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4 text-red-400/40 hover:text-red-400 transition-colors" />
          </button>
        </div>
      )}

      {/* Main row */}
      <div className="max-w-3xl mx-auto flex items-end gap-3">

        {/* ── Mode switcher ── */}
        <div className="flex flex-col gap-1.5 pb-0.5">
          <button
            onClick={() => { setMode("image"); setShowSettings(false); }}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border",
              mode === "image"
                ? "bg-violet-600/20 border-violet-500/30 text-violet-300 shadow-lg shadow-violet-500/10"
                : "border-white/[0.06] bg-white/[0.03] text-white/30 hover:text-white/55 hover:bg-white/[0.05]"
            )}
            title="Imagen"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setMode("video"); setShowSettings(false); }}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border",
              mode === "video"
                ? "bg-violet-600/20 border-violet-500/30 text-violet-300 shadow-lg shadow-violet-500/10"
                : "border-white/[0.06] bg-white/[0.03] text-white/30 hover:text-white/55 hover:bg-white/[0.05]"
            )}
            title="Video"
          >
            <Film className="w-5 h-5" />
          </button>
        </div>

        {/* ── Prompt card ── */}
        <div className="flex-1 glass border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Settings panel */}
          {showSettings && (
            <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] space-y-4 animate-fade-in">

              {/* Model list */}
              <div className="space-y-2.5">
                <p className="text-xs text-white/35 uppercase tracking-widest font-semibold">Modelo</p>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-0.5">
                  {(mode === "image" ? IMAGE_MODELS : VIDEO_MODELS).map((m) => {
                    const isActive = (mode === "image" ? imageModel : videoModel).id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => mode === "image" ? setImageModel(m) : setVideoModel(m)}
                        className={cn(
                          "flex items-start justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 border",
                          isActive
                            ? "border-violet-500/40 bg-violet-500/10 text-white"
                            : "border-white/[0.05] bg-white/[0.02] text-white/55 hover:border-white/[0.12] hover:text-white/80 hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-sm block truncate">{m.name}</span>
                          <span className="text-xs text-white/30 block mt-0.5">{m.description}</span>
                          {m.badge && (
                            <span className="text-xs text-violet-400/60 mt-0.5 block">{m.badge}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                          <Zap className="w-3 h-3 text-yellow-400/70" />
                          <span className={cn("text-xs font-bold", isActive ? "text-yellow-400" : "text-yellow-400/50")}>
                            {m.credits}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ratio + Duration */}
              <div className="flex gap-6 flex-wrap">

                {/* Ratio buttons */}
                {showRatio && (
                  <div className="space-y-2.5">
                    <p className="text-xs text-white/35 uppercase tracking-widest font-semibold">Proporcion</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(mode === "image"
                        ? IMAGE_RATIOS
                        : vc!.ratios.map((r) => r.label)
                      ).map((r) => (
                        <button
                          key={r}
                          onClick={() => mode === "image" ? setImageRatio(r) : setVideoRatio(r)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                            ratioLabel === r
                              ? "border-violet-500/40 bg-violet-500/10 text-white"
                              : "border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/65"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration controls */}
                {showDuration && (
                  <div className="space-y-2.5">
                    <p className="text-xs text-white/35 uppercase tracking-widest font-semibold">
                      Duracion
                      {vc!.durationMode === "range" && vc!.durationRange && (
                        <span className="text-white/15 ml-1 normal-case">
                          ({vc!.durationRange.min}-{vc!.durationRange.max}s)
                        </span>
                      )}
                    </p>

                    {vc!.durationMode === "discrete" ? (
                      <div className="flex gap-1.5 flex-wrap">
                        {vc!.durationOptions!.map((d) => (
                          <button
                            key={d}
                            onClick={() => setVideoDuration(d)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                              videoDuration === d
                                ? "border-violet-500/40 bg-violet-500/10 text-white"
                                : "border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/65"
                            )}
                          >
                            {d}s
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 pt-0.5">
                        <input
                          type="range"
                          min={vc!.durationRange!.min}
                          max={vc!.durationRange!.max}
                          step={1}
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(Number(e.target.value))}
                          className="w-32 cursor-pointer"
                        />
                        <span className="text-base font-bold text-white/60 w-8 text-right tabular-nums">
                          {videoDuration}s
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main input area */}
          <div className="px-5 pt-3.5 pb-3 space-y-2.5">

            {/* Ref image / Start+End frame indicators */}
            {(refImage || endFrameImage) && (
              <div className="flex items-center gap-3.5 animate-fade-in">
                {refImage && (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={refImage} alt="start" className="w-8 h-8 rounded-lg object-cover border border-violet-500/25" />
                    <span className="text-xs text-violet-400/70 font-medium">
                      {supportsEndFrame ? "Start" : "Ref"}
                    </span>
                    <button onClick={() => setRefImage(null)}>
                      <X className="w-3.5 h-3.5 text-white/25 hover:text-white/55 transition-colors" />
                    </button>
                  </div>
                )}
                {endFrameImage && (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={endFrameImage} alt="end" className="w-8 h-8 rounded-lg object-cover border border-fuchsia-500/25" />
                    <span className="text-xs text-fuchsia-400/70 font-medium">End</span>
                    <button onClick={() => setEndFrameImage(null)}>
                      <X className="w-3.5 h-3.5 text-white/25 hover:text-white/55 transition-colors" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "image"
                  ? "Describe la imagen que quieres crear..."
                  : "Describe la escena, movimiento, camara..."
              }
              rows={1}
              suppressHydrationWarning
              className="w-full bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none text-base leading-relaxed"
              style={{ minHeight: "28px", maxHeight: "120px" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
            />

            {/* Chips row */}
            <div className="flex items-center gap-2.5">
              {/* Ref / Start frame upload */}
              {!isTextOnlyModel && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 text-white/25 hover:text-white/50 text-sm transition-colors duration-200"
                    title={supportsEndFrame ? "Start frame" : "Subir referencia (o arrastrar)"}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{supportsEndFrame ? "Start" : "Referencia"}</span>
                  </button>
                  {/* End frame upload — only for models that support it */}
                  {supportsEndFrame && (
                    <button
                      onClick={() => endFrameFileRef.current?.click()}
                      className="flex items-center gap-1.5 text-fuchsia-400/35 hover:text-fuchsia-400/65 text-sm transition-colors duration-200"
                      title="End frame"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">End</span>
                    </button>
                  )}
                  <span className="text-white/[0.08]">|</span>
                </>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "flex items-center gap-1.5 text-sm transition-colors duration-200",
                  showSettings ? "text-violet-400" : "text-white/25 hover:text-white/50"
                )}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="font-medium">{currentModel.name}</span>

                {showRatio && (
                  <>
                    <span className="text-white/12">|</span>
                    <span>{ratioLabel}</span>
                  </>
                )}

                {mode === "video" && showDuration && (
                  <>
                    <span className="text-white/12">|</span>
                    <span>{videoDuration}s</span>
                  </>
                )}

                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showSettings && "rotate-180")} />
              </button>

              <span className="ml-auto text-xs text-white/15 hidden sm:block font-mono">Cmd+Return</span>
            </div>
          </div>
        </div>

        {/* ── Generate button ── */}
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || !canAfford}
          className={cn(
            "h-[88px] w-[88px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 font-semibold shrink-0 border",
            !prompt.trim() || !canAfford
              ? !canAfford && prompt.trim()
                ? "bg-red-950/20 border-red-500/15 text-red-500/50 cursor-not-allowed"
                : "bg-white/[0.02] border-white/[0.06] text-white/15 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 border-violet-500/30 text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-500/30 active:scale-[0.96]"
          )}
          title="Cmd + Enter"
        >
          {loading ? (
            <>
              <div className="relative">
                <Loader2 className="w-6 h-6 animate-spin" />
                {activeGenerations > 1 && (
                  <span className="absolute -top-1 -right-2 text-[10px] font-bold bg-fuchsia-500 rounded-full w-4 h-4 flex items-center justify-center">
                    {activeGenerations}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium opacity-70">Generando</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-300/70" />
                <span className="text-base font-bold">{currentCredits}</span>
              </div>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={endFrameFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const reader = new FileReader();
            reader.onload = () => setEndFrameImage(reader.result as string);
            reader.readAsDataURL(f);
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}

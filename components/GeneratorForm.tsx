"use client";

import { useState, useCallback } from "react";
import { Sparkles, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import VideoResult from "./VideoResult";

type Status = "idle" | "submitting" | "processing" | "done" | "error";

const MODELS = [
  {
    id: "alibaba/wan-2.6/reference-to-video",
    name: "WAN 2.6 Reference",
    desc: "Consistencia de personaje · Recomendado",
    badge: "⭐ Best",
  },
  {
    id: "alibaba/wan-2.6/image-to-video",
    name: "WAN 2.6 Image-to-Video",
    desc: "Alta calidad general",
    badge: null,
  },
  {
    id: "bytedance/seedance-v1.5-pro/image-to-video",
    name: "Seedance 1.5 Pro",
    desc: "Rápido y barato",
    badge: "💰 Económico",
  },
  {
    id: "kwaivgi/kling-video-o3-std/image-to-video",
    name: "Kling O3 Standard",
    desc: "Muy buena calidad",
    badge: null,
  },
];

const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:3"];
const DURATIONS = [3, 5, 8, 10];

const PROMPT_EXAMPLES = [
  "Walking confidently through a neon-lit Tokyo street at night, cinematic",
  "Dancing in a sunflower field, golden hour, slow motion",
  "Sitting in a cafe reading a book, rain outside, cozy atmosphere",
  "Running on a beach at sunset, waves crashing, cinematic shot",
];

export default function GeneratorForm() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [model, setModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [status, setStatus] = useState<Status>("idle");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const pollStatus = useCallback(async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${id}`);
        const data = await res.json();

        if (data.status === "completed" && data.outputs?.length > 0) {
          clearInterval(interval);
          setVideoUrl(data.outputs[0]);
          setStatus("done");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setErrorMsg(data.error || "La generación falló");
          setStatus("error");
        } else {
          setProgress((p) => Math.min(p + 5, 90));
        }
      } catch {
        clearInterval(interval);
        setErrorMsg("Error al verificar el estado");
        setStatus("error");
      }
    }, 3000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus("submitting");
    setErrorMsg(null);
    setProgress(0);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image, model, duration, aspect_ratio: aspectRatio }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al enviar");

      setTaskId(data.taskId);
      setStatus("processing");
      setProgress(10);
      pollStatus(data.taskId);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setVideoUrl(null);
    setTaskId(null);
    setErrorMsg(null);
    setProgress(0);
  };

  if (status === "done" && videoUrl) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">¡Video generado! 🎉</h2>
          <p className="text-white/50 text-sm mt-1">Tu video está listo</p>
        </div>
        <VideoResult url={videoUrl} onReset={handleReset} />
      </div>
    );
  }

  const isLoading = status === "submitting" || status === "processing";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <ImageUpload onImageChange={setImage} value={image} />

      {/* Prompt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">
          Descripción del video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe qué debe hacer el personaje en el video..."
          rows={3}
          disabled={isLoading}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 resize-none focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
        />
        {/* Example prompts */}
        <div className="flex flex-wrap gap-2">
          {PROMPT_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-violet-400/70 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2 py-1 rounded-lg transition-colors truncate max-w-[200px]"
            >
              {ex.slice(0, 35)}…
            </button>
          ))}
        </div>
      </div>

      {/* Advanced settings toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
        Configuración avanzada
      </button>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          {/* Model selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Modelo</label>
            <div className="grid grid-cols-1 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all text-sm",
                    model === m.id
                      ? "border-violet-500 bg-violet-500/20 text-white"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                  )}
                >
                  <span>
                    <span className="font-medium">{m.name}</span>
                    <span className="block text-xs opacity-60">{m.desc}</span>
                  </span>
                  {m.badge && (
                    <span className="text-xs bg-violet-500/30 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {m.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Proporción</label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                    aspectRatio === r
                      ? "border-violet-500 bg-violet-500/20 text-white"
                      : "border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Duración: {duration}s
            </label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                    duration === d
                      ? "border-violet-500 bg-violet-500/20 text-white"
                      : "border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          ⚠️ {errorMsg}
          <button
            type="button"
            onClick={handleReset}
            className="ml-2 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Progress */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-white/50">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              {status === "submitting" ? "Enviando a Wavespeed..." : "Generando tu video..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/30 text-center">
            Los videos tardan entre 30 segundos y 3 minutos dependiendo del modelo
          </p>
        </div>
      )}

      {/* Submit */}
      {!isLoading && status !== "done" && (
        <button
          type="submit"
          disabled={!prompt.trim()}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-base",
            prompt.trim()
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              : "bg-white/10 cursor-not-allowed opacity-50"
          )}
        >
          <Sparkles className="w-5 h-5" />
          Generar video
        </button>
      )}
    </form>
  );
}

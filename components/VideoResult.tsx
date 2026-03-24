"use client";

import { Download, RefreshCw } from "lucide-react";

interface VideoResultProps {
  url: string;
  onReset: () => void;
}

export default function VideoResult({ url, onReset }: VideoResultProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-creator-${Date.now()}.mp4`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-violet-500/30 bg-black">
        <video
          src={url}
          controls
          autoPlay
          loop
          muted
          className="w-full aspect-video object-contain"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar video
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Nuevo
        </button>
      </div>
    </div>
  );
}

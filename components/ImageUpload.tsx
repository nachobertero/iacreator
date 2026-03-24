"use client";

import { useRef, useState } from "react";
import { Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageChange: (base64: string | null) => void;
  value: string | null;
}

export default function ImageUpload({ onImageChange, value }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/70">
        Referencia de personaje
        <span className="ml-2 text-xs text-violet-400">(opcional)</span>
      </label>

      {value ? (
        <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border border-violet-500/40 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Character reference"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onImageChange(null)}
              className="bg-red-500/80 hover:bg-red-500 p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-violet-500/80 text-white text-xs px-2 py-0.5 rounded-full">
            ✓ Personaje cargado
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all flex flex-col items-center gap-3",
            dragging
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/20 hover:border-violet-500/50 hover:bg-white/5"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-6 h-6 text-white/40" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white/60">
              <span className="text-violet-400">Sube una foto</span> o arrastra aquí
            </p>
            <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP</p>
          </div>
          <Upload className="w-4 h-4 text-white/20" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

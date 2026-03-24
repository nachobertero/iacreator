// ─── Credit costs ──────────────────────────────────────────────────
// Images: credits = ceil(wavespeedCost × 12.5)  → ~25% margin
// Videos: credits = ceil(wavespeedCost × 15)    → ~33% margin, min 3cr
// wavespeedCost = real Wavespeed API price (USD) at 720p, default duration, no audio

export interface RatioOption {
  label: string;    // shown in UI: "16:9", "9:16 HD"
  apiValue: string; // sent to API: "16:9" or "1280x720"
}

export interface ModelConstraints {
  durationMode: "range" | "discrete" | "none";
  durationRange?: { min: number; max: number };
  durationOptions?: number[];
  durationDefault: number;

  ratioParam: "aspect_ratio" | "size" | "none";
  ratios: RatioOption[];
  ratioDefault: string;

  inputType: "image" | "videos" | "reference_urls" | "text";

  // Start/End frame support
  supportsEndFrame?: boolean;
  endFrameParam?: string;       // "end_image" (Kling) or "last_image" (WAN/Seedance/Veo)
  startFrameParam?: string;     // "first_image" for WAN FLF2V, omit for "image"
}

export interface ModelDef {
  id: string;
  name: string;
  provider: string;
  credits: number;
  wavespeedCost: number;
  badge?: string;
  description?: string;
  supportsRef?: boolean;
  supportsEdit?: boolean;
  constraints?: ModelConstraints;
}

// ─── Shared ratio presets ──────────────────────────────────────────
const SEEDANCE_RATIOS: RatioOption[] = [
  { label: "16:9",  apiValue: "16:9" },
  { label: "9:16",  apiValue: "9:16" },
  { label: "1:1",   apiValue: "1:1" },
  { label: "4:3",   apiValue: "4:3" },
  { label: "3:4",   apiValue: "3:4" },
  { label: "21:9",  apiValue: "21:9" },
];

const STANDARD_RATIOS: RatioOption[] = [
  { label: "16:9", apiValue: "16:9" },
  { label: "9:16", apiValue: "9:16" },
  { label: "4:3",  apiValue: "4:3" },
  { label: "1:1",  apiValue: "1:1" },
  { label: "3:4",  apiValue: "3:4" },
];

const WAN_SIZE_RATIOS: RatioOption[] = [
  { label: "16:9",     apiValue: "1280x720" },
  { label: "9:16",     apiValue: "720x1280" },
  { label: "16:9 HD",  apiValue: "1920x1080" },
  { label: "9:16 HD",  apiValue: "1080x1920" },
];

const WAN_FLF_SIZE_RATIOS: RatioOption[] = [
  { label: "16:9",     apiValue: "1280x720" },
  { label: "9:16",     apiValue: "720x1280" },
  { label: "16:9 SD",  apiValue: "832x480" },
  { label: "9:16 SD",  apiValue: "480x832" },
];

const VEO_RATIOS: RatioOption[] = [
  { label: "16:9", apiValue: "16:9" },
  { label: "9:16", apiValue: "9:16" },
];

// ─── IMAGE MODELS ─────────────────────────────────────────────────
// Formula: credits = ceil(wavespeedCost × 12.5)
export const IMAGE_MODELS: ModelDef[] = [
  {
    id: "google/nano-banana-2/text-to-image",
    name: "Nano Banana 2",
    provider: "Google",
    credits: 1,
    wavespeedCost: 0.05,
    badge: "Economico",
    description: "Rapido y economico",
  },
  {
    id: "google/nano-banana-pro/text-to-image",
    name: "Nano Banana Pro",
    provider: "Google",
    credits: 2,
    wavespeedCost: 0.105,
    description: "Alta calidad Google",
  },
  {
    id: "openai/gpt-image-1.5/text-to-image",
    name: "GPT Image 1.5",
    provider: "OpenAI",
    credits: 3,
    wavespeedCost: 0.20,
    badge: "OpenAI",
    description: "Entiende prompts complejos",
  },
  {
    id: "bytedance/dreamina-v3.0/text-to-image",
    name: "Dreamina v3",
    provider: "ByteDance",
    credits: 4,
    wavespeedCost: 0.27,
    badge: "Popular",
    description: "Gran relacion calidad/precio",
  },
  {
    id: "bytedance/seedream-v3.1",
    name: "Seedream v3.1",
    provider: "ByteDance",
    credits: 4,
    wavespeedCost: 0.27,
    description: "Fotorrealista, detallado",
  },
  {
    id: "kwaivgi/kling-image-o3/text-to-image",
    name: "Kling Image O3",
    provider: "Kling",
    credits: 4,
    wavespeedCost: 0.28,
    description: "Coherencia visual",
  },
  {
    id: "alibaba/wan-2.6/text-to-image",
    name: "WAN 2.6",
    provider: "Alibaba",
    credits: 4,
    wavespeedCost: 0.30,
    description: "Consistencia de estilo",
  },
  {
    id: "bytedance/seedream-v5.0-lite",
    name: "Seedream v5 Lite",
    provider: "ByteDance",
    credits: 5,
    wavespeedCost: 0.35,
    badge: "Nuevo",
    description: "Ultima version Seedream",
  },
  {
    id: "bytedance/seedream-v4.5",
    name: "Seedream v4.5",
    provider: "ByteDance",
    credits: 5,
    wavespeedCost: 0.40,
    description: "Alta resolucion, nitido",
  },
  {
    id: "openai/dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    credits: 5,
    wavespeedCost: 0.40,
    badge: "OpenAI",
    description: "Interpretacion creativa",
  },
];

// ─── VIDEO MODELS ─────────────────────────────────────────────────
// Formula: credits = ceil(wavespeedCost × 15), min 3
// Prices: 720p, default duration, no audio
export const VIDEO_MODELS: ModelDef[] = [
  // ── Tier 1: Economicos (3-5 cr) ──
  {
    id: "bytedance/seedance-v1.5-pro/image-to-video-fast",
    name: "Seedance 1.5 Fast",
    provider: "ByteDance",
    credits: 3,               // $0.10 × 15 = 1.5 → min 3
    wavespeedCost: 0.10,
    badge: "Economico",
    description: "Modo rapido, buena calidad",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 4, max: 12 },
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: SEEDANCE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "last_image",
    },
  },
  {
    id: "alibaba/wan-2.6/image-to-video-flash",
    name: "WAN 2.6 Flash",
    provider: "Alibaba",
    credits: 3,               // $0.125 × 15 = 1.875 → min 3
    wavespeedCost: 0.125,
    badge: "Flash",
    description: "Imagen a video, muy rapido",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 2, max: 15 },
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "bytedance/seedance-v1.5-pro/image-to-video",
    name: "Seedance 1.5 Pro",
    provider: "ByteDance",
    credits: 3,               // $0.13 × 15 = 1.95 → min 3
    wavespeedCost: 0.13,
    badge: "Popular",
    description: "Movimiento natural, gran calidad",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 4, max: 12 },
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: SEEDANCE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "last_image",
    },
  },
  {
    id: "alibaba/wan-2.6/reference-to-video-flash",
    name: "WAN 2.6 Ref Flash",
    provider: "Alibaba",
    credits: 4,               // $0.25 × 15 = 3.75 → 4
    wavespeedCost: 0.25,
    badge: "Personaje",
    description: "Consistencia de personaje, rapido",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10],
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "reference_urls",
    },
  },
  {
    id: "bytedance/dreamina-v3.0/image-to-video-720p",
    name: "Dreamina v3 720p",
    provider: "ByteDance",
    credits: 5,               // $0.30 × 15 = 4.5 → 5
    wavespeedCost: 0.30,
    description: "720p cinematografico",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [3, 5, 8, 10],
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: STANDARD_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  // ── Tier 2: Intermedio (6-9 cr) ──
  {
    id: "wavespeed-ai/wan-flf2v",
    name: "WAN Start+End Frame",
    provider: "WaveSpeed",
    credits: 6,               // $0.40 × 15 = 6.0 → 6
    wavespeedCost: 0.40,
    badge: "Start+End",
    description: "Define primer y ultimo frame",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10],
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_FLF_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "last_image",
      startFrameParam: "first_image",
    },
  },
  {
    id: "kwaivgi/kling-v3.0-std/image-to-video",
    name: "Kling 3.0 Standard",
    provider: "Kling",
    credits: 7,               // $0.42 × 15 = 6.3 → 7
    wavespeedCost: 0.42,
    badge: "Nuevo",
    description: "Ultima version Kling, excelente calidad",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 3, max: 15 },
      durationDefault: 5,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "end_image",
    },
  },
  {
    id: "kwaivgi/kling-video-o3-std/image-to-video",
    name: "Kling O3 Standard",
    provider: "Kling",
    credits: 7,               // $0.42 × 15 = 6.3 → 7
    wavespeedCost: 0.42,
    description: "Buena calidad general",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 3, max: 15 },
      durationDefault: 5,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "end_image",
    },
  },
  {
    id: "alibaba/wan-2.5/image-to-video",
    name: "WAN 2.5",
    provider: "Alibaba",
    credits: 8,               // $0.50 × 15 = 7.5 → 8
    wavespeedCost: 0.50,
    description: "Alta fidelidad al prompt",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 3, max: 10 },
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "alibaba/wan-2.6/image-to-video",
    name: "WAN 2.6",
    provider: "Alibaba",
    credits: 8,               // $0.50 × 15 = 7.5 → 8
    wavespeedCost: 0.50,
    description: "Calidad maxima WAN",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10, 15],
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "kwaivgi/kling-v3.0-pro/image-to-video",
    name: "Kling 3.0 Pro",
    provider: "Kling",
    credits: 9,               // $0.56 × 15 = 8.4 → 9
    wavespeedCost: 0.56,
    badge: "Premium",
    description: "Maxima calidad Kling, Start+End frame",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 3, max: 15 },
      durationDefault: 5,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "end_image",
    },
  },
  {
    id: "kwaivgi/kling-video-o3-pro/image-to-video",
    name: "Kling O3 Pro",
    provider: "Kling",
    credits: 9,               // $0.56 × 15 = 8.4 → 9
    wavespeedCost: 0.56,
    description: "Alta calidad Kling con Start+End",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10],
      durationDefault: 5,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "end_image",
    },
  },
  {
    id: "bytedance/dreamina-v3.0/image-to-video-1080p",
    name: "Dreamina v3 1080p",
    provider: "ByteDance",
    credits: 9,               // $0.60 × 15 = 9.0 → 9
    wavespeedCost: 0.60,
    badge: "1080p",
    description: "Full HD cinematografico",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [3, 5, 8, 10],
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: STANDARD_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  // ── Tier 3: Premium (10+ cr) ──
  {
    id: "wavespeed-ai/cinematic-video-generator",
    name: "Cinematic",
    provider: "WaveSpeed",
    credits: 12,              // $0.80 × 15 = 12.0 → 12
    wavespeedCost: 0.80,
    description: "Cinematico con audio nativo",
    supportsRef: false,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10, 15],
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: STANDARD_RATIOS,
      ratioDefault: "16:9",
      inputType: "text",
    },
  },
  {
    id: "openai/sora-2/image-to-video",
    name: "Sora 2",
    provider: "OpenAI",
    credits: 12,              // $0.80 (8s) × 15 = 12.0 → 12
    wavespeedCost: 0.80,
    badge: "OpenAI",
    description: "Fisica realista, audio nativo",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [4, 8, 12, 16, 20],
      durationDefault: 8,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
    },
  },
  {
    id: "alibaba/wan-2.6/reference-to-video",
    name: "WAN 2.6 Reference",
    provider: "Alibaba",
    credits: 15,              // $1.00 × 15 = 15.0 → 15
    wavespeedCost: 1.00,
    badge: "Personaje",
    description: "Consistencia de personaje maxima",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10],
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "videos",
    },
  },
  {
    id: "google/veo3.1/image-to-video",
    name: "Google Veo 3.1",
    provider: "Google",
    credits: 24,              // $1.60 (8s no audio) × 15 = 24.0 → 24
    wavespeedCost: 1.60,
    badge: "Nuevo",
    description: "Veo 3.1: alta calidad Google, Start+End",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [4, 6, 8],
      durationDefault: 8,
      ratioParam: "aspect_ratio",
      ratios: VEO_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
      supportsEndFrame: true,
      endFrameParam: "last_image",
    },
  },
  {
    id: "openai/sora-2-pro/image-to-video",
    name: "Sora 2 Pro",
    provider: "OpenAI",
    credits: 36,              // $2.40 (8s 720p) × 15 = 36.0 → 36
    wavespeedCost: 2.40,
    badge: "Top",
    description: "Maxima calidad disponible",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [4, 8, 12, 16, 20],
      durationDefault: 8,
      ratioParam: "none",
      ratios: [],
      ratioDefault: "",
      inputType: "image",
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
export const getImageModel = (id: string) => IMAGE_MODELS.find((m) => m.id === id);
export const getVideoModel = (id: string) => VIDEO_MODELS.find((m) => m.id === id);
export const getModel = (id: string) => getImageModel(id) || getVideoModel(id);

// Default models
export const DEFAULT_IMAGE_MODEL = IMAGE_MODELS[3]; // Dreamina v3
export const DEFAULT_VIDEO_MODEL = VIDEO_MODELS[2]; // Seedance 1.5 Pro

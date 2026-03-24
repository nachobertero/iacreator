// ─── Credit costs (1 credit = $0.10) ──────────────────────────────
// All costs are 2x Wavespeed price → ~50% margin
// Exception: expensive video models slightly reduced markup

export interface RatioOption {
  label: string;    // shown in UI: "16:9", "9:16 HD"
  apiValue: string; // sent to API: "16:9" or "1280x720"
}

export interface ModelConstraints {
  // Duration
  durationMode: "range" | "discrete" | "none";
  durationRange?: { min: number; max: number };
  durationOptions?: number[]; // for discrete
  durationDefault: number;

  // Ratio / size
  ratioParam: "aspect_ratio" | "size" | "none";
  ratios: RatioOption[];
  ratioDefault: string; // label of default ratio (e.g. "16:9")

  // Media input format expected by the API
  inputType: "image" | "videos" | "text";

  // Start/End frame support
  supportsEndFrame?: boolean;        // true if model accepts an end frame image
  endFrameParam?: string;            // API param name: "end_image" (Kling) or "last_image" (WAN/Vidu)
  startFrameParam?: string;          // API param name if != "image" (e.g. "first_image" for WAN FLF2V)
}

export interface ModelDef {
  id: string;
  name: string;
  provider: string;
  credits: number;      // cost in credits
  wavespeedCost: number; // actual USD cost (reference)
  badge?: string;
  description?: string;
  supportsRef?: boolean; // supports reference image input
  supportsEdit?: boolean;
  constraints?: ModelConstraints; // video models only
}

// ─── Shared ratio presets ──────────────────────────────────────────
const SEEDANCE_RATIOS: RatioOption[] = [
  { label: "21:9",  apiValue: "21:9" },
  { label: "16:9",  apiValue: "16:9" },
  { label: "4:3",   apiValue: "4:3" },
  { label: "1:1",   apiValue: "1:1" },
  { label: "3:4",   apiValue: "3:4" },
  { label: "9:16",  apiValue: "9:16" },
];

const STANDARD_RATIOS: RatioOption[] = [
  { label: "16:9", apiValue: "16:9" },
  { label: "9:16", apiValue: "9:16" },
  { label: "4:3",  apiValue: "4:3" },
  { label: "1:1",  apiValue: "1:1" },
  { label: "3:4",  apiValue: "3:4" },
];

// WAN models use pixel dimensions as the "size" parameter
const WAN_SIZE_RATIOS: RatioOption[] = [
  { label: "16:9",     apiValue: "1280x720" },
  { label: "9:16",     apiValue: "720x1280" },
  { label: "16:9 HD",  apiValue: "1920x1080" },
  { label: "9:16 HD",  apiValue: "1080x1920" },
];

// WAN FLF2V uses smaller sizes
const WAN_FLF_SIZE_RATIOS: RatioOption[] = [
  { label: "16:9",  apiValue: "1280x720" },
  { label: "9:16",  apiValue: "720x1280" },
  { label: "16:9 SD", apiValue: "832x480" },
  { label: "9:16 SD", apiValue: "480x832" },
];

// ─── IMAGE MODELS ─────────────────────────────────────────────────
// Formula: credits = ceil(wavespeedCost × 12.5) → ~25% margen uniforme
export const IMAGE_MODELS: ModelDef[] = [
  {
    id: "google/nano-banana-2/text-to-image",
    name: "Nano Banana 2",
    provider: "Google",
    credits: 1,           // $0.0525 × 12.5 = 0.66 → 1
    wavespeedCost: 0.0525,
    badge: "💰 Más barato",
    description: "Rápido y económico",
    supportsRef: false,
  },
  {
    id: "google/nano-banana-pro/text-to-image",
    name: "Nano Banana Pro",
    provider: "Google",
    credits: 2,           // $0.105 × 12.5 = 1.31 → 2
    wavespeedCost: 0.105,
    description: "Alta calidad Google",
    supportsRef: false,
  },
  {
    id: "openai/gpt-image-1.5/text-to-image",
    name: "GPT Image 1.5",
    provider: "OpenAI",
    credits: 3,           // $0.20 × 12.5 = 2.5 → 3
    wavespeedCost: 0.20,
    badge: "🤖 OpenAI",
    description: "Entiende prompts complejos",
    supportsRef: false,
  },
  {
    id: "bytedance/dreamina-v3.0/text-to-image",
    name: "Dreamina v3",
    provider: "ByteDance",
    credits: 4,           // $0.27 × 12.5 = 3.375 → 4
    wavespeedCost: 0.27,
    badge: "⭐ Popular",
    description: "Gran relación calidad/precio",
    supportsRef: false,
  },
  {
    id: "bytedance/seedream-v3.1",
    name: "Seedream v3.1",
    provider: "ByteDance",
    credits: 4,           // $0.27 × 12.5 = 3.375 → 4
    wavespeedCost: 0.27,
    description: "Fotorrealista, muy detallado",
    supportsRef: false,
  },
  {
    id: "kwaivgi/kling-image-o3/text-to-image",
    name: "Kling Image O3",
    provider: "Kling",
    credits: 4,           // $0.28 × 12.5 = 3.5 → 4
    wavespeedCost: 0.28,
    description: "Excelente coherencia visual",
    supportsRef: false,
  },
  {
    id: "alibaba/wan-2.6/text-to-image",
    name: "WAN 2.6",
    provider: "Alibaba",
    credits: 4,           // $0.30 × 12.5 = 3.75 → 4
    wavespeedCost: 0.30,
    description: "Consistencia de estilo",
    supportsRef: false,
  },
  {
    id: "bytedance/seedream-v5.0-lite",
    name: "Seedream v5 Lite",
    provider: "ByteDance",
    credits: 5,           // $0.35 × 12.5 = 4.375 → 5
    wavespeedCost: 0.35,
    badge: "✨ Nuevo",
    description: "La versión más reciente",
    supportsRef: false,
  },
  {
    id: "bytedance/seedream-v4.5",
    name: "Seedream v4.5",
    provider: "ByteDance",
    credits: 5,           // $0.40 × 12.5 = 5.0 → 5
    wavespeedCost: 0.40,
    description: "Alta resolución, muy nítido",
    supportsRef: false,
  },
  {
    id: "openai/dall-e-3",
    name: "DALL·E 3",
    provider: "OpenAI",
    credits: 5,           // $0.40 × 12.5 = 5.0 → 5
    wavespeedCost: 0.40,
    badge: "🤖 OpenAI",
    description: "Interpretación creativa",
    supportsRef: false,
  },
];

// ─── VIDEO MODELS ─────────────────────────────────────────────────
// Formula: credits = ceil(wavespeedCost × 12) → ~20% margen uniforme
export const VIDEO_MODELS: ModelDef[] = [
  {
    id: "wavespeed-ai/cinematic-video-generator",
    name: "Cinematic",
    provider: "WaveSpeed",
    credits: 10,          // $0.80 × 12 = 9.6 → 10
    wavespeedCost: 0.80,
    badge: "💰 Más barato",
    description: "Cinematic, rápido y económico",
    supportsRef: false,
    constraints: {
      durationMode: "range",
      durationRange: { min: 3, max: 10 },
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: STANDARD_RATIOS,
      ratioDefault: "16:9",
      inputType: "text",
    },
  },
  {
    id: "wavespeed-ai/wan-flf2v",
    name: "WAN First-Last Frame",
    provider: "WaveSpeed",
    credits: 12,          // ~$1.00 × 12 = 12
    wavespeedCost: 1.00,
    badge: "🎬 Start+End",
    description: "Define primer y ultimo frame",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 5, max: 10 },
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
    id: "alibaba/wan-2.6/reference-to-video-flash",
    name: "WAN 2.6 Ref Flash",
    provider: "Alibaba",
    credits: 15,          // $1.25 × 12 = 15.0 → 15
    wavespeedCost: 1.25,
    badge: "⚡ Flash",
    description: "Consistencia de personaje, velocidad",
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
    id: "alibaba/wan-2.6/image-to-video-flash",
    name: "WAN 2.6 Flash",
    provider: "Alibaba",
    credits: 15,          // $1.25 × 12 = 15.0 → 15
    wavespeedCost: 1.25,
    badge: "⚡ Flash",
    description: "Imagen a video, muy rápido",
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
    id: "wavespeed-ai/wan-2.2/image-to-video",
    name: "WAN 2.2",
    provider: "WaveSpeed",
    credits: 18,          // $1.50 × 12 = 18.0 → 18
    wavespeedCost: 1.50,
    description: "Fluido, buena calidad",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 2, max: 10 },
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: STANDARD_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "bytedance/seedance-v1.5-pro/image-to-video-fast",
    name: "Seedance 1.5 Fast",
    provider: "ByteDance",
    credits: 24,          // $2.00 × 12 = 24
    wavespeedCost: 2.00,
    badge: "⚡ Rápido",
    description: "Seedance en modo rápido",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 4, max: 12 },
      durationDefault: 5,
      ratioParam: "aspect_ratio",
      ratios: SEEDANCE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "alibaba/wan-2.5/image-to-video",
    name: "WAN 2.5",
    provider: "Alibaba",
    credits: 30,          // $2.50 × 12 = 30
    wavespeedCost: 2.50,
    description: "Alta fidelidad al prompt",
    supportsRef: true,
    constraints: {
      durationMode: "range",
      durationRange: { min: 2, max: 10 },
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
    credits: 32,          // $2.60 × 12 = 31.2 → 32
    wavespeedCost: 2.60,
    badge: "⭐ Popular",
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
    },
  },
  {
    id: "bytedance/dreamina-v3.0/image-to-video-720p",
    name: "Dreamina v3 720p",
    provider: "ByteDance",
    credits: 36,          // $3.00 × 12 = 36
    wavespeedCost: 3.00,
    description: "720p cinematográfico",
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
  {
    id: "openai/sora-2/image-to-video",
    name: "Sora 2",
    provider: "OpenAI",
    credits: 48,          // $4.00 × 12 = 48
    wavespeedCost: 4.00,
    badge: "🤖 OpenAI",
    description: "Física realista, alta coherencia",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [4, 8, 12],
      durationDefault: 8,
      ratioParam: "none", // Sora auto-detects from image
      ratios: [],
      ratioDefault: "",
      inputType: "image",
    },
  },
  {
    id: "kwaivgi/kling-video-o3-std/image-to-video",
    name: "Kling O3 Standard",
    provider: "Kling",
    credits: 51,          // $4.20 × 12 = 50.4 → 51
    wavespeedCost: 4.20,
    description: "Muy buena calidad general",
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
    id: "alibaba/wan-2.6/reference-to-video",
    name: "WAN 2.6 Reference",
    provider: "Alibaba",
    credits: 60,          // $5.00 × 12 = 60
    wavespeedCost: 5.00,
    badge: "🎭 Ref. Personaje",
    description: "Consistencia de personaje máxima",
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
    id: "alibaba/wan-2.6/image-to-video",
    name: "WAN 2.6",
    provider: "Alibaba",
    credits: 60,          // $5.00 × 12 = 60
    wavespeedCost: 5.00,
    description: "Calidad máxima WAN",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [5, 10],
      durationDefault: 5,
      ratioParam: "size",
      ratios: WAN_SIZE_RATIOS,
      ratioDefault: "16:9",
      inputType: "image",
    },
  },
  {
    id: "kwaivgi/kling-video-o3-pro/image-to-video",
    name: "Kling O3 Pro",
    provider: "Kling",
    credits: 68,          // $5.60 × 12 = 67.2 → 68
    wavespeedCost: 5.60,
    badge: "👑 Premium",
    description: "La mejor calidad Kling",
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
    id: "bytedance/dreamina-v3.0/image-to-video-1080p",
    name: "Dreamina v3 1080p",
    provider: "ByteDance",
    credits: 72,          // $6.00 × 12 = 72
    wavespeedCost: 6.00,
    badge: "🔥 1080p",
    description: "Full HD cinematográfico",
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
  {
    id: "openai/sora-2-pro/image-to-video",
    name: "Sora 2 Pro",
    provider: "OpenAI",
    credits: 144,         // $12.00 × 12 = 144
    wavespeedCost: 12.00,
    badge: "🏆 Top",
    description: "La mejor calidad disponible",
    supportsRef: true,
    constraints: {
      durationMode: "discrete",
      durationOptions: [4, 8, 12],
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
export const DEFAULT_VIDEO_MODEL = VIDEO_MODELS[7]; // Seedance 1.5 Pro

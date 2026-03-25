// ─── Curated prompt templates ────────────────────────────────────
import type { PromptTemplate, PromptCategory } from "./types";

export const PROMPT_CATEGORIES: { id: PromptCategory; label: string; emoji: string }[] = [
  { id: "cinematic", label: "Cinematico", emoji: "🎬" },
  { id: "product", label: "Producto", emoji: "📦" },
  { id: "portrait", label: "Retrato", emoji: "🧑" },
  { id: "landscape", label: "Paisaje", emoji: "🏔" },
  { id: "abstract", label: "Abstracto", emoji: "🎨" },
  { id: "animation", label: "Animacion", emoji: "✨" },
  { id: "commercial", label: "Comercial", emoji: "📺" },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // ── Cinematic ──
  {
    id: "cin-1",
    title: "Drone sobre ciudad",
    prompt: "Cinematic aerial drone shot flying over a futuristic neon-lit city at night, volumetric fog, reflections on wet streets, slow camera movement, 4K film grain",
    category: "cinematic",
    mode: "video",
  },
  {
    id: "cin-2",
    title: "Camara lenta epica",
    prompt: "Epic slow motion shot of a warrior walking through rain, cinematic lighting from behind, water droplets suspended in air, dramatic atmosphere, anamorphic lens flare",
    category: "cinematic",
    mode: "video",
  },
  {
    id: "cin-3",
    title: "Tracking shot bosque",
    prompt: "Smooth tracking shot through an enchanted forest, golden hour sunlight filtering through trees, particles floating in the air, mystical atmosphere, shallow depth of field",
    category: "cinematic",
    mode: "video",
  },

  // ── Product ──
  {
    id: "prod-1",
    title: "Perfume premium",
    prompt: "Luxury perfume bottle on a reflective black surface, golden light, swirling smoke, elegant minimalist composition, studio lighting, commercial photography",
    category: "product",
    mode: "image",
  },
  {
    id: "prod-2",
    title: "Sneaker flotante",
    prompt: "A premium sneaker floating in mid-air with dynamic splash of colorful paint around it, studio lighting, clean white background, product photography, ultra sharp",
    category: "product",
    mode: "image",
  },
  {
    id: "prod-3",
    title: "Producto girando",
    prompt: "Smooth 360 degree rotation of a premium watch on a marble pedestal, dramatic studio lighting, slow elegant movement, luxury commercial style, reflective surface",
    category: "product",
    mode: "video",
  },

  // ── Portrait ──
  {
    id: "port-1",
    title: "Retrato cinematico",
    prompt: "Cinematic portrait of a woman with striking blue eyes, golden hour lighting, shallow depth of field, film grain, natural skin texture, editorial photography style",
    category: "portrait",
    mode: "image",
  },
  {
    id: "port-2",
    title: "Retrato neon",
    prompt: "Portrait of a person illuminated by neon pink and blue lights, reflections on skin, cyberpunk atmosphere, high contrast, moody shadows, urban night setting",
    category: "portrait",
    mode: "image",
  },

  // ── Landscape ──
  {
    id: "land-1",
    title: "Montana al amanecer",
    prompt: "Breathtaking mountain landscape at sunrise, layers of mountains fading into mist, warm golden light, dramatic clouds, ultra wide angle, National Geographic style",
    category: "landscape",
    mode: "image",
  },
  {
    id: "land-2",
    title: "Timelapse atardecer",
    prompt: "Beautiful timelapse of sunset over the ocean, clouds moving fast, colors transitioning from golden to purple, calm waves, epic wide angle view",
    category: "landscape",
    mode: "video",
  },
  {
    id: "land-3",
    title: "Ciudad futurista",
    prompt: "Futuristic city skyline at twilight, flying vehicles, holographic advertisements, neon lights reflecting on glass buildings, cyberpunk atmosphere, ultra detailed",
    category: "landscape",
    mode: "image",
  },

  // ── Abstract ──
  {
    id: "abs-1",
    title: "Fluido metalico",
    prompt: "Abstract flowing metallic liquid in iridescent colors, chrome reflections, organic shapes morphing smoothly, dark background, macro photography style",
    category: "abstract",
    mode: "video",
  },
  {
    id: "abs-2",
    title: "Geometria sagrada",
    prompt: "Sacred geometry patterns made of light, golden ratio spirals, glowing particles, deep space background, ethereal and mystical atmosphere, ultra detailed",
    category: "abstract",
    mode: "image",
  },

  // ── Animation ──
  {
    id: "anim-1",
    title: "Personaje 3D Pixar",
    prompt: "Adorable 3D character in Pixar style, big expressive eyes, smooth render, warm studio lighting, soft shadows, colorful background, cheerful expression",
    category: "animation",
    mode: "image",
  },
  {
    id: "anim-2",
    title: "Mascota animada",
    prompt: "Cute animated character waving hello, smooth 3D animation style, bouncy movement, colorful environment, friendly expression, children's movie quality",
    category: "animation",
    mode: "video",
  },

  // ── Commercial ──
  {
    id: "com-1",
    title: "Food commercial",
    prompt: "Delicious burger in slow motion with ingredients falling into place, lettuce, tomato, cheese melting, sauce dripping, dramatic lighting, food commercial style",
    category: "commercial",
    mode: "video",
  },
  {
    id: "com-2",
    title: "App showcase",
    prompt: "Sleek smartphone floating with a glowing app interface on screen, holographic UI elements surrounding it, dark gradient background, tech commercial style",
    category: "commercial",
    mode: "image",
  },
  {
    id: "com-3",
    title: "Fitness motivation",
    prompt: "Athlete running in slow motion through a misty track at sunrise, dynamic camera following from the side, sweat droplets visible, inspirational mood, commercial grade",
    category: "commercial",
    mode: "video",
  },
];

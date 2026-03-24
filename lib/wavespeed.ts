const BASE_URL = "https://api.wavespeed.ai/api/v3";
const API_KEY = process.env.WAVESPEED_API_KEY!;

export interface GenerateVideoParams {
  model: string;
  prompt: string;
  image?: string;       // base64 or URL — for image-to-video models
  videos?: string[];    // for reference-to-video models (WAN 2.6 ref)
  duration?: number;
  aspect_ratio?: string; // e.g. "16:9"
  size?: string;         // e.g. "1280x720" — used by WAN models instead of aspect_ratio
  extraParams?: Record<string, unknown>; // additional model-specific params (first_image, last_image, end_image, etc.)
}

export interface WavespeedTask {
  id: string;
  status: "created" | "processing" | "completed" | "failed";
  outputs?: string[];
  error?: string;
  timings?: { inference: number };
}

export async function submitVideoJob(
  params: GenerateVideoParams
): Promise<{ id: string; pollUrl: string }> {
  const body: Record<string, unknown> = {
    prompt: params.prompt,
  };

  // Media input — videos[] array takes precedence (reference models)
  if (params.videos && params.videos.length > 0) {
    body.videos = params.videos;
  } else if (params.image) {
    body.image = params.image;
  }

  // Duration
  if (params.duration) body.duration = params.duration;

  // Ratio — either size (WAN) or aspect_ratio (Seedance, standard)
  if (params.size) {
    body.size = params.size;
  } else if (params.aspect_ratio) {
    body.aspect_ratio = params.aspect_ratio;
  }

  // Extra model-specific params (start/end frame, etc.)
  if (params.extraParams) {
    for (const [key, value] of Object.entries(params.extraParams)) {
      body[key] = value;
    }
  }

  const res = await fetch(`${BASE_URL}/${params.model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || json.code !== 200) {
    throw new Error(json.message || "Error submitting job to Wavespeed");
  }

  return {
    id: json.data.id,
    pollUrl: json.data.urls?.get || `${BASE_URL}/predictions/${json.data.id}`,
  };
}

export async function getJobStatus(taskId: string): Promise<WavespeedTask> {
  const res = await fetch(`${BASE_URL}/predictions/${taskId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || json.code !== 200) {
    throw new Error(json.message || "Error fetching job status");
  }

  return json.data as WavespeedTask;
}

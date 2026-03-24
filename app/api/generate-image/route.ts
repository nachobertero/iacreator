import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.wavespeed.ai/api/v3";
const API_KEY = process.env.WAVESPEED_API_KEY!;

export type ImageModel =
  | "bytedance/seedream-v3"
  | "bytedance/seedream-v5.0-lite"
  | "bytedance/dreamina-v3.0/text-to-image"
  | "alibaba/wan-2.6/text-to-image";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, image, model, aspect_ratio } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }

    const selectedModel: ImageModel = model || "bytedance/seedream-v3";

    const requestBody: Record<string, unknown> = { prompt };
    if (image) requestBody.image = image;
    if (aspect_ratio) requestBody.aspect_ratio = aspect_ratio;

    const res = await fetch(`${BASE_URL}/${selectedModel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const json = await res.json();

    if (!res.ok || json.code !== 200) {
      throw new Error(json.message || "Error al generar imagen");
    }

    const data = json.data;

    if (data.status === "completed" && data.outputs?.length > 0) {
      return NextResponse.json({ images: data.outputs, taskId: data.id });
    }

    // Needs polling
    return NextResponse.json({ taskId: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[/api/generate-image]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

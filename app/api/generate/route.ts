import { NextRequest, NextResponse } from "next/server";
import { submitVideoJob } from "@/lib/wavespeed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt, image, model, duration,
      ratioParam, ratioValue, inputType,
      endFrame, endFrameParam, startFrameParam,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const selectedModel: string = model || "bytedance/seedance-v1.5-pro/image-to-video";

    const params = {
      model: selectedModel,
      prompt,
      duration: duration || 5,
    } as Parameters<typeof submitVideoJob>[0];

    // Media input — reference models use videos[], others use image
    if (inputType === "videos" && image) {
      params.videos = [image];
    } else if (image) {
      // Some models use "first_image" instead of "image" (e.g. WAN FLF2V)
      if (startFrameParam && startFrameParam !== "image") {
        params.extraParams = params.extraParams || {};
        params.extraParams[startFrameParam] = image;
      } else {
        params.image = image;
      }
    }

    // End frame — for start+end frame models
    if (endFrame && endFrameParam) {
      params.extraParams = params.extraParams || {};
      params.extraParams[endFrameParam] = endFrame;
    }

    // Ratio parameter — varies by model family
    if (ratioParam === "size" && ratioValue) {
      params.size = ratioValue;
    } else if (ratioParam === "aspect_ratio" && ratioValue) {
      params.aspect_ratio = ratioValue;
    }

    const result = await submitVideoJob(params);

    return NextResponse.json({ taskId: result.id, pollUrl: result.pollUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

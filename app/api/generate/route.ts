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

    // Media input — varies by model family
    if (inputType === "reference_urls" && image) {
      // WAN 2.6 Ref Flash expects reference_urls array
      params.extraParams = params.extraParams || {};
      params.extraParams.reference_urls = [image];
    } else if (inputType === "videos" && image) {
      // WAN 2.6 Reference expects videos array
      params.videos = [image];
    } else if (image) {
      // Standard image-to-video models
      if (startFrameParam && startFrameParam !== "image") {
        // WAN FLF2V uses "first_image" instead of "image"
        params.extraParams = params.extraParams || {};
        params.extraParams[startFrameParam] = image;
      } else {
        params.image = image;
      }
    }

    // End frame — for start+end frame models (Kling, WAN FLF2V, Seedance, Veo)
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

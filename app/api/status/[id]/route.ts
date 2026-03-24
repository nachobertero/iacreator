import { NextRequest, NextResponse } from "next/server";
import { getJobStatus } from "@/lib/wavespeed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await getJobStatus(id);
    return NextResponse.json(task);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/status]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

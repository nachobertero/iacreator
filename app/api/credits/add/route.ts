import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// POST /api/credits/add — adds credits (use after successful payment)
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const metadata = user.publicMetadata as { credits?: number };
  const current = metadata.credits ?? 0;

  const updated = current + amount;
  await clerk.users.updateUser(userId, {
    publicMetadata: { credits: updated },
  });

  return NextResponse.json({ credits: updated, added: amount });
}

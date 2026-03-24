import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const FREE_STARTER_CREDITS = 50;

// GET /api/credits — returns current credit balance, initializes if first time
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const metadata = user.publicMetadata as { credits?: number };

  // First time — initialize with starter credits
  if (metadata.credits === undefined) {
    await clerk.users.updateUser(userId, {
      publicMetadata: { credits: FREE_STARTER_CREDITS },
    });
    return NextResponse.json({ credits: FREE_STARTER_CREDITS, initialized: true });
  }

  return NextResponse.json({ credits: metadata.credits });
}

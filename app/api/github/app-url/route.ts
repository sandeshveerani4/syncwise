import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const installUrl = `https://github.com/apps/SyncWiseHub/installations/new?state=${session.user.id}`;

    return NextResponse.json({ url: installUrl });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate GitHub App URL" },
      { status: 500 }
    );
  }
}

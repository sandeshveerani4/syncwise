import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const REDIRECT_URI = `${
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
}`;
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const installation_id = req.nextUrl.searchParams.get("installation_id");
    const user_id = req.nextUrl.searchParams.get("state");

    if (
      !session.user.projectId ||
      !installation_id ||
      !user_id ||
      user_id !== session.user.id
    ) {
      return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
    }

    await prisma.project.update({
      data: { githubInstallationId: parseInt(installation_id) },
      where: { id: session.user.projectId },
    });

    if (session.user.onboarded) {
      return NextResponse.redirect(`${REDIRECT_URI}/dashboard`);
    } else {
      return NextResponse.redirect(
        `${REDIRECT_URI}/onboarding?installation_id=${installation_id}&state=${user_id}`
      );
    }
  } catch (error) {
    console.error("Error generating GitHub App URL:", error);
    return NextResponse.json(
      { message: "Failed to generate GitHub App URL" },
      { status: 500 }
    );
  }
}

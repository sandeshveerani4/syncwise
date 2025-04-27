import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { app } from "@/lib/github";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const installation_id = req.nextUrl.searchParams.get("installation_id");

    if (!session.user.projectId || !installation_id) {
      return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
    }

    const octokit = await app.getInstallationOctokit(parseInt(installation_id));

    const repositories = (
      await octokit.request("GET /installation/repositories")
    ).data.repositories;
    return NextResponse.json({ repositories });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json(
      { message: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

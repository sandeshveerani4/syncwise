import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GitHub App configuration
const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  `${
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  }/onboarding`;

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Generate a state parameter to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15);

    // Store the state in the session or database for verification later
    // This is a simplified example - in production, you should store this securely

    // Construct the GitHub App installation URL
    const installUrl = `https://github.com/apps/SyncWiseHub/installations/new?state=${state}`;

    return NextResponse.json({ url: installUrl });
  } catch (error) {
    console.error("Error generating GitHub App URL:", error);
    return NextResponse.json(
      { message: "Failed to generate GitHub App URL" },
      { status: 500 }
    );
  }
}

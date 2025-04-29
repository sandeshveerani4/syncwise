import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";
import { prisma } from "@/lib/db";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const code = req.nextUrl.searchParams.get("code");
    const user_id = req.nextUrl.searchParams.get("state");

    if (
      !session.user.projectId ||
      !code ||
      !user_id ||
      user_id !== session.user.id
    ) {
      return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI + "/api/calendar/callback"
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // We need to store the entire tokens object which includes:
    // - access_token: Short-lived token for API access
    // - refresh_token: Long-lived token to get new access tokens
    // - expiry_date: When the access token expires
    // - token_type: Usually "Bearer"
    // - scope: The scopes that were granted

    // Store the tokens securely in your database
    // In a real implementation, you should encrypt sensitive parts

    await prisma.apiKey.create({
      data: {
        key: JSON.stringify(tokens),
        service: "calendar",
        project: { connect: { id: session.user.projectId } },
      },
    });

    if (session.user.onboarded) {
      return NextResponse.redirect(`${REDIRECT_URI}/dashboard`);
    } else {
      return NextResponse.redirect(`${REDIRECT_URI}/onboarding?code=${code}`);
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      { message: "Failed to exchange code for token" },
      { status: 500 }
    );
  }
}

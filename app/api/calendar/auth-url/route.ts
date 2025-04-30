import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.SITE_URL
  ? `https://${process.env.SITE_URL}/api/calendar/callback`
  : "http://localhost:3000/api/calendar/callback";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      state: session.user.id,
      prompt: "consent",
    });

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating Google Calendar auth URL:", error);
    return NextResponse.json(
      { message: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}

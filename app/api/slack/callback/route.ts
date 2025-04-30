import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const REDIRECT_URI = `${
  process.env.SITE_URL
    ? `https://${process.env.SITE_URL}`
    : "http://localhost:3000"
}`;
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

    const client_id = process.env.SLACK_CLIENT_ID!;
    const client_secret = process.env.SLACK_CLIENT_SECRET!;

    const details = {
      code,
      client_id,
      client_secret,
    };
    const formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(
        details[property as keyof typeof details]
      );
      formBody.push(encodedKey + "=" + encodedValue);
    }

    const fformBody = formBody.join("&");

    const res = await fetch("https://slack.com/api/oauth.v2.access", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: fformBody,
      method: "POST",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Something went wrong: ", error: await res.json() },
        { status: 400 }
      );
    }

    const body = await res.json();

    if (!body.ok) {
      return NextResponse.json(
        { message: "Something went wrong", error: body },
        { status: 400 }
      );
    }

    await prisma.apiKey.create({
      data: {
        key: body.access_token,
        service: "slack",
        project: { connect: { id: session.user.projectId } },
      },
    });

    if (session.user.onboarded) {
      return NextResponse.redirect(`${REDIRECT_URI}/dashboard`);
    } else {
      return NextResponse.redirect(`${REDIRECT_URI}/onboarding?code=${code}`);
    }
  } catch (error) {
    console.error("Error generating GitHub App URL:", error);
    return NextResponse.json(
      { message: "Failed to generate GitHub App URL" },
      { status: 500 }
    );
  }
}

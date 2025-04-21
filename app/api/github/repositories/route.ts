import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the authorization header with the token
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Fetch repositories from GitHub API
    const response = await fetch(
      "https://api.github.com/installation/repositories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the repositories to match our expected structure
    const repositories = data.repositories.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.name,
      full_name: repo.full_name,
      owner: {
        login: repo.owner.login,
      },
    }));

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json(
      { message: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

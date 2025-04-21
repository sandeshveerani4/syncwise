import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // If user is not logged in, redirect to login page
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Check if user is onboarded
  const isOnboarded = token.onboarded as boolean;

  // If user is not onboarded and trying to access dashboard
  /*   if (!isOnboarded && path.startsWith("/dashboard")) {
    const onboardingUrl = new URL("/onboarding", request.url);
    return NextResponse.redirect(onboardingUrl);
  } */

  // If user is already onboarded and trying to access onboarding page
  /*   if (isOnboarded && path === "/onboarding") {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  } */

  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};

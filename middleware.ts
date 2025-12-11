// middleware.ts (at project root, next to `app` folder)
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // You would call your internal tracking API here.
  // Be mindful: Do not `await` the fetch if you want zero delay for the user.
  fetch(new URL("/api/track", request.url), {
    method: "POST",
    headers: {
      "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
      "user-agent": request.headers.get("user-agent") || "",
    },
  }).catch(() => {}); // Fire and forget

  return NextResponse.next();
}

// Configure the middleware to run on specific paths (or all)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

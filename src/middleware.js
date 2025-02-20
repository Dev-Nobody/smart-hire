import { NextResponse } from "next/server";

export function middleware(req) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/loginUser", req.url));
  }

  try {
    // ✅ Decode the JWT without verification
    const base64Url = token.split(".")[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64)); // Convert to JSON

    const userRole = decodedPayload.role;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (pathname.startsWith("/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT decoding failed:", error.message);
    return NextResponse.redirect(new URL("/loginUser", req.url));
  }
}

// ✅ Keep Edge Middleware (no need to change config)
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};

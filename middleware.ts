import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      const timestamp = Date.now();
      return NextResponse.redirect(
        new URL(`/admin/login?t=${timestamp}`, request.url)
      );
    }

    try {
      const verifyUrl = new URL("/api/auth/verify", request.url);
      const verifyResponse = await fetch(verifyUrl.toString(), {
        method: "GET",
        headers: {
          Cookie: `auth-token=${token}`,
        },
      });

      if (!verifyResponse.ok) {
        const timestamp = Date.now();
        const response = NextResponse.redirect(
          new URL(`/admin/login?t=${timestamp}`, request.url)
        );
        response.cookies.delete("auth-token");
        return response;
      }

      const result = await verifyResponse.json();

      if (!result.success) {
        const timestamp = Date.now();
        const response = NextResponse.redirect(
          new URL(`/admin/login?t=${timestamp}`, request.url)
        );
        response.cookies.delete("auth-token");
        return response;
      }

      // Add cache prevention headers for admin pages
      const response = NextResponse.next();
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    } catch (error) {
      const timestamp = Date.now();
      const response = NextResponse.redirect(
        new URL(`/admin/login?t=${timestamp}`, request.url)
      );
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Redirect to admin dashboard if user is already logged in and tries to access login
  if (pathname === "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    if (token) {
      try {
        const verifyUrl = new URL("/api/auth/verify", request.url);
        const verifyResponse = await fetch(verifyUrl.toString(), {
          method: "GET",
          headers: {
            Cookie: `auth-token=${token}`,
          },
        });

        if (verifyResponse.ok) {
          const result = await verifyResponse.json();

          if (result.success) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        }
      } catch (error) {
        console.error("Token verification error on login page:", error);

        const response = NextResponse.next();
        response.cookies.delete("auth-token");
        return response;
      }
    }

    // Add cache prevention headers for login page
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

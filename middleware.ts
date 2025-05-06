import { NextResponse } from "next/server";
import { getSupabaseWithSession } from "@/lib/supabase";

export async function middleware(request: Request) {
  const supabase = await getSupabaseWithSession();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const pathname = url.pathname;

  // Protect admin and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    if (authError || !user) {
      console.log(
        "Middleware: Unauthorized access to",
        pathname,
        "Redirecting or returning 401"
      );
      // Redirect to /admin/login for admin routes
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      // Return 401 for API routes
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Redirect authenticated users from /admin/login to /admin/products
  if (pathname === "/admin/login" && user) {
    console.log(
      "Middleware: Authenticated user at /admin/login, redirecting to /admin/products"
    );
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  console.log("Middleware: Allowing request to", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

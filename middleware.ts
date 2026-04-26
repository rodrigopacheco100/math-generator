import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export default auth(async function middleware(
  req: NextRequest & { auth: { user?: { email?: string | null } } | null },
) {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isTRPCRoute = req.nextUrl.pathname.startsWith("/api/trpc");

  if (isAuthRoute || isTRPCRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/collections",
  "/collections/[id]",
  "/collections/[id]/base",
  "/collections/[id]/multiple",
  "/collections/[id]/true-false",
  "/account",
  "/admin-page",
];

const routesToRedirectIfLoggedIn = [
  "/home",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/redirect",
];

// This middleware function checks if the user is authenticated and redirects them accordingly.
// It also handles redirection for the home page and admin page access.
export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;
  const url = req.nextUrl.clone();

  if (url.pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
  if (!token && protectedRoutes.includes(url.pathname)) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  if (token && routesToRedirectIfLoggedIn.includes(url.pathname)) {
    url.pathname = "/collections";
    return NextResponse.redirect(url);
  }
  if (url.pathname === "/admin-page") {
    const isAdmin = req.cookies.get("isAdmin")?.value === "true";
    if (!isAdmin) {
      url.pathname = "/collections";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

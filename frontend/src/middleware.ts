import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = [
//   "/collections",
//   "/collections/[id]",
//   "/collections/[id]/base",
//   "/collections/[id]/multiple",
//   "/collections/[id]/true-false",
//   "/account",
//   "/admin-page",
// ];

// This middleware function checks if the user is authenticated and redirects them accordingly.
// It also handles redirection for the home page and admin page access.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log("Token:", token);
  console.log("URL:", url.pathname);

  if (url.pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
  // if (!token && protectedRoutes.includes(url.pathname)) {
  //   url.pathname = "/auth/login";
  //   return NextResponse.redirect(url);
  // }
  // if (
  //   token &&
  //   (url.pathname === "/home" ||
  //     url.pathname === "/auth/login" ||
  //     url.pathname === "/auth/register" ||
  //     url.pathname === "/auth/reset-password")
  // ) {
  //   url.pathname = "/collections";
  //   return NextResponse.redirect(url);
  // }
  // if (url.pathname === "/admin-page") {
  //   const isAdmin = req.headers.get("X-Is-Admin") === "true";
  //   if (!isAdmin) {
  //     url.pathname = "/collections";
  //     return NextResponse.redirect(url);
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

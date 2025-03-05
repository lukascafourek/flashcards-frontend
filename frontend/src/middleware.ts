import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/collections", "/account", "/account/user-statistics"]; 

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;
  const url = req.nextUrl.clone();

  if (!token && protectedRoutes.includes(url.pathname)) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (token && (url.pathname === "/home" || url.pathname === "/auth/login" || url.pathname === "/auth/register" || url.pathname === "/auth/reset-password")) {
    url.pathname = "/collections";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], 
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/register", "/public"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Biarkan public route
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // console.log("🚀 ~ middleware ~ token:", token)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token tersedia, lanjutkan akses
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/praktikan/:path*", "/asisten/:path*"], // batasi hanya ke protected route
};

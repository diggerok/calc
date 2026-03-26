import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

const publicPaths = ["/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

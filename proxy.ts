import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prismaDb";
import { compare } from "bcryptjs";

const SESSION_COOKIE_NAME = "session_token";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(path);
  const isApiAuthRoute = path.startsWith("/api/signin") || path.startsWith("/api/signup") || path.startsWith("/api/logout") || path.startsWith("/api/me");

  if (isPublicRoute || isApiAuthRoute) {
    return NextResponse.next();
  }

  // Check for valid session
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const activeSessions = await prisma.session.findMany({
    where: {
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  let validSession = null;
  for (const session of activeSessions) {
    const isValid = await compare(token, session.tokenHash);
    if (isValid) {
      validSession = session;
      break;
    }
  }

  if (!validSession) {
    // Clean up expired sessions
    await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};

import { prisma } from "./prismaDb";
import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure session token
 */
function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_LENGTH).toString("base64url");
}

/**
 * Hash a token for storage
 */
async function hashToken(token: string): Promise<string> {
  return await hash(token, 10);
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string) {
  const token = generateSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { session, token };
}

/**
 * Get session from request cookies
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  // Find all sessions for the user (we'll verify by comparing hashes)
  // Since we can't query by tokenHash directly (we need to compare each one),
  // first we'll get all active sessions and check each one
  const activeSessions = await prisma.session.findMany({
    where: {
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  for (const session of activeSessions) {
    const isValid = await compare(token, session.tokenHash);
    if (isValid) {
      // Extend session (sliding expiration)
      await prisma.session.update({
        where: { id: session.id },
        data: { expiresAt: new Date(Date.now() + SESSION_DURATION) },
      });

      const { password: _, ...safeUser } = session.user;
      return { session, user: safeUser };
    }
  }

  // Clean up expired sessions while we're here
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return null;
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

/**
 * Delete session and clear cookie
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    // Find and delete the session
    const activeSessions = await prisma.session.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    for (const session of activeSessions) {
      const isValid = await compare(token, session.tokenHash);
      if (isValid) {
        await prisma.session.delete({ where: { id: session.id } });
        break;
      }
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  action: string,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.auditLog.create({
    data: {
      action,
      userId,
      ipAddress,
      userAgent,
    },
  });
}

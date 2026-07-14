import { prisma } from "@/app/lib/prismaDb";
import { compare } from "bcryptjs"; 
import { createSession, setSessionCookie, createAuditLog } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    // 1. Validation: Don't even hit the DB if fields are missing
    if (!email || !password) {
      await createAuditLog("LOGIN_FAILURE", undefined, ipAddress, userAgent);
      return Response.json({ 
        error: "Missing required fields: email and password" 
      }, { status: 400 });
    }

    // 2. Lookup: Find user by UNIQUE identifier only
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Verification: Check existence AND password
    // Use a timing-safe comparison to prevent brute force
    const isValid = user ? await compare(password, user.password) : false;

    if (!isValid) {
      const userId = user?.id;
      await createAuditLog("LOGIN_FAILURE", userId, ipAddress, userAgent);
      return Response.json({ 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    // 4. Create session
    if (user === null) {
      NextResponse.json({
        message:"User is null"
      })
      return
    }
    const { session, token } = await createSession(user.id);
    await setSessionCookie(token);
    await createAuditLog("LOGIN_SUCCESS", user.id, ipAddress, userAgent);
    await createAuditLog("SESSION_CREATED", user.id, ipAddress, userAgent);

    // 5. Security: Never return the password hash to the client!
    const { password: _, ...safeUser } = user!;

    return Response.json({ 
      message: "Sign in successful",
      user: safeUser 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return Response.json({ 
      error: error.message || "Internal Server Error",
      date: new Date().toISOString()
    }, { status: 500 });
  }
}
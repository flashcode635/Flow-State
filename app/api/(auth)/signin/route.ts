import { prisma } from "@/app/lib/prismaDb";
import { compare } from "bcryptjs"; 


export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validation: Don't even hit the DB if fields are missing
    if (!email || !password) {
      return Response.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 2. Lookup: Find user by UNIQUE identifier only
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Verification: Check existence AND password
    // Use a timing-safe comparison to prevent brute force
    const isValid = user ? await compare(password, user.password) : false;

    if (!isValid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 4. Security: Never return the password hash to the client!
    const { password: _, ...safeUser } = user!;

    return Response.json({ user: safeUser }, { status: 200 });

  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
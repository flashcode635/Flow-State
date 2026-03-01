// app/api/(auth)/signin/route.ts
import { prisma } from "@/app/lib/prismaDb";
import { registerUser } from "@/app/lib/hash";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const passwordHash = await registerUser(body.password);
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: passwordHash,
        username: body.username, // Mapping 'name' from request to 'username' in DB
      },
    });

    return Response.json(user);
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return Response.json({ 
      error: error.message,
      date: new Date().toISOString()
    }, { status: 500 });
  }
}
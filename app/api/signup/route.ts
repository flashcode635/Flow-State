// app/api/(auth)/signup/route.ts
import { prisma } from "@/app/lib/prismaDb";
import { registerUser } from "@/app/lib/hash";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password || !body.username) {
      return Response.json({ 
        error: "Missing required fields: email, password, username" 
      }, { status: 400 });
    }

    const passwordHash = await registerUser(body.password);
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: passwordHash,
        username: body.username,
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return Response.json({ 
      message: "User created successfully",
      user: userWithoutPassword 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return Response.json({ 
        error: "User with this email already exists" 
      }, { status: 409 });
    }
    else{
      return Response.json({ 
        error: "Signup Failed: Internal server error",
        date: new Date().toISOString()
      }, { status: 500 });
    }
  }
}
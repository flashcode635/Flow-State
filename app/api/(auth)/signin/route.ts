import { UserData } from "@/app/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body:UserData = await request.json(); // Parse incoming JSON
    
    // Logic: Database insertion or processing here
    
    return NextResponse.json({ 
        received: body,
        message: "Resource Created" ,
        date: new Date().toISOString()
        }, { 
            status: 201
         }
    );
    
  } catch (error) {
    return NextResponse.json(
        { error: "Invalid JSON",
        date: new Date().toISOString()

         },
        { status: 400 }
    );
  }
}
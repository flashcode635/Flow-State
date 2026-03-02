import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prismaDb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, score, tasksCompleted, totalTasks, userId } = body;

    // Validate required fields
    if (!date || score === undefined || tasksCompleted === undefined || totalTasks === undefined || !userId) {
      return NextResponse.json({ 
        error: "Missing required fields: date, score, tasksCompleted, totalTasks, userId" 
      }, { status: 400 });
    }

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!userExists) {
      return NextResponse.json({ 
        error: "User not found. Please sign in again." 
      }, { status: 404 });
    }

    // Create day record in database
    const dayRecord = await prisma.dayRecord.create({
      data: {
        userId,
        date,
        score,
        tasksCompleted,
        totalTasks,
      },
    });

    return NextResponse.json({ 
      message: "Day record saved successfully",
      record: dayRecord 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Failed to save day record:", error.message);
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "Day record already exists for this date" 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      date: new Date().toISOString()
    }, { status: 500 });
  }
}

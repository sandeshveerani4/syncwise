import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const meetingSchema = z.object({
  name: z.string().min(3),
  meeting_id: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.projectId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, meeting_id } = meetingSchema.parse(body);

    const meeting = await prisma.meeting.create({
      data: {
        name,
        userId: session.user.id,
        projectId: session.user.projectId,
        meeting_id,
      },
    });

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.projectId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the user's meetings
    const meetings = await prisma.meeting.findMany({
      where: {
        userId: session.user.id,
        projectId: session.user.projectId,
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

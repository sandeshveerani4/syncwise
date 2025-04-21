import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const joinSchema = z.object({
  inviteCode: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { inviteCode } = joinSchema.parse(body);

    console.log("Joining project with invite code:", inviteCode);

    // In a real app, you would look up the invite code and associate the user with the project
    // This is a simplified example
    const project = await prisma.project.findFirst({
      where: {
        id: inviteCode, // Using the ID as the invite code for simplicity
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Invalid invite code" },
        { status: 404 }
      );
    }

    // Here you would add the user to the project
    // For example, you might have a ProjectMember model to track this

    // For now, let's create a copy of the project for this user
    const userProject = await prisma.project.create({
      data: {
        name: `${project.name} (Joined)`,
        description: project.description,
        userId: session.user.id,
      },
    });

    console.log("User joined project:", userProject.id);

    return NextResponse.json(
      { message: "Successfully joined project" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error joining project:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

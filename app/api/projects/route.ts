import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validatedData = projectSchema.parse(body);

    let project = await prisma.project.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        apiKeys: {
          select: {
            id: true,
            service: true,
            additionalData: true,
          },
        },
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: validatedData.name,
          description: validatedData.description || "",
          userId: session.user.id,
        },
        include: {
          apiKeys: {
            select: {
              id: true,
              service: true,
              additionalData: true,
            },
          },
        },
      });

      await prisma.user.update({
        data: { project: { connect: { id: project.id } } },
        where: { id: session.user.id },
      });
    } else {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
        },
      });
    }

    return NextResponse.json(
      { project, message: "Project created/updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

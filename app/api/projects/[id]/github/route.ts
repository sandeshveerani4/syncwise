import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const githubSettingsSchema = z.object({
  repository: z.string().min(1, {
    message: "Repository is required",
  }),
  repositoryId: z.number({ required_error: "Repository Id is required" }),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await req.json();
    const { repository, repositoryId } = githubSettingsSchema.parse(body);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Update the project with GitHub repository information
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        githubRepo: repository,
        additionalData: { githubRepoId: repositoryId },
      },
    });

    return NextResponse.json({
      project: updatedProject,
      message: "GitHub settings updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating GitHub settings:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

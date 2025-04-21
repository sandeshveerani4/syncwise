import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const githubSettingsSchema = z.object({
  owner: z.string().min(1, {
    message: "Owner is required",
  }),
  repository: z.string().min(1, {
    message: "Repository is required",
  }),
  repositoryId: z.string().min(1, {
    message: "Repository ID is required",
  }),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const body = await req.json();
    const { owner, repository, repositoryId } =
      githubSettingsSchema.parse(body);

    // Check if the project exists and belongs to the user
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
        githubOwner: owner,
        githubRepo: repository,
      },
    });

    // Update the GitHub API key with the new repository information
    const githubApiKey = await prisma.apiKey.findFirst({
      where: {
        projectId,
        service: "github",
      },
    });

    if (githubApiKey) {
      // Get the current additionalData
      let additionalData = (githubApiKey.additionalData as any) || {};

      // If additionalData is a string, parse it
      if (typeof additionalData === "string") {
        additionalData = JSON.parse(additionalData);
      }

      // Update the repository information
      additionalData.owner = owner;
      additionalData.repository = repository;
      additionalData.repositoryId = repositoryId;

      // Update the API key
      await prisma.apiKey.update({
        where: {
          id: githubApiKey.id,
        },
        data: {
          additionalData,
        },
      });
    }

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

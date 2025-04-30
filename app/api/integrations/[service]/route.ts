import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { service: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { service } = params;

    // Get the user's current project
    const project = await prisma.project.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "No project found" },
        { status: 404 }
      );
    }

    if (service === "github") {
      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          githubRepo: undefined,
          additionalData: {}, // To check when will have other keys as well
        },
      });
      return NextResponse.json({ message: "Integration removed successfully" });
    }

    // Delete the integration
    await prisma.apiKey.deleteMany({
      where: {
        projectId: project.id,
        service,
      },
    });

    return NextResponse.json({ message: "Integration removed successfully" });
  } catch (error) {
    console.error("Error removing integration:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

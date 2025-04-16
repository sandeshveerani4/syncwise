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

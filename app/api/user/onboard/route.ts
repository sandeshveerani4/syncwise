import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
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
      return NextResponse.json(
        { message: "Project not connected" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        onboarded: true,
      },
    });

    return NextResponse.json({
      message: "User marked as onboarded successfully",
    });
  } catch (error) {
    console.error("Error marking user as onboarded:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

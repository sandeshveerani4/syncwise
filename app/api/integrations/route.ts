import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const integrationSchema = z.object({
  service: z.string(),
  key: z.string().optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.projectId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the user's current project
    const project = await prisma.project.findFirst({
      where: {
        id: session.user.projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!project) {
      return NextResponse.json({ integrations: [] });
    }

    // Get the integrations for the project
    const integrations = await prisma.apiKey.findMany({
      where: {
        projectId: project.id,
      },
      select: {
        id: true,
        service: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ integrations, project });
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { service, key, additionalData } = integrationSchema.parse(body);

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

    // Check if integration already exists
    const existingIntegration = await prisma.apiKey.findFirst({
      where: {
        projectId: project.id,
        service,
      },
    });

    if (existingIntegration) {
      // Update existing integration
      const updatedIntegration = await prisma.apiKey.update({
        where: {
          id: existingIntegration.id,
        },
        data: {
          ...(key && { key: key }),
          additionalData,
        },
      });

      return NextResponse.json({
        integration: {
          id: updatedIntegration.id,
          service: updatedIntegration.service,
        },
        message: "Integration updated successfully",
      });
    }

    if (!key) {
      return NextResponse.json({ message: "Key is required" }, { status: 500 });
    }

    const integration = await prisma.apiKey.create({
      data: {
        key,
        service,
        projectId: project.id,
        additionalData,
      },
    });

    return NextResponse.json({
      integration: {
        id: integration.id,
        service: integration.service,
      },
      message: "Integration added successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding integration:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

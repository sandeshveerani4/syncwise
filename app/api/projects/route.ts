import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as z from "zod";

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  github: z.object({
    connected: z.boolean(),
    token: z.string().optional(),
    repositories: z.array(z.string()).optional(),
  }),
  jira: z.object({
    connected: z.boolean(),
    domain: z.string().optional(),
    token: z.string().optional(),
    projects: z.array(z.string()).optional(),
  }),
  slack: z.object({
    connected: z.boolean(),
    token: z.string().optional(),
    channels: z.array(z.string()).optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    // Create project
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        userId: session.user.id,
      },
    });

    // Store API keys if integrations are connected
    const apiKeys = [];

    if (validatedData.github.connected && validatedData.github.token) {
      apiKeys.push({
        name: "GitHub",
        key: validatedData.github.token,
        service: "github",
        userId: session.user.id,
        projectId: project.id,
      });
    }

    if (validatedData.jira.connected && validatedData.jira.token) {
      apiKeys.push({
        name: "Jira",
        key: validatedData.jira.token,
        service: "jira",
        userId: session.user.id,
        projectId: project.id,
      });
    }

    if (validatedData.slack.connected && validatedData.slack.token) {
      apiKeys.push({
        name: "Slack",
        key: validatedData.slack.token,
        service: "slack",
        userId: session.user.id,
        projectId: project.id,
      });
    }

    if (apiKeys.length > 0) {
      await prisma.apiKey.createMany({
        data: apiKeys,
      });
    }

    return NextResponse.json(
      { project, message: "Project created successfully" },
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

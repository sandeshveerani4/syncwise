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
    owner: z.string().optional(),
    repository: z.string().optional(),
    installationId: z.string().optional(), // Add installation ID
  }),
  jira: z.object({
    connected: z.boolean(),
    domain: z.string().optional(),
    token: z.string().optional(),
    projects: z.array(z.string()).optional(),
    email: z.string().optional(),
  }),
  slack: z.object({
    connected: z.boolean(),
    token: z.string().optional(),
    channels: z.array(z.string()).optional(),
    workspace: z.string().optional(),
    channel: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    console.log(
      "Creating project with data:",
      JSON.stringify(validatedData, null, 2)
    );

    // Create project with GitHub repository information
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        userId: session.user.id,
        // Store GitHub repository information directly in the project
        githubOwner: validatedData.github.connected
          ? validatedData.github.owner
          : null,
        githubRepo: validatedData.github.connected
          ? validatedData.github.repository
          : null,
      },
    });

    console.log("Project created:", project.id);

    // Store API keys if integrations are connected
    const apiKeys = [];

    if (validatedData.github.connected) {
      // Extract GitHub-specific additional data
      const githubData = {
        owner: validatedData.github.owner,
        repository: validatedData.github.repository,
        repositoryId: validatedData.github.repositories?.[0], // Store the repository ID
        installationId: validatedData.github.installationId, // Store the installation ID
        isGitHubApp: true,
      };

      apiKeys.push({
        name: "GitHub",
        key: validatedData.github.token || "",
        service: "github",
        additionalData: githubData, // Store as JSON
        userId: session.user.id,
        projectId: project.id,
      });
    }

    if (validatedData.jira.connected && validatedData.jira.token) {
      // Extract Jira-specific additional data
      const jiraData = {
        domain: validatedData.jira.domain,
        email: validatedData.jira.email,
        projects: validatedData.jira.projects,
      };

      apiKeys.push({
        name: "Jira",
        key: validatedData.jira.token,
        service: "jira",
        additionalData: jiraData, // Store as JSON
        userId: session.user.id,
        projectId: project.id,
      });
    }

    if (validatedData.slack.connected && validatedData.slack.token) {
      // Extract Slack-specific additional data
      const slackData = {
        workspace: validatedData.slack.workspace,
        channel: validatedData.slack.channel,
        channels: validatedData.slack.channels,
      };

      apiKeys.push({
        name: "Slack",
        key: validatedData.slack.token,
        service: "slack",
        additionalData: slackData, // Store as JSON
        userId: session.user.id,
        projectId: project.id,
      });
    }

    console.log("Creating API keys:", apiKeys.length);

    if (apiKeys.length > 0) {
      for (const apiKey of apiKeys) {
        await prisma.apiKey.create({
          data: apiKey,
        });
      }
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

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

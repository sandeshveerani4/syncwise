import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

interface CheckpointMetadata {
  step: number;
  source: string;
  writes: {
    __start__?: {
      messages: string[];
    };
    agent?: {
      messages: Array<{
        id: string[];
        lc: number;
        type: string;
        kwargs: {
          id: string;
          type: string;
          content: string;
          tool_calls?: any[];
          response_metadata?: any;
          invalid_tool_calls?: any[];
        };
      }>;
    };
  };
  parents: Record<string, any>;
  thread_id: string;
  system_message: string;
}

interface ChatSummary {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
}

function extractChatTitle(metadata: CheckpointMetadata): string {
  // Try to get the first user message as title
  if (
    metadata.writes.__start__?.messages &&
    metadata.writes.__start__?.messages?.length > 0
  ) {
    const firstMessage = metadata.writes.__start__.messages[0];
    return typeof firstMessage === "string"
      ? firstMessage.slice(0, 60) + (firstMessage.length > 60 ? "..." : "")
      : "New Chat";
  }

  // If no start message, try to get from agent messages
  if (
    metadata.writes.agent?.messages &&
    metadata.writes.agent?.messages?.length > 0
  ) {
    const firstAgentMessage = metadata.writes.agent.messages[0];
    if (firstAgentMessage.kwargs?.content) {
      const content = firstAgentMessage.kwargs.content;
      return content.slice(0, 60) + (content.length > 60 ? "..." : "");
    }
  }

  return "New Chat";
}

function extractLastMessage(metadata: CheckpointMetadata): string {
  // Try to get the last agent message
  if (
    metadata.writes.agent?.messages &&
    metadata.writes.agent?.messages?.length > 0
  ) {
    const lastMessage =
      metadata.writes.agent.messages[metadata.writes.agent.messages.length - 1];
    if (lastMessage.kwargs?.content) {
      return (
        lastMessage.kwargs.content.slice(0, 100) +
        (lastMessage.kwargs.content.length > 100 ? "..." : "")
      );
    }
  }

  // Fallback to start message
  if (
    metadata.writes.__start__?.messages &&
    metadata.writes.__start__?.messages?.length > 0
  ) {
    const message = metadata.writes.__start__.messages[0];
    return typeof message === "string"
      ? message.slice(0, 100) + (message.length > 100 ? "..." : "")
      : "No messages";
  }

  return "No messages";
}

function countMessages(metadata: CheckpointMetadata): number {
  let count = 0;

  if (metadata.writes.__start__?.messages) {
    count += metadata.writes.__start__.messages.length;
  }

  if (metadata.writes.agent?.messages) {
    count += metadata.writes.agent.messages.length;
  }

  return count;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Query the checkpoints table - adjust table name and columns based on your schema
    // This assumes you have a checkpoints table with thread_id, metadata, and created_at columns
    const checkpoints = await prisma.$queryRaw<
      Array<{
        thread_id: string;
        metadata: any;
      }>
    >`
      SELECT DISTINCT ON (thread_id)
        thread_id,
        metadata
      FROM "ChatToken" a
      JOIN checkpoints b ON a.
      WHERE user_id = ${session.user.id}
      ORDER BY thread_id, step DESC
    `;

    // Process checkpoints to create chat summaries
    const chats: ChatSummary[] = checkpoints.map((checkpoint) => {
      const metadata = checkpoint.metadata as CheckpointMetadata;

      return {
        id: checkpoint.thread_id,
        title: extractChatTitle(metadata),
        lastMessage: extractLastMessage(metadata),
        messageCount: countMessages(metadata),
      };
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching AI chats:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

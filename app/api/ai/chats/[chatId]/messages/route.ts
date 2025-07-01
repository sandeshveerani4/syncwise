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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = params;

    // Get all checkpoints for this thread_id ordered by step
    const checkpoints = await prisma.$queryRaw<
      Array<{
        step: number;
        metadata: any;
        created_at: Date;
      }>
    >`
      SELECT step, metadata, created_at
      FROM checkpoints
      WHERE thread_id = ${chatId} AND user_id = ${session.user.id}
      ORDER BY step ASC
    `;

    const messages: ChatMessage[] = [];

    // Process checkpoints to extract messages
    checkpoints.forEach((checkpoint) => {
      const metadata = checkpoint.metadata as CheckpointMetadata;

      // Extract user messages from __start__
      if (metadata.writes.__start__?.messages) {
        metadata.writes.__start__.messages.forEach((message, index) => {
          if (typeof message === "string") {
            messages.push({
              id: `${checkpoint.step}-start-${index}`,
              role: "user",
              content: message,
              timestamp: checkpoint.created_at,
            });
          }
        });
      }

      // Extract assistant messages from agent
      if (metadata.writes.agent?.messages) {
        metadata.writes.agent.messages.forEach((message, index) => {
          if (message.kwargs?.content) {
            messages.push({
              id: `${checkpoint.step}-agent-${index}`,
              role: "assistant",
              content: message.kwargs.content,
              timestamp: checkpoint.created_at,
            });
          }
        });
      }
    });

    // Sort messages by timestamp to maintain conversation order
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

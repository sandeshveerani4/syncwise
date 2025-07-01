import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CheckpointData, CheckpointMetadata } from "../../route";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  checkpointId: string;
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
        metadata: CheckpointMetadata;
        checkpoint: CheckpointData;
      }>
    >`
      SELECT metadata,checkpoint
      FROM checkpoints
      WHERE thread_id = ${chatId}
      ORDER BY (checkpoint->>'ts')::timestamp ASC
    `;

    const messages: ChatMessage[] = [];

    // Process checkpoints to extract messages
    checkpoints.forEach((checkpoint) => {
      const metadata = checkpoint.metadata;
      const checkpointTimestamp = new Date(checkpoint.checkpoint.ts);

      // Extract user messages from __start__
      if (metadata.writes?.__start__?.messages) {
        metadata.writes.__start__.messages.forEach((message, index) => {
          if (typeof message === "string") {
            messages.push({
              id: `start-${index}`,
              role: "user",
              content: message,
              timestamp: checkpointTimestamp,
              checkpointId: checkpoint.checkpoint.id,
            });
          }
        });
      }

      // Extract assistant messages from agent
      if (metadata.writes?.agent?.messages) {
        metadata.writes.agent.messages.forEach((message, index) => {
          if (message.kwargs?.content) {
            messages.push({
              id: `agent-${index}`,
              role: "assistant",
              content: message.kwargs.content,
              timestamp: checkpointTimestamp,
              checkpointId: checkpoint.checkpoint.id,
            });
          }
        });
      }
    });

    messages.sort((a, b) => {
      const timeDiff = a.timestamp.getTime() - b.timestamp.getTime();
      if (timeDiff !== 0) return timeDiff;
      return 0;
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

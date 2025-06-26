import type { Metadata } from "next";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";

export const metadata: Metadata = {
  title: "AI Assistant | SyncWise AI",
  description: "Interact with your AI assistant",
};

export default function AiPage() {
  return (
    <div className="flex flex-1">
      <AiChatInterface />
    </div>
  );
}

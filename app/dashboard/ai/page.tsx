import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";
import AiReloadButton from "@/components/ai/ai-reload-button";

export const metadata: Metadata = {
  title: "AI Assistant | SyncWise AI",
  description: "Interact with your AI assistant",
};

export default function AiPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading="AI Assistant"
        text="Ask questions, get insights, and automate tasks with your AI assistant. Sometimes, it can be buggy with tool calling. Try creating new chat."
      >
        <AiReloadButton />
      </DashboardHeader>
      <AiChatInterface />
    </div>
  );
}

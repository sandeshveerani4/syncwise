import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";
import AiReloadButton from "@/components/ai/ai-reload-button";
import { AiSidebar } from "@/components/ai/ai-sidebar";

export const metadata: Metadata = {
  title: "AI Assistant | SyncWise AI",
  description: "Interact with your AI assistant",
};

export default function AiPage() {
  return (
    <div className="flex flex-1">
      {/* <AiSidebar /> */}
      <AiChatInterface />
    </div>
  );
}

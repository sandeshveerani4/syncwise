"use client";
import { GitHubCard } from "@/components/integrations/github-card";
import { SlackCard } from "@/components/integrations/slack-card";
import { JiraCard } from "@/components/integrations/jira-card";
import { CalendarCard } from "@/components/integrations/calendar-card";
import { AiAssistantCard } from "@/components/integrations/ai-assistant-card";

export function DashboardTabs() {
  return (
    <div className="space-y-8">
      <div className="px-2">
        <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
        <AiAssistantCard />
      </div>

      <div className="px-2">
        <h2 className="text-xl font-semibold mb-4">Your Integrations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <GitHubCard />
          <SlackCard />
          <JiraCard />
          <CalendarCard />
        </div>
      </div>
    </div>
  );
}

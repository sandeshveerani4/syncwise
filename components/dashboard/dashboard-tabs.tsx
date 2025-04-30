"use client";
import { GitHubCard } from "@/components/integrations/github-card";
import { SlackCard } from "@/components/integrations/slack-card";
import { JiraCard } from "@/components/integrations/jira-card";
import { CalendarCard } from "@/components/integrations/calendar-card";
import { AiAssistantCard } from "@/components/integrations/ai-assistant-card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function DashboardTabs() {
  const [integrations, setIntegrations] = useState({
    github: false,
    slack: false,
    jira: false,
    calendar: false,
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const response = await fetch("/api/integrations");
        const data = await response.json();

        if (data.integrations) {
          const connectedServices = data.integrations.reduce(
            (acc: Record<string, boolean>, integration: any) => {
              acc[integration.service] = true;
              return acc;
            },
            {}
          );

          setIntegrations((prev) => ({
            ...prev,
            ...connectedServices,
            github: !!data.project.githubRepo,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
        toast({
          title: "Error",
          description: "Failed to load integrations. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="px-2">
        <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
        <AiAssistantCard />
      </div>

      <div className="px-2">
        <h2 className="text-xl font-semibold mb-4">Your Integrations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : Object.values(integrations).every((x) => x === false) ? (
            "You have no integrations setup."
          ) : (
            <>
              {integrations.github && <GitHubCard />}
              {integrations.slack && <SlackCard />}
              {integrations.jira && <JiraCard />}
              {integrations.calendar && <CalendarCard />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitHubLogoIcon,
  ChatBubbleIcon,
  MixIcon,
  CheckIcon,
  CrossCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";

interface ProjectSummaryProps {
  projectData: {
    name: string;
    description: string;
    github: {
      repository: string;
    };
    jira: {
      token: string;
    };
    slack: {
      isConnected: boolean;
    };
    calendar: {
      isConnected: boolean;
    };
  };
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ProjectSummary({
  projectData,
  onBack,
  onSubmit,
  isLoading,
}: ProjectSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Project Summary</h3>
        <p className="text-sm text-muted-foreground">
          Review your project details before creating
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Project Details
              </h4>
              <p className="text-lg font-semibold">{projectData.name}</p>
              {projectData.description && (
                <p className="text-sm">{projectData.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Integrations
              </h4>

              <div className="flex items-center space-x-2">
                <GitHubLogoIcon className="h-5 w-5" />
                <span className="text-sm font-medium">GitHub</span>
                {projectData.github.repository ? (
                  <span className="ml-auto flex items-center text-sm text-green-600">
                    <CheckIcon className="mr-1 h-4 w-4" /> Connected
                  </span>
                ) : (
                  <span className="ml-auto flex items-center text-sm text-muted-foreground">
                    <CrossCircledIcon className="mr-1 h-4 w-4" /> Not connected
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <MixIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Jira</span>
                {projectData.jira.token ? (
                  <span className="ml-auto flex items-center text-sm text-green-600">
                    <CheckIcon className="mr-1 h-4 w-4" /> Connected
                  </span>
                ) : (
                  <span className="ml-auto flex items-center text-sm text-muted-foreground">
                    <CrossCircledIcon className="mr-1 h-4 w-4" /> Not connected
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <ChatBubbleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Slack</span>
                {projectData.slack.isConnected ? (
                  <span className="ml-auto flex items-center text-sm text-green-600">
                    <CheckIcon className="mr-1 h-4 w-4" /> Connected
                  </span>
                ) : (
                  <span className="ml-auto flex items-center text-sm text-muted-foreground">
                    <CrossCircledIcon className="mr-1 h-4 w-4" /> Not connected
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Google Calendar</span>
                {projectData.calendar.isConnected ? (
                  <span className="ml-auto flex items-center text-sm text-green-600">
                    <CheckIcon className="mr-1 h-4 w-4" /> Connected
                  </span>
                ) : (
                  <span className="ml-auto flex items-center text-sm text-muted-foreground">
                    <CrossCircledIcon className="mr-1 h-4 w-4" /> Not connected
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}

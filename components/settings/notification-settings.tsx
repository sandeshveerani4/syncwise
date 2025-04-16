"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      dailySummary: true,
      taskAssignments: true,
      mentions: true,
      projectUpdates: false,
    },
    app: {
      taskAssignments: true,
      mentions: true,
      projectUpdates: true,
      dueDates: true,
    },
  });

  const handleToggle = (category: "email" | "app", setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof (typeof prev)[category]],
      },
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Settings Saved",
        description:
          "Your notification settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure which email notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="email-daily-summary"
              className="flex flex-col space-y-1"
            >
              <span>Daily Summary</span>
              <span className="text-xs text-muted-foreground">
                Receive a daily summary of your tasks and activities
              </span>
            </Label>
            <Switch
              id="email-daily-summary"
              checked={settings.email.dailySummary}
              onCheckedChange={() => handleToggle("email", "dailySummary")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="email-task-assignments"
              className="flex flex-col space-y-1"
            >
              <span>Task Assignments</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications when you're assigned a task
              </span>
            </Label>
            <Switch
              id="email-task-assignments"
              checked={settings.email.taskAssignments}
              onCheckedChange={() => handleToggle("email", "taskAssignments")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-mentions" className="flex flex-col space-y-1">
              <span>Mentions</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications when you're mentioned
              </span>
            </Label>
            <Switch
              id="email-mentions"
              checked={settings.email.mentions}
              onCheckedChange={() => handleToggle("email", "mentions")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="email-project-updates"
              className="flex flex-col space-y-1"
            >
              <span>Project Updates</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications about project updates
              </span>
            </Label>
            <Switch
              id="email-project-updates"
              checked={settings.email.projectUpdates}
              onCheckedChange={() => handleToggle("email", "projectUpdates")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Configure which in-app notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="app-task-assignments"
              className="flex flex-col space-y-1"
            >
              <span>Task Assignments</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications when you're assigned a task
              </span>
            </Label>
            <Switch
              id="app-task-assignments"
              checked={settings.app.taskAssignments}
              onCheckedChange={() => handleToggle("app", "taskAssignments")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="app-mentions" className="flex flex-col space-y-1">
              <span>Mentions</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications when you're mentioned
              </span>
            </Label>
            <Switch
              id="app-mentions"
              checked={settings.app.mentions}
              onCheckedChange={() => handleToggle("app", "mentions")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="app-project-updates"
              className="flex flex-col space-y-1"
            >
              <span>Project Updates</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications about project updates
              </span>
            </Label>
            <Switch
              id="app-project-updates"
              checked={settings.app.projectUpdates}
              onCheckedChange={() => handleToggle("app", "projectUpdates")}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="app-due-dates" className="flex flex-col space-y-1">
              <span>Due Dates</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications about upcoming due dates
              </span>
            </Label>
            <Switch
              id="app-due-dates"
              checked={settings.app.dueDates}
              onCheckedChange={() => handleToggle("app", "dueDates")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
}

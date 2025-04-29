"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  GitHubLogoIcon,
  ChatBubbleIcon,
  MixIcon,
  CalendarIcon,
  CheckIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

const apiKeySchema = z.object({
  key: z.string().min(1, { message: "API key is required" }),
  additionalField: z.string().optional(),
});

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  service: string;
  additionalField?: {
    name: string;
    label: string;
    description: string;
  };
  onConnect: (data: { key: string; additionalField?: string }) => void;
  onDisconnect: () => void;
}

function IntegrationCard({
  title,
  description,
  icon,
  connected,
  service,
  additionalField,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      key: "",
      additionalField: "",
    },
  });

  function onSubmit(data: z.infer<typeof apiKeySchema>) {
    onConnect(data);
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {connected ? (
            <div className="flex items-center text-sm text-green-600">
              <CheckIcon className="mr-1 h-4 w-4" /> Connected
            </div>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <CrossCircledIcon className="mr-1 h-4 w-4" /> Not connected
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Connect</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect {title}</DialogTitle>
                <DialogDescription>
                  Enter your {title} API credentials to connect your account.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={`Enter your ${title} API key`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {service === "github"
                            ? "Create a token with repo and user scopes."
                            : service === "slack"
                            ? "Create a Slack bot token from the Slack API dashboard."
                            : service === "jira"
                            ? "Create an API token from your Atlassian account settings."
                            : "Create an API key from your Google Cloud Console."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {additionalField && (
                    <FormField
                      control={form.control}
                      name="additionalField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{additionalField.label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter your ${additionalField.name}`}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {additionalField.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <DialogFooter>
                    <Button type="submit">Connect</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}

export function IntegrationSettings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState({
    github: false,
    slack: false,
    jira: false,
    calendar: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing integrations on component mount
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
  }, [toast]);

  const handleConnect = async (
    service: keyof typeof integrations,
    data: { key: string; additionalField?: string }
  ) => {
    try {
      setIsLoading(true);

      // In a real app, you would send this data to your API
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service,
          key: data.key,
          additionalData: data.additionalField,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect integration");
      }

      setIntegrations((prev) => ({ ...prev, [service]: true }));
      toast({
        title: "Integration Connected",
        description: `${
          service.charAt(0).toUpperCase() + service.slice(1)
        } has been connected successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (service: keyof typeof integrations) => {
    try {
      setIsLoading(true);

      // In a real app, you would send this request to your API
      const response = await fetch(`/api/integrations/${service}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect integration");
      }

      setIntegrations((prev) => ({ ...prev, [service]: false }));
      toast({
        title: "Integration Disconnected",
        description: `${
          service.charAt(0).toUpperCase() + service.slice(1)
        } has been disconnected.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading integrations...</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <IntegrationCard
        title="GitHub"
        description="Connect to your GitHub repositories"
        icon={<GitHubLogoIcon className="h-6 w-6" />}
        connected={integrations.github}
        service="github"
        onConnect={(data) => handleConnect("github", data)}
        onDisconnect={() => handleDisconnect("github")}
      />
      <IntegrationCard
        title="Slack"
        description="Connect to your Slack workspace"
        icon={<ChatBubbleIcon className="h-6 w-6" />}
        connected={integrations.slack}
        service="slack"
        onConnect={(data) => handleConnect("slack", data)}
        onDisconnect={() => handleDisconnect("slack")}
      />
      <IntegrationCard
        title="Jira"
        description="Connect to your Jira projects"
        icon={<MixIcon className="h-6 w-6" />}
        service="jira"
        additionalField={{
          name: "domain",
          label: "Jira Domain",
          description:
            "Enter your Jira domain (e.g., your-company.atlassian.net)",
        }}
        connected={integrations.jira}
        onConnect={(data) => handleConnect("jira", data)}
        onDisconnect={() => handleDisconnect("jira")}
      />
      <IntegrationCard
        title="Google Calendar"
        description="Connect to your Google Calendar"
        icon={<CalendarIcon className="h-6 w-6" />}
        connected={integrations.calendar}
        service="calendar"
        onConnect={(data) => handleConnect("calendar", data)}
        onDisconnect={() => handleDisconnect("calendar")}
      />
    </div>
  );
}

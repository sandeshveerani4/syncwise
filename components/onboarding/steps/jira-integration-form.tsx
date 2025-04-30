"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { MixIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  projectKey: z.string().optional(),
  domain: z.string().optional(),
  token: z.string().optional(),
  email: z.string().optional(),
});

interface JiraIntegrationFormProps {
  initialData: {
    projectKey: string;
    domain: string;
    token: string;
    email?: string;
  };
  onUpdate: (data: {
    domain: string;
    token: string;
    email: string;
    projectKey: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function JiraIntegrationForm({
  initialData,
  onUpdate,
  onNext,
  onBack,
}: JiraIntegrationFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectKey: initialData.projectKey || "",
      domain: initialData.domain || "",
      token: initialData.token || "",
      email: initialData.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.token && values.email && values.domain && values.projectKey) {
      const res = await fetch("/api/integrations", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          service: "jira",
          ...(values.token !== "Stored in DB" && { key: values.token }),
          additionalData: {
            domain: values.domain,
            email: values.email,
            projectKey: values.projectKey,
          },
        }),
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
        return;
      }

      onUpdate({
        projectKey: values.projectKey,
        domain: values.domain,
        token: values.token,
        email: values.email,
      });
    }

    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MixIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">Jira Integration</h3>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="projectKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jira Project Key</FormLabel>
              <FormControl>
                <Input placeholder="Project Key" {...field} />
              </FormControl>
              <FormDescription>
                Enter your Jira Project Key (e.g., `BTS` is the key here:
                your-company.atlassian.net/jira/software/projects/BTS)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jira Domain</FormLabel>
              <FormControl>
                <Input placeholder="your-company.atlassian.net" {...field} />
              </FormControl>
              <FormDescription>
                Enter your Jira domain (e.g., your-company.atlassian.net)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jira Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                The email address associated with your Jira account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jira API Token</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your Jira API token"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Create an API token from your{" "}
                <a
                  href="https://id.atlassian.com/manage-profile/security/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Atlassian account settings
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Continue</Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  inviteCode: z.string().min(6, {
    message: "Invite code must be at least 6 characters.",
  }),
});

export function JoinProjectForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { update: updateSession } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Call the API to join a project
      const response = await fetch("/api/projects/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: values.inviteCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join project");
      }
      const body = await response.json();

      if (body.project.id) {
        await updateSession({ projectId: body.project.id, onboarded: true });
      } else {
        throw new Error("Something went wrong");
      }

      toast({
        title: "Success!",
        description: "You've joined the project successfully.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error joining project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to join project. Please check your invite code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your invite code" {...field} />
              </FormControl>
              <FormDescription>
                Enter the invite code you received from your team or project
                administrator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Joining..." : "Join Project"}
        </Button>
      </form>
    </Form>
  );
}

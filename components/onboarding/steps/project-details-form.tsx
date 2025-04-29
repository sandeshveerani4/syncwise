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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

interface ProjectDetailsFormProps {
  initialData: {
    name: string;
    description: string;
  };
  onUpdate: (data: { name: string; description: string }) => void;
  onNext: () => void;
}

export function ProjectDetailsForm({
  initialData,
  onUpdate,
  onNext,
}: ProjectDetailsFormProps) {
  const { toast } = useToast();
  const { update: updateSession } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
    },
  });

  useEffect(() => {
    form.setValue("name", initialData.name);
    form.setValue("description", initialData.description);
  }, [initialData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({
      name: values.name,
      description: values.description || "",
    });
    const res = await fetch("/api/projects", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
      }),
      method: "POST",
    });
    if (!res.ok) {
      toast({
        title: "Error",
        description: "Failed to fetch repositories. Please try again.",
        variant: "destructive",
      });
    }
    const { project } = await res.json();
    await updateSession({ projectId: project.id });

    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description (optional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe what this project is about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JoinProjectForm } from "@/components/onboarding/join-project-form";
import { CreateProjectWizard } from "@/components/onboarding/create-project-wizard";

export function OnboardingOptions() {
  const [activeTab, setActiveTab] = useState<string>("create");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Choose an option</CardTitle>
        <CardDescription>
          Join an existing project or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="create"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join a Project</TabsTrigger>
            <TabsTrigger value="create">Create a Project</TabsTrigger>
          </TabsList>
          <TabsContent value="join" className="mt-6">
            <JoinProjectForm />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
            <CreateProjectWizard />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="/support" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

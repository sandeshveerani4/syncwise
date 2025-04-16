"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectDetailsForm } from "@/components/onboarding/steps/project-details-form";
import { GitHubIntegrationForm } from "@/components/onboarding/steps/github-integration-form";
import { JiraIntegrationForm } from "@/components/onboarding/steps/jira-integration-form";
import { SlackIntegrationForm } from "@/components/onboarding/steps/slack-integration-form";
import { ProjectSummary } from "@/components/onboarding/steps/project-summary";
import { useToast } from "@/hooks/use-toast";

type Step = "details" | "github" | "jira" | "slack" | "summary";
type ProjectData = {
  name: string;
  description: string;
  github: {
    connected: boolean;
    token: string;
    repositories: string[];
  };
  jira: {
    connected: boolean;
    domain: string;
    token: string;
    projects: string[];
  };
  slack: {
    connected: boolean;
    token: string;
    channels: string[];
  };
};

export function CreateProjectWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    github: {
      connected: false,
      token: "",
      repositories: [],
    },
    jira: {
      connected: false,
      domain: "",
      token: "",
      projects: [],
    },
    slack: {
      connected: false,
      token: "",
      channels: [],
    },
  });

  const steps: Step[] = ["details", "github", "jira", "slack", "summary"];
  const currentStepIndex = steps.indexOf(currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const updateProjectData = (data: Partial<typeof projectData>) => {
    setProjectData((prev) => ({ ...prev, ...data }));
  };

  const handleCreateProject = async () => {
    setIsLoading(true);

    try {
      // Call the API to create the project
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const data = await response.json();

      toast({
        title: "Project Created!",
        description: "Your project has been created successfully.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-muted"></div>
        <ol className="relative z-10 flex justify-between">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center justify-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        {currentStep === "details" && (
          <ProjectDetailsForm
            initialData={projectData}
            onUpdate={updateProjectData}
            onNext={goToNextStep}
          />
        )}
        {currentStep === "github" && (
          <GitHubIntegrationForm
            initialData={projectData.github}
            onUpdate={(github) => updateProjectData({ github })}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}
        {currentStep === "jira" && (
          <JiraIntegrationForm
            initialData={projectData.jira}
            onUpdate={(jira) => updateProjectData({ jira })}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}
        {currentStep === "slack" && (
          <SlackIntegrationForm
            initialData={projectData.slack}
            onUpdate={(slack) => updateProjectData({ slack })}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}
        {currentStep === "summary" && (
          <ProjectSummary
            projectData={projectData}
            onBack={goToPreviousStep}
            onSubmit={handleCreateProject}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

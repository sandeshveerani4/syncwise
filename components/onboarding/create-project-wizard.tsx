"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectDetailsForm } from "@/components/onboarding/steps/project-details-form";
import { GitHubIntegrationForm } from "@/components/onboarding/steps/github-integration-form";
import { JiraIntegrationForm } from "@/components/onboarding/steps/jira-integration-form";
import { SlackIntegrationForm } from "@/components/onboarding/steps/slack-integration-form";
import { ProjectSummary } from "@/components/onboarding/steps/project-summary";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { CalendarIntegrationForm } from "./steps/calendar-integration-form";

type Step = "details" | "github" | "jira" | "slack" | "summary" | "calendar";
type ProjectData = {
  id?: string;
  name: string;
  description: string;
  github: {
    repository: string;
    repositoryId?: number;
  };
  jira: {
    domain: string;
    token: string;
    email: string;
  };
  slack: {
    isConnected: boolean;
  };
  calendar: {
    isConnected: boolean;
  };
};

export function CreateProjectWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    github: {
      repository: "",
    },
    jira: {
      domain: "",
      token: "",
      email: "",
    },
    slack: {
      isConnected: false,
    },
    calendar: {
      isConnected: false,
    },
  });

  const { update: updateSession } = useSession();

  const steps: Step[] = [
    "details",
    "github",
    "slack",
    "calendar",
    "jira",
    "summary",
  ];
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
      const onboardResponse = await fetch("/api/user/onboard", {
        method: "POST",
      });

      if (!onboardResponse.ok) {
        console.error(
          "Failed to mark user as onboarded, but project was created"
        );
      }
      await updateSession({ onboarded: true });
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

  async function checkIfProjectCreated() {
    try {
      const res = await fetch("/api/projects/current");
      if (res.ok) {
        const body = await res.json();
        const jira = body.project.apiKeys.find(
          (x: any) => x.service === "jira"
        );
        const calendar = body.project.apiKeys.find(
          (x: any) => x.service === "calendar"
        );
        setProjectData((d) => ({
          ...d,
          id: body.project.id,
          name: body.project.name,
          description: body.project.description,
          github: {
            repository: body.project.githubRepo,
            repositoryId: body.project.additionalData?.githubRepoId ?? "",
          },
          slack: {
            isConnected:
              body.project.apiKeys.filter((x: any) => x.service === "slack")
                .length > 0,
          },
          ...(jira && {
            jira: {
              domain: jira.additionalData.domain,
              email: jira.additionalData.email,
              token: "Stored in DB",
            },
          }),
          ...(calendar && {
            calendar: {
              isConnected: true,
            },
          }),
        }));
        if (body.project.githubRepo) {
          if (
            body.project.apiKeys.length > 0 &&
            body.project.apiKeys.filter((x: any) => x.service === "slack")
          ) {
            if (jira) {
              setCurrentStep(steps[steps.indexOf("jira") + 1]);
            } else {
              setCurrentStep(steps[steps.indexOf("slack") + 1]);
            }
          } else {
            setCurrentStep(steps[steps.indexOf("github") + 1]);
          }
        } else {
          goToNextStep();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkIfProjectCreated();
  }, []);

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

      {isLoading ? (
        "Loading..."
      ) : (
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
              initialData={{ ...projectData.github, projectId: projectData.id }}
              onUpdate={(github) => updateProjectData({ github })}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
            />
          )}
          {currentStep === "calendar" && (
            <CalendarIntegrationForm
              initialData={projectData.calendar}
              onUpdate={(calendar) => updateProjectData({ calendar })}
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
      )}
    </div>
  );
}

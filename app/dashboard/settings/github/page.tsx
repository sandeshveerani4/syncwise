"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Repository {
  id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}

export default function GitHubSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string>("");
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [installationId, setInstallationId] = useState<string>("");

  useEffect(() => {
    fetchProjectSettings();
  }, []);

  const fetchProjectSettings = async () => {
    setIsLoading(true);
    try {
      // Fetch the current project settings
      const response = await fetch("/api/projects/current");

      if (!response.ok) {
        throw new Error("Failed to fetch project settings");
      }

      const data = await response.json();
      setCurrentProject(data.project);

      // Check if GitHub is connected
      if (data.project.githubOwner && data.project.githubRepo) {
        setIsConnected(true);

        // Find the GitHub API key to get the installation ID and token
        const apiKeysResponse = await fetch("/api/integrations");
        if (apiKeysResponse.ok) {
          const apiKeysData = await apiKeysResponse.json();
          const githubApiKey = apiKeysData.integrations.find(
            (i: any) => i.service === "github"
          );

          if (githubApiKey && githubApiKey.additionalData) {
            const additionalData =
              typeof githubApiKey.additionalData === "string"
                ? JSON.parse(githubApiKey.additionalData)
                : githubApiKey.additionalData;

            setInstallationId(additionalData.installationId || "");
            setSelectedRepository(additionalData.repositoryId || "");

            // Fetch repositories using the token
            if (githubApiKey.key) {
              fetchRepositories(githubApiKey.key);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching project settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch project settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepositories = async (token: string) => {
    try {
      const response = await fetch("/api/github/repositories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepositories(data.repositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRepositorySelect = (value: string) => {
    setSelectedRepository(value);
  };

  const saveRepositorySettings = async () => {
    setIsSaving(true);
    try {
      // Find the selected repository details
      const selectedRepo = repositories.find(
        (repo) => repo.id === selectedRepository
      );

      if (!selectedRepo) {
        throw new Error("Selected repository not found");
      }

      // Update the project settings
      const response = await fetch(
        `/api/projects/${currentProject.id}/github`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: selectedRepo.owner.login,
            repository: selectedRepo.name,
            repositoryId: selectedRepo.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update GitHub settings");
      }

      toast({
        title: "Success",
        description: "GitHub repository settings updated successfully.",
      });

      // Refresh the page to show updated settings
      router.refresh();
    } catch (error) {
      console.error("Error saving repository settings:", error);
      toast({
        title: "Error",
        description: "Failed to save repository settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initiateGitHubAppInstallation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/github/app-url", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get GitHub App installation URL");
      }

      const data = await response.json();

      // Redirect to GitHub for app installation
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to initiate GitHub App installation", error);
      toast({
        title: "Error",
        description: "Failed to connect to GitHub. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading="GitHub Settings"
        text="Manage your GitHub repository integration."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading GitHub settings...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <GitHubLogoIcon className="h-6 w-6" />
              <div>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  {isConnected
                    ? "Manage your connected GitHub repository"
                    : "Connect your GitHub account to track repositories"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>GitHub Connected</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Repository</h4>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">
                      {currentProject.githubOwner}/{currentProject.githubRepo}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Change Repository</h4>
                  {repositories.length > 0 ? (
                    <Select
                      onValueChange={handleRepositorySelect}
                      value={selectedRepository}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a repository" />
                      </SelectTrigger>
                      <SelectContent>
                        {repositories.map((repo) => (
                          <SelectItem key={repo.id} value={repo.id}>
                            {repo.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="rounded-lg border p-4 text-center text-muted-foreground">
                      No repositories found. Make sure you've granted access to
                      the repositories you want to use.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Connect your GitHub account to track repositories, issues, and
                  pull requests.
                </p>
                <Button
                  onClick={initiateGitHubAppInstallation}
                  disabled={isLoading}
                >
                  <GitHubLogoIcon className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
              </div>
            )}
          </CardContent>
          {isConnected && (
            <CardFooter>
              <Button
                onClick={saveRepositorySettings}
                disabled={isSaving || !selectedRepository}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}

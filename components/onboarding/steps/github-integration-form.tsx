"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}

interface GitHubIntegrationFormProps {
  initialData: {
    repository: string;
    repositoryId?: number;
    projectId?: string;
  };
  onUpdate: (data: {
    repository: string;
    repositoryId: number;
    installationId?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GitHubIntegrationForm({
  initialData,
  onUpdate,
  onNext,
  onBack,
}: GitHubIntegrationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<
    number | undefined
  >(initialData.repositoryId);
  const session = useSession();

  useEffect(() => {
    setIsLoading(true);
    checkForInstallation();
  }, []);
  async function checkForInstallation() {
    const queryParams = new URLSearchParams(window.location.search);
    const installation_id = queryParams.get("installation_id");

    try {
      if (installation_id) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        await fetchRepositories(installation_id);
      } else {
        await checkProjectThenFetch();
      }
    } finally {
      setIsLoading(false);
    }
  }

  const checkProjectThenFetch = async () => {
    const response = await fetch("/api/projects/current");
    if (response.ok) {
      const newIKey = (await response.json()).project.githubInstallationId;
      if (newIKey) {
        await fetchRepositories(newIKey);
      }
    }
  };

  const fetchRepositories = async (installation_id: string) => {
    setIsLoading(true);
    try {
      let response = await fetch(
        `/api/github/repositories?installation_id=${installation_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const data = await response.json();
      if (data.repositories.length > 0) {
        setRepositories(data.repositories);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositorySelect = (value: string) => {
    setSelectedRepository(parseInt(value));
  };

  async function onSubmit() {
    if (isConnected && selectedRepository) {
      if (!initialData.projectId) {
        return;
      }

      const selectedRepo = repositories.find(
        (repo) => repo.id === selectedRepository
      );

      if (!selectedRepo) {
        toast({
          title: "Error",
          description: "Please select a repository to continue.",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(`/api/projects/${initialData.projectId}/github`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository: selectedRepo.full_name,
          repositoryId: selectedRepo.id,
        }),
        method: "PUT",
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
        repository: selectedRepo.full_name,
        repositoryId: selectedRepo.id,
      });
    }

    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <GitHubLogoIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">GitHub Integration</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-6 rounded-lg border p-4">
          <div className="space-y-2">
            <h4 className="font-medium">Connect with GitHub App</h4>
            <p className="text-sm text-muted-foreground">
              Install our GitHub App to securely connect your repositories. This
              provides better security and more granular permissions.
            </p>
          </div>

          {session.data?.user.id && (
            <Button asChild disabled={isLoading} className="w-full sm:w-auto">
              <Link
                href={`https://github.com/apps/SyncWiseHub/installations/new?state=${session.data.user.id}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <GitHubLogoIcon className="mr-2 h-4 w-4" />
                    Install GitHub App
                  </>
                )}
              </Link>
            </Button>
          )}
        </div>
      ) : (
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
              <span>GitHub App Connected Successfully</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">
              Select a repository for this project
            </h4>
            <p className="text-sm text-muted-foreground">
              Choose one repository that you want to use with this project.
              You'll be able to track issues, pull requests, and commits from
              this repository.
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading repositories...</span>
              </div>
            ) : repositories.length > 0 ? (
              <Card>
                <CardContent className="p-4">
                  <Select
                    onValueChange={handleRepositorySelect}
                    value={selectedRepository?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {repositories.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id.toString()}>
                          {repo.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedRepository && (
                    <div className="mt-4 rounded-lg border p-3">
                      <p className="text-sm font-medium">
                        Selected Repository:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {
                          repositories.find((r) => r.id === selectedRepository)
                            ?.full_name
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border p-4 text-center text-muted-foreground">
                No repositories found. Make sure you've granted access to the
                repositories you want to use.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isConnected && !selectedRepository}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

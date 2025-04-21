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

interface Repository {
  id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
}

interface GitHubIntegrationFormProps {
  initialData: {
    connected: boolean;
    token: string;
    repositories: string[];
    owner: string;
    repository: string;
  };
  onUpdate: (data: {
    connected: boolean;
    token: string;
    repositories: string[];
    owner: string;
    repository: string;
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(initialData.connected);
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string>(
    initialData.repository || ""
  );
  const [installationId, setInstallationId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  // Check if we're returning from GitHub OAuth flow
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const installation_id = queryParams.get("installation_id");
    const setup_action = queryParams.get("setup_action");

    // Clean up URL
    if (installation_id) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // If we have an installation_id, we're returning from the GitHub App installation
    if (installation_id) {
      setInstallationId(installation_id);
      fetchAccessToken(installation_id);
    }
  }, []);

  // Fetch access token using the installation ID
  const fetchAccessToken = async (installationId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/github/token?installation_id=${installationId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const data = await response.json();
      setAccessToken(data.token);
      setIsConnected(true);

      // Fetch repositories after getting the token
      fetchRepositories(data.token);
    } catch (error) {
      console.error("Error fetching access token:", error);
      toast({
        title: "Error",
        description: "Failed to connect to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch repositories using the access token
  const fetchRepositories = async (token: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate GitHub App installation
  const initiateGitHubAppInstallation = async () => {
    setIsConnecting(true);
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
      setIsConnecting(false);
    }
  };

  const handleRepositorySelect = (value: string) => {
    setSelectedRepository(value);
  };

  function onSubmit() {
    // Find the selected repository details
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

    onUpdate({
      connected: isConnected,
      token: accessToken,
      repositories: [selectedRepository], // We're only storing the selected repository ID
      owner: selectedRepo.owner.login,
      repository: selectedRepo.name,
      installationId: installationId, // Store the installation ID for future API calls
    });
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

          <Button
            onClick={initiateGitHubAppInstallation}
            disabled={isConnecting}
            className="w-full sm:w-auto"
          >
            {isConnecting ? (
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
          </Button>
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
          disabled={!isConnected || !selectedRepository}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

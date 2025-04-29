"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface CalendarIntegrationFormProps {
  initialData: {
    isConnected: boolean;
  };
  onUpdate: (data: { isConnected: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CalendarIntegrationForm({
  initialData,
  onUpdate,
  onNext,
  onBack,
}: CalendarIntegrationFormProps) {
  const [isConnected, setIsConnected] = useState(initialData.isConnected);

  const [url, setUrl] = useState<string>();

  // Check if we're returning from OAuth flow
  useEffect(() => {
    if (!url) {
      initiateOAuth();
    }
  }, []);

  const initiateOAuth = async () => {
    try {
      const response = await fetch("/api/calendar/auth-url", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get authorization URL");
      }

      const data = await response.json();

      setUrl(data.url as string);
    } catch (error) {
      console.error("Failed to initiate OAuth flow", error);
    }
  };

  const handleContinue = () => {
    onUpdate({
      isConnected: isConnected,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">Google Calendar Integration</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-6 rounded-lg border p-4">
          <div className="space-y-2">
            <h4 className="font-medium">Connect with Google Calendar</h4>
            <p className="text-sm text-muted-foreground">
              Connect your Google Calendar to sync events and manage your
              schedule. We use OAuth to securely access your calendar without
              storing your Google password.
            </p>
          </div>

          <Button
            asChild
            onClick={initiateOAuth}
            disabled={!url}
            className="w-full sm:w-auto"
          >
            <Link href={url ?? "#"}>
              {url ? (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </>
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              )}
            </Link>
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
              <span>Google Calendar Connected Successfully</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isConnected}>
          Continue
        </Button>
      </div>
    </div>
  );
}

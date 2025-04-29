"use client";

import { Button } from "@/components/ui/button";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface SlackIntegrationFormProps {
  initialData: {
    isConnected: boolean;
  };
  onNext: () => void;
  onBack: () => void;
}

export function SlackIntegrationForm({
  initialData,
  onNext,
  onBack,
}: SlackIntegrationFormProps) {
  const session = useSession();
  function onSubmit() {
    onNext();
  }

  if (!session?.data?.user.id) {
    return "Unauthorized";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChatBubbleIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">Slack Integration</h3>
      </div>
      {initialData.isConnected ? (
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
            <span>Slack App Connected Successfully</span>
          </div>
        </div>
      ) : (
        <Button asChild>
          <Link
            href={`https://slack.com/oauth/v2/authorize?scope=app_mentions:read,assistant:write,channels:history,channels:join,channels:manage,channels:read,chat:write,chat:write.customize,chat:write.public,commands,files:read,files:write,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,mpim:history,mpim:read,mpim:write,pins:read,pins:write,reactions:read,reactions:write,reminders:read,reminders:write,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:write&client_id=8735187721536.8698721469175&state=${session.data.user.id}`}
          >
            Add to Slack
          </Link>
        </Button>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>Continue</Button>
      </div>
    </div>
  );
}

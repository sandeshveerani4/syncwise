import type { Metadata } from "next";
import { format } from "date-fns";
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
import {
  CalendarIcon,
  Users,
  ExternalLink,
  Video,
  CheckSquare,
  FileText,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CreateMeetingButton } from "@/components/meetings/create-meeting-button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  title: "Meetings | SyncWise AI",
  description: "Manage your meetings and video conferences",
};
interface Task {
  id: string;
  key: string;
  self: string;
}

export default async function MeetingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch meetings for the current user
  const meetings = await prisma.meeting.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      creation_date: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Meetings"
        text="Schedule and manage your meetings and video conferences."
      >
        <CreateMeetingButton />
      </DashboardHeader>

      <div className="grid gap-6">
        {meetings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No meetings yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You haven't created any meetings yet. Click the button below to
                schedule your first meeting.
              </p>
              <CreateMeetingButton />
            </CardContent>
          </Card>
        ) : (
          meetings.map((meeting) => {
            // Parse tasks and bot_data
            const tasks = meeting.tasks as unknown as Task[];
            const botData: any = meeting.bot_data;
            const hasTasks = Array.isArray(tasks) && tasks.length > 0;
            const hasBotState = botData && botData.state;
            const meetingSummary =
              meeting.summary || "No summary available for this meeting yet.";

            return (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{meeting.name}</CardTitle>
                    {meeting.meeting_id && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={meeting.meeting_id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Meeting ID: {meeting.meeting_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Created:{" "}
                        {format(new Date(meeting.creation_date), "PPP")}
                      </span>
                    </div>
                    {meeting.end_date && (
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          End: {format(new Date(meeting.end_date), "PPP")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bot State */}
                  {hasBotState && (
                    <div className="flex gap-2 mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center mb-2">
                        <Video className="mr-2 h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Bot State:</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {botData.state}
                      </p>
                    </div>
                  )}

                  {/* Tasks */}
                  {hasTasks && (
                    <div className="mt-4">
                      <div className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-1">Tasks:</p>
                          <div className="text-sm">
                            <ul className="list-disc pl-5 space-y-1">
                              {tasks.map((task: Task, index: number) => {
                                try {
                                  const domain = new URL(task.self);
                                  return (
                                    <li key={index}>
                                      <Link
                                        href={
                                          domain.origin + `/browse/${task.key}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        {task.key}
                                      </Link>
                                    </li>
                                  );
                                } catch (e) {
                                  console.error("Error rendering task:", e);
                                  return null;
                                }
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="summary" className="border-b-0">
                        <AccordionTrigger className="py-2 text-sm font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            Meeting Summary
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="rounded-md bg-muted p-3 text-sm">
                            <Markdown>{meetingSummary}</Markdown>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Attendees */}
                  {meeting.attendees && meeting.attendees.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-start">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-1">Attendees:</p>
                          <div className="text-sm text-muted-foreground">
                            <ul className="list-disc pl-5">
                              {meeting.attendees.map((attendee, index) => (
                                <li key={index}>{attendee}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

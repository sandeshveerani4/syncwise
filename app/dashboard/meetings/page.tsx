import type { Metadata } from "next";
import { format } from "date-fns";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Users, ExternalLink, Video } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CreateMeetingButton } from "@/components/meetings/create-meeting-button";

export const metadata: Metadata = {
  title: "Meetings | SyncWise AI",
  description: "Manage your meetings and video conferences",
};

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
          meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{meeting.name}</CardTitle>
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
                      Created: {format(new Date(meeting.creation_date), "PPP")}
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
                <div className="mt-4">
                  <div className="flex items-start">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium mb-1">Attendees:</p>
                      <div className="text-sm text-muted-foreground">
                        {meeting.attendees.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {meeting.attendees.map((attendee, index) => (
                              <li key={index}>{attendee}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No attendees</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

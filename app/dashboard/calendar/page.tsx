import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "@radix-ui/react-icons"

export const metadata: Metadata = {
  title: "Calendar | SyncWise AI",
  description: "Manage your Calendar integration",
}

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader heading="Calendar Integration" text="Manage your meetings, events, and calendar settings.">
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>View and manage your upcoming calendar events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {i === 0 ? "Team Standup" : i === 1 ? "Product Review" : "Client Meeting"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0
                          ? "Today, 10:00 AM - 10:30 AM"
                          : i === 1
                            ? "Tomorrow, 2:00 PM - 3:00 PM"
                            : "Friday, 11:00 AM - 12:00 PM"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "5 participants" : i === 1 ? "8 participants" : "3 participants"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Meetings</CardTitle>
              <CardDescription>View summaries and action items from past meetings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {i === 0 ? "Sprint Planning" : i === 1 ? "Design Review" : "Stakeholder Update"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0
                          ? "Yesterday, 9:00 AM - 10:30 AM"
                          : i === 1
                            ? "Monday, 3:00 PM - 4:00 PM"
                            : "Last Friday, 2:00 PM - 3:00 PM"}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                          {i === 0 ? "3 action items" : i === 1 ? "5 action items" : "2 action items"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Summary
                      </Button>
                      <Button variant="outline" size="sm">
                        Tasks
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Settings</CardTitle>
              <CardDescription>Configure your calendar integration settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Meeting Summaries</p>
                    <p className="text-xs text-muted-foreground">Automatically generate summaries after meetings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Task Creation</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically create tasks from meeting action items
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Calendar Sync</p>
                    <p className="text-xs text-muted-foreground">Sync with Google Calendar every 15 minutes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

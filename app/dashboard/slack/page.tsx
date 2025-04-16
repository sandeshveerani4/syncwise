import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatBubbleIcon } from "@radix-ui/react-icons"

export const metadata: Metadata = {
  title: "Slack | SyncWise AI",
  description: "Manage your Slack integration",
}

export default function SlackPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader heading="Slack Integration" text="Manage your Slack channels, messages, and notifications.">
        <Button>
          <ChatBubbleIcon className="mr-2 h-4 w-4" />
          Connect Channel
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="messages" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>View and manage important Slack messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">@johndoe in #general</p>
                      <p className="text-xs text-muted-foreground">Can someone review the latest design changes?</p>
                      <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Convert to Task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="channels" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Channels</CardTitle>
              <CardDescription>Manage your connected Slack channels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        #{i === 0 ? "general" : i === 1 ? "random" : "project-updates"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0
                          ? "Company-wide announcements"
                          : i === 1
                            ? "Random discussions"
                            : "Project updates and notifications"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive Slack notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Direct Messages</p>
                    <p className="text-xs text-muted-foreground">Get notified for all direct messages</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Mentions</p>
                    <p className="text-xs text-muted-foreground">Get notified when someone mentions you</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">Channel Messages</p>
                    <p className="text-xs text-muted-foreground">Get notified for all messages in selected channels</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disabled
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

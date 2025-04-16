import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MixIcon } from "@radix-ui/react-icons"

export const metadata: Metadata = {
  title: "Jira | SyncWise AI",
  description: "Manage your Jira integration",
}

export default function JiraPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader heading="Jira Integration" text="Manage your Jira projects, tickets, and sprints.">
        <Button>
          <MixIcon className="mr-2 h-4 w-4" />
          Connect Project
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
              <CardDescription>View and manage your assigned Jira tickets.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mr-2">
                          {i === 0 ? "TASK" : i === 1 ? "BUG" : "FEATURE"}
                        </span>
                        <p className="text-sm font-medium">
                          {i === 0
                            ? "Update user authentication flow"
                            : i === 1
                              ? "Fix login page responsiveness"
                              : "Add dark mode support"}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "High priority" : i === 1 ? "Medium priority" : "Low priority"} • Due in {i + 1} days
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Projects</CardTitle>
              <CardDescription>Manage your connected Jira projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {i === 0 ? "Marketing Website" : i === 1 ? "Mobile App" : "Backend API"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "10 open tickets" : i === 1 ? "15 open tickets" : "8 open tickets"}
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
        <TabsContent value="sprints" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sprints</CardTitle>
              <CardDescription>View and manage your active Jira sprints.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {i === 0 ? "Sprint 24: UI Improvements" : "Sprint 25: Performance Optimization"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 0
                          ? "Ends in 5 days • 8/12 tickets completed"
                          : "Starts in 6 days • 0/10 tickets completed"}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: i === 0 ? "66%" : "0%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

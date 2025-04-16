import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export const metadata: Metadata = {
  title: "GitHub | SyncWise AI",
  description: "Manage your GitHub integration",
}

export default function GitHubPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader heading="GitHub Integration" text="Manage your GitHub repositories, issues, and pull requests.">
        <Button>
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          Connect Repository
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
        </TabsList>
        <TabsContent value="issues" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Issues</CardTitle>
              <CardDescription>View and manage your open GitHub issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Issue #{i + 1}: Update authentication flow</p>
                      <p className="text-xs text-muted-foreground">Opened 2 days ago by johndoe</p>
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
        <TabsContent value="pull-requests" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Pull Requests</CardTitle>
              <CardDescription>View and manage your open GitHub pull requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">PR #{i + 1}: Add new dashboard features</p>
                      <p className="text-xs text-muted-foreground">Opened 1 day ago by janedoe</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="repositories" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Repositories</CardTitle>
              <CardDescription>Manage your connected GitHub repositories.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">organization/repo-{i + 1}</p>
                      <p className="text-xs text-muted-foreground">Last updated 3 hours ago</p>
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
      </Tabs>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function GitHubCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <GitHubLogoIcon className="h-8 w-8" />
        <div>
          <CardTitle>GitHub</CardTitle>
          <CardDescription>Connected</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Open Pull Requests</div>
              <div className="text-sm font-medium">3</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Open Issues</div>
              <div className="text-sm font-medium">8</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Recent Commits</div>
              <div className="text-sm font-medium">12</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MixIcon } from "@radix-ui/react-icons"

export function JiraCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <MixIcon className="h-8 w-8" />
        <div>
          <CardTitle>Jira</CardTitle>
          <CardDescription>Not Connected</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-muted-foreground">Connect your Jira account to view and manage tickets.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Connect Jira</Button>
      </CardFooter>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "@radix-ui/react-icons"

export function CalendarCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <CalendarIcon className="h-8 w-8" />
        <div>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>Connected</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Today's Events</div>
              <div className="text-sm font-medium">2</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Upcoming Events</div>
              <div className="text-sm font-medium">5</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Next Event</div>
              <div className="text-sm font-medium">1h 30m</div>
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

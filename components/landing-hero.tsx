import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Seamless Workflow Integration with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Centralize your workflow across GitHub, Slack, Jira, and Google Calendar with AI-powered task
                automation.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg shadow-2xl opacity-90"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-6 w-[80%] h-[80%] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">SyncWise Dashboard</div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="text-xs font-medium mb-2">GitHub Issues</div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="text-xs font-medium mb-2">Jira Tickets</div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="text-xs font-medium mb-2">Slack Messages</div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="text-xs font-medium mb-2">Calendar Events</div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

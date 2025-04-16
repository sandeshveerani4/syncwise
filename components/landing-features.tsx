import {
  GitHubLogoIcon,
  CalendarIcon,
  ChatBubbleIcon,
  MixIcon,
  RocketIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons"

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">All-in-One Integration</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SyncWise AI brings all your tools together in one place, powered by AI to automate your workflow.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <GitHubLogoIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">GitHub Integration</h3>
            <p className="text-center text-muted-foreground">
              Manage issues, pull requests, and code reviews without leaving the app.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ChatBubbleIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Slack Integration</h3>
            <p className="text-center text-muted-foreground">
              Stay on top of important conversations and turn messages into tasks.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MixIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Jira Integration</h3>
            <p className="text-center text-muted-foreground">
              Track and manage tickets across projects in a unified interface.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Calendar Integration</h3>
            <p className="text-center text-muted-foreground">
              Schedule meetings and convert discussions into actionable tasks.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <RocketIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Automation</h3>
            <p className="text-center text-muted-foreground">
              Let AI handle routine tasks and suggest actions based on your workflow.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LightningBoltIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Meeting Insights</h3>
            <p className="text-center text-muted-foreground">
              Automatically capture meeting notes and convert them into tasks.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

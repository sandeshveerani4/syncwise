import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { OnboardingOptions } from "@/components/onboarding/onboarding-options"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Get Started | SyncWise AI",
  description: "Join or create a project to get started with SyncWise AI",
}

export default async function OnboardingPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to SyncWise AI</h1>
          <p className="text-muted-foreground">Get started by joining or creating a project</p>
        </div>
        <OnboardingOptions />
      </div>
    </div>
  )
}

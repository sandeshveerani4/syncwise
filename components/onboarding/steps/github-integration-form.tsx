"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  token: z.string().min(1, {
    message: "GitHub token is required.",
  }),
  repositories: z.array(z.string()).optional(),
})

interface GitHubIntegrationFormProps {
  initialData: {
    connected: boolean
    token: string
    repositories: string[]
  }
  onUpdate: (data: { connected: boolean; token: string; repositories: string[] }) => void
  onNext: () => void
  onBack: () => void
}

export function GitHubIntegrationForm({ initialData, onUpdate, onNext, onBack }: GitHubIntegrationFormProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(initialData.connected)
  const [repositories, setRepositories] = useState<{ id: string; name: string }[]>([
    { id: "repo1", name: "organization/repo-1" },
    { id: "repo2", name: "organization/repo-2" },
    { id: "repo3", name: "organization/repo-3" },
  ])
  const [selectedRepos, setSelectedRepos] = useState<string[]>(initialData.repositories || [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: initialData.token || "",
      repositories: initialData.repositories || [],
    },
  })

  async function connectGitHub(values: z.infer<typeof formSchema>) {
    setIsConnecting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate the token and fetch repositories
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect to GitHub", error)
    } finally {
      setIsConnecting(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({
      connected: isConnected,
      token: values.token,
      repositories: selectedRepos,
    })
    onNext()
  }

  function toggleRepository(repoId: string) {
    setSelectedRepos((prev) => (prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <GitHubLogoIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">GitHub Integration</h3>
      </div>

      {!isConnected ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(connectGitHub)} className="space-y-6 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Personal Access Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your GitHub token" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create a token with <code>repo</code> and <code>user</code> scopes.{" "}
                    <a
                      href="https://github.com/settings/tokens/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Generate token
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect GitHub"}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>GitHub Connected Successfully</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Select repositories to sync</h4>
            <div className="space-y-2">
              {repositories.map((repo) => (
                <Card key={repo.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={repo.id}
                        checked={selectedRepos.includes(repo.id)}
                        onCheckedChange={() => toggleRepository(repo.id)}
                      />
                      <label
                        htmlFor={repo.id}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {repo.name}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={!isConnected}>
          Continue
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MixIcon } from "@radix-ui/react-icons"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Jira domain is required.",
  }),
  token: z.string().min(1, {
    message: "Jira API token is required.",
  }),
  projects: z.array(z.string()).optional(),
})

interface JiraIntegrationFormProps {
  initialData: {
    connected: boolean
    domain: string
    token: string
    projects: string[]
  }
  onUpdate: (data: { connected: boolean; domain: string; token: string; projects: string[] }) => void
  onNext: () => void
  onBack: () => void
}

export function JiraIntegrationForm({ initialData, onUpdate, onNext, onBack }: JiraIntegrationFormProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(initialData.connected)
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([
    { id: "proj1", name: "Marketing Website" },
    { id: "proj2", name: "Mobile App" },
    { id: "proj3", name: "Backend API" },
  ])
  const [selectedProjects, setSelectedProjects] = useState<string[]>(initialData.projects || [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: initialData.domain || "",
      token: initialData.token || "",
      projects: initialData.projects || [],
    },
  })

  async function connectJira(values: z.infer<typeof formSchema>) {
    setIsConnecting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate the credentials and fetch projects
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect to Jira", error)
    } finally {
      setIsConnecting(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({
      connected: isConnected,
      domain: values.domain,
      token: values.token,
      projects: selectedProjects,
    })
    onNext()
  }

  function toggleProject(projectId: string) {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MixIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">Jira Integration</h3>
      </div>

      {!isConnected ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(connectJira)} className="space-y-6 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jira Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="your-company.atlassian.net" {...field} />
                  </FormControl>
                  <FormDescription>Enter your Jira domain (e.g., your-company.atlassian.net)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jira API Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your Jira API token" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create an API token from your{" "}
                    <a
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Atlassian account settings
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Jira"}
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
              <span>Jira Connected Successfully</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Select projects to sync</h4>
            <div className="space-y-2">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={project.id}
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => toggleProject(project.id)}
                      />
                      <label
                        htmlFor={project.id}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {project.name}
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

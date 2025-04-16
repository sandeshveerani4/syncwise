"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  token: z.string().min(1, {
    message: "Slack token is required.",
  }),
  channels: z.array(z.string()).optional(),
})

interface SlackIntegrationFormProps {
  initialData: {
    connected: boolean
    token: string
    channels: string[]
  }
  onUpdate: (data: { connected: boolean; token: string; channels: string[] }) => void
  onNext: () => void
  onBack: () => void
}

export function SlackIntegrationForm({ initialData, onUpdate, onNext, onBack }: SlackIntegrationFormProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(initialData.connected)
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([
    { id: "channel1", name: "general" },
    { id: "channel2", name: "random" },
    { id: "channel3", name: "project-updates" },
  ])
  const [selectedChannels, setSelectedChannels] = useState<string[]>(initialData.channels || [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: initialData.token || "",
      channels: initialData.channels || [],
    },
  })

  async function connectSlack(values: z.infer<typeof formSchema>) {
    setIsConnecting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate the token and fetch channels
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect to Slack", error)
    } finally {
      setIsConnecting(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({
      connected: isConnected,
      token: values.token,
      channels: selectedChannels,
    })
    onNext()
  }

  function toggleChannel(channelId: string) {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChatBubbleIcon className="h-6 w-6" />
        <h3 className="text-lg font-medium">Slack Integration</h3>
      </div>

      {!isConnected ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(connectSlack)} className="space-y-6 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack Bot Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your Slack bot token" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create a Slack app and get a bot token from the{" "}
                    <a
                      href="https://api.slack.com/apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Slack API dashboard
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Slack"}
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
              <span>Slack Connected Successfully</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Select channels to monitor</h4>
            <div className="space-y-2">
              {channels.map((channel) => (
                <Card key={channel.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={channel.id}
                        checked={selectedChannels.includes(channel.id)}
                        onCheckedChange={() => toggleChannel(channel.id)}
                      />
                      <label
                        htmlFor={channel.id}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        #{channel.name}
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

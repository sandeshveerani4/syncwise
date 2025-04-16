"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DashboardIcon,
  GitHubLogoIcon,
  ChatBubbleIcon,
  MixIcon,
  CalendarIcon,
  GearIcon,
  ExitIcon,
  HamburgerMenuIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: DashboardIcon,
      exact: true,
    },
    {
      href: "/dashboard/github",
      label: "GitHub",
      icon: GitHubLogoIcon,
    },
    {
      href: "/dashboard/slack",
      label: "Slack",
      icon: ChatBubbleIcon,
    },
    {
      href: "/dashboard/jira",
      label: "Jira",
      icon: MixIcon,
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: CalendarIcon,
    },
    {
      href: "/dashboard/ai",
      label: "AI Assistant",
      icon: RocketIcon,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: GearIcon,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <HamburgerMenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="font-bold">SyncWise AI</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {routes.map((route) => {
              const isActive = route.exact ? pathname === route.href : pathname.startsWith(route.href)

              return (
                <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActive ? "bg-muted font-medium" : "font-normal")}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={() => {
                setOpen(false)
                signOut({ callbackUrl: "/" })
              }}
            >
              <ExitIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

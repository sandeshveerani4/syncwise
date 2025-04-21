"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DashboardIcon,
  GitHubLogoIcon,
  ChatBubbleIcon,
  MixIcon,
  CalendarIcon,
  GearIcon,
  ExitIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";

export function DashboardNav() {
  const pathname = usePathname();

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
    {
      href: "/dashboard/settings/github",
      label: "GitHub Settings",
      icon: GitHubLogoIcon,
      parent: "/dashboard/settings", // This indicates it's a child of the Settings page
    },
  ];

  return (
    <nav className="grid items-start gap-2 p-2">
      {routes.map((route) => {
        const isActive = route.exact
          ? pathname === route.href
          : pathname.startsWith(route.href);

        return (
          <Link key={route.href} href={route.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive ? "bg-muted font-medium" : "font-normal"
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Button>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <ExitIcon className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}

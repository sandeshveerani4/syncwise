"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DashboardIcon,
  GearIcon,
  ExitIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Video } from "lucide-react";

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
      href: "/dashboard/ai",
      label: "AI Assistant",
      icon: RocketIcon,
    },
    {
      href: "/dashboard/meetings",
      label: "Meetings",
      icon: Video,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: GearIcon,
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardIcon, RocketIcon } from "@radix-ui/react-icons";
import { Video } from "lucide-react";

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
  ];

  return (
    <nav className="hidden items-center gap-2 p-2 lg:flex">
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
    </nav>
  );
}

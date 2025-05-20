import type React from "react";
import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard | SyncWise AI",
  description: "Manage your integrations and workflow",
};

export default async function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MobileNav buttonClass="fixed bg-neutral-500/50 left-4 top-2 z-10 p-2 h-8 !flex backdrop-blur-lg" />
      {/* <SidebarProvider className="flex-1">{children}</SidebarProvider> */}
      {children}
    </div>
  );
}

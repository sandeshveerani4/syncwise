import type React from "react";
import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AiChatSidebar } from "@/components/ai/ai-chat-sidebar";

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
    <div className="flex h-screen">
      {/* <MobileNav buttonClass="fixed bg-neutral-500/50 left-4 top-2 z-10 p-2 h-8 !flex backdrop-blur-lg" /> */}
      <AiChatSidebar />
      {/* <SidebarProvider className="flex-1">{children}</SidebarProvider> */}
      <div className="flex-1 flex flex-col md:ml-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}

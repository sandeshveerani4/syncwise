import type React from "react";
import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | SyncWise AI",
  description: "Manage your integrations and workflow",
};

export default async function DashboardLayout({
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
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-2 px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/dashboard" className="flex items-center">
              <span className="font-bold text-xl">SyncWise AI</span>
            </Link>
          </div>
          <UserNav user={session.user} />
        </div>
      </header>
      <div className="container flex-1 grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] mx-auto py-4 px-4 md:px-6">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

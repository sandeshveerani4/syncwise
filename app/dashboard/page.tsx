import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CreateMeetingButton } from "@/components/meetings/create-meeting-button";

export const metadata: Metadata = {
  title: "Dashboard | SyncWise AI",
  description: "Manage your integrations and workflow",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading={`Welcome, ${session.user.name || "there"}!`}
        text="Manage your integrations and workflow with SyncWise AI."
      >
        <CreateMeetingButton />
      </DashboardHeader>

      <DashboardTabs />
    </div>
  );
}

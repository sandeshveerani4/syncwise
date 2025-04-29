import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { IntegrationSettings } from "@/components/settings/integration-settings";

export const metadata: Metadata = {
  title: "Settings | SyncWise AI",
  description: "Manage your account and application settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading="Settings"
        text="Manage your account and application preferences."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 mt-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

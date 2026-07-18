import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata("Settings", "Manage profile information, account security, and notification preferences.");

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Optimize your author profile for discoverability.</CardDescription>
          </CardHeader>
          <div className="grid gap-4">
            <Input placeholder="Display name" />
            <Input placeholder="Bio" />
            <Input placeholder="Location" />
            <Button className="rounded-full">Save profile</Button>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage password, 2FA, and session controls.</CardDescription>
          </CardHeader>
          <div className="grid gap-4">
            <Input placeholder="New password" type="password" />
            <Input placeholder="Confirm password" type="password" />
            <Button className="rounded-full">Update security</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

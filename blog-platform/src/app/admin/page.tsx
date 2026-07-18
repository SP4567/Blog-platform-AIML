"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadBlogState } from "@/lib/blog-state";

export default function AdminPage() {
  const [state, setState] = useState(() => loadBlogState());

  useEffect(() => {
    setState(loadBlogState());
  }, []);

  const pendingReviews = useMemo(() => state.moderationQueue.filter((item) => item.status === "pending").length, [state.moderationQueue]);
  const unread = useMemo(() => state.notifications.filter((item) => item.unread).length, [state.notifications]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage authors, editors, moderators, and administrators.</CardDescription>
          </CardHeader>
          <p className="text-sm text-slate-600">Role-based permissions and audit logs are wired into the platform service layer.</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
            <CardDescription>Review reports, comments, and escalation queues.</CardDescription>
          </CardHeader>
          <p className="text-sm text-slate-600">{pendingReviews} pending review(s) and {unread} unread alert(s).</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Site settings</CardTitle>
            <CardDescription>Manage SEO metadata, newsletter providers, and feature flags.</CardDescription>
          </CardHeader>
          <p className="text-sm text-slate-600">Centralized settings make rollout and iteration safe.</p>
        </Card>
      </div>
    </div>
  );
}

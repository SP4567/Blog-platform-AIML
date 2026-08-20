"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadBlogState } from "@/lib/blog-state";

export default function NotificationsPage() {
  const [notifications] = useState(() => loadBlogState().notifications);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Real-time updates, follower actions, and moderation alerts appear here.</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">No notifications yet.</div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span>{notification.title}</span>
                  {notification.unread ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">New</span> : null}
                </div>
                <p className="mt-2 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

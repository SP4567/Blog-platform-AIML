"use client";

import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadBlogState } from "@/lib/blog-state";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [state, setState] = useState(() => loadBlogState());

  useEffect(() => {
    setState(loadBlogState());
  }, []);

  const published = useMemo(() => state.posts.filter((post) => post.status === "published" || post.status === "scheduled").length, [state.posts]);
  const drafts = useMemo(() => state.posts.filter((post) => post.status === "draft").length, [state.posts]);
  const readers = useMemo(() => state.posts.reduce((sum, post) => sum + (post.views ?? 0), 0), [state.posts]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publishing overview</CardTitle>
            <CardDescription>Momentum, draft progress, and audience health at a glance.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Published</p><p className="mt-2 text-2xl font-semibold text-slate-950">{published}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Drafts</p><p className="mt-2 text-2xl font-semibold text-slate-950">{drafts}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Readers</p><p className="mt-2 text-2xl font-semibold text-slate-950">{readers.toLocaleString()}</p></div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to the main editorial workflows.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/posts" className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 hover:bg-slate-50">Create and manage posts</Link>
            <Link href="/dashboard/settings" className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 hover:bg-slate-50">Update profile and settings</Link>
            <Link href="/admin" className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 hover:bg-slate-50">Open administration</Link>
          </div>
        </Card>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {state.posts.slice(0, 2).map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.category.name}</CardDescription>
            </CardHeader>
            <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

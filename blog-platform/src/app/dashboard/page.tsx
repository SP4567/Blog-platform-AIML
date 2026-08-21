"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { Post } from "@/lib/types";
import { PenSquare, BookOpen, Settings, ShieldCheck, Heart, Eye } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;
    fetch(`/api/posts?authorId=${user.id}&status=all&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.ok) {
          setPosts(data.posts ?? []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes ?? 0), 0);

  const isAdmin = user?.role === "administrator" || user?.role === "super_admin";

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Welcome back, {user?.name ?? "Author"}</h1>
          </div>
          <Button
              asChild
              className="rounded-full gap-3 bg-slate-950 px-5 py-6 text-sm font-medium text-white hover:bg-slate-900"
            >
              <Link
                href="/dashboard/posts/new"
                className="flex items-center gap-2 text-white"
              >
                <PenSquare className="h-4 w-4 shrink-0" />
                <span>Create new story</span>
              </Link>
            </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Author Performance</CardTitle>
              <CardDescription>Published stories, draft pipeline, and reader engagement metrics.</CardDescription>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-4 pt-1">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Published</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{publishedCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Drafts</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{draftCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Views</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{totalViews.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Likes</p>
                <p className="mt-2 text-2xl font-bold text-rose-600">{totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Jump into writing and management workspaces.</CardDescription>
            </CardHeader>
            <div className="flex flex-col gap-3 pt-1">
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>Manage all stories & drafts</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <Settings className="h-4 w-4 text-slate-500" />
                <span>Profile & security settings</span>
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-900 p-3.5 text-sm font-medium text-white hover:bg-slate-800 transition"
                >
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Administration Portal</span>
                </Link>
              ) : null}
            </div>
          </Card>
        </div>

        {/* Recent Posts Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-950">Recent Articles</h2>
            <Link href="/dashboard/posts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              View all ({posts.length})
            </Link>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading your stories…</p>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <p className="text-base font-medium text-slate-700">No stories created yet</p>
              <p className="text-sm text-slate-500 mt-1">Start writing your first technical essay or architecture breakdown.</p>
              <Button asChild className="mt-4 rounded-full bg-slate-950 px-5 py-6 text-sm font-medium text-white hover:bg-slate-900">
                <Link href="/dashboard/posts/new" className="text-white">Create story</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.slice(0, 4).map((post) => (
                <Card key={post.id} className="flex flex-col justify-between">
                  <div>
                    <CardHeader className="space-y-2 mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-slate-400">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-rose-500" /> {post.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/post/${post.slug}`} className="font-medium text-slate-700 hover:underline">
                        View
                      </Link>
                      <span>•</span>
                      <Link href={`/dashboard/posts/${post.id}/edit`} className="font-medium text-slate-900 hover:underline">
                        Edit
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

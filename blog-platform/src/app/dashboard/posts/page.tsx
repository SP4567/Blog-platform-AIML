"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { Post } from "@/lib/types";
import { PenSquare, Trash2, Eye, Edit3, Loader2 } from "lucide-react";

export default function PostManagerPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    fetch(`/api/posts?authorId=${user.id}&status=all&limit=50`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.ok) {
          setPosts(data.posts ?? []);
        }
      })
      .catch(() => {
        if (isMounted) setPosts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    setDeletingId(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert(data.error ?? "Failed to delete post.");
      }
    } catch {
      alert("Network error while deleting post.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Manage Stories</h1>
          </div>
          <Button
            asChild
            className="rounded-full gap-3 bg-slate-950 px-5 py-6 text-sm font-medium text-white hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-2 text-white"
            >
              <PenSquare className="h-4 w-4 shrink-0" />
              <span>New story</span>
            </Link>
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          {(["all", "published", "draft"] as const).map((tab) => {
            const count = tab === "all" ? posts.length : posts.filter((p) => p.status === tab).length;
            const isSelected = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  isSelected
                    ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Post Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
              <span>Loading your stories…</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
              <p className="text-base font-medium text-slate-700 dark:text-slate-300">No stories found in this tab</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new post or change your filter.</p>
              <Button asChild className="mt-4 rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">
                <Link href="/dashboard/posts/new" className="text-white">Write a story</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="flex flex-col justify-between">
                  <div>
                    <CardHeader className="space-y-2 mb-3">
                      {/* Status + read time */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                              post.status === "published"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border dark:border-amber-800"
                            }`}
                          >
                            {post.status}
                          </span>

                          <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <CardTitle className="min-w-0 line-clamp-1 text-lg">
                        {post.title}
                      </CardTitle>

                      {/* Excerpt */}
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>{post.views} views</span>
                      <span>{post.likes ?? 0} likes</span>
                      <span>{post.comments ?? 0} comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full px-3"
                      >
                        <Link
                          href={`/post/${post.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 whitespace-nowrap"
                        >
                          <Eye className="h-3.5 w-3.5 shrink-0" />
                          <span>View</span>
                        </Link>
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="h-8 rounded-full px-3 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                      >
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="flex items-center gap-1 whitespace-nowrap"
                        >
                          <Edit3 className="h-3.5 w-3.5 shrink-0" />
                          <span>Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === post.id}
                        onClick={() => handleDelete(post.id)}
                        className="rounded-full h-8 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-800"
                        aria-label="Delete story"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

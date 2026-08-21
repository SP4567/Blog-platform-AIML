"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { Post } from "@/lib/types";
import { Users, FileText, BarChart3, Trash2, Eye, Loader2, ShieldCheck } from "lucide-react";

interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalComments: number;
  totalSubscribers: number;
  totalMessages: number;
  totalViews: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "users" | "posts">("overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/admin/analytics").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/posts?status=all&limit=50").then((r) => r.json()),
    ])
      .then(([analyticsData, usersData, postsData]) => {
        if (!isMounted) return;
        if (analyticsData.ok) setStats(analyticsData.stats);
        if (usersData.ok) setUsers(usersData.users ?? []);
        if (postsData.ok) setAllPosts(postsData.posts ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    setActionLoading(targetUserId);
    try {
      const res = await fetch(`/api/admin/users/${targetUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u)),
        );
      } else {
        alert(data.error ?? "Failed to change role.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (targetUserId: string) => {
    if (targetUserId === user?.id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user and all their stories?")) {
      return;
    }

    setActionLoading(targetUserId);
    try {
      const res = await fetch(`/api/admin/users/${targetUserId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== targetUserId));
      } else {
        alert(data.error ?? "Failed to delete user.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this story as an administrator?")) {
      return;
    }

    setActionLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setAllPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert(data.error ?? "Failed to delete post.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="administrator">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Administration</p>
            </div>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Platform Control Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === "overview"
                ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Overview
          </button>
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === "users"
                ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" /> User Management ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("posts")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === "posts"
                ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" /> Content Moderation ({allPosts.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
            <span>Loading administrative data…</span>
          </div>
        ) : (
          <div>
            {/* OVERVIEW TAB */}
            {tab === "overview" && stats ? (
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-1">
                      <CardDescription>Total Stories</CardDescription>
                      <CardTitle className="text-3xl font-bold">{stats.totalPosts}</CardTitle>
                    </CardHeader>
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      {stats.publishedPosts} published • {stats.draftPosts} drafts
                    </div>
                  </Card>

                  <Card>
                    <CardHeader className="pb-1">
                      <CardDescription>Total Users</CardDescription>
                      <CardTitle className="text-3xl font-bold">{stats.totalUsers}</CardTitle>
                    </CardHeader>
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      Registered authors & readers
                    </div>
                  </Card>

                  <Card>
                    <CardHeader className="pb-1">
                      <CardDescription>Cumulative Views</CardDescription>
                      <CardTitle className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      Reader impressions across site
                    </div>
                  </Card>

                  <Card>
                    <CardHeader className="pb-1">
                      <CardDescription>Engagement</CardDescription>
                      <CardTitle className="text-3xl font-bold">{stats.totalComments}</CardTitle>
                    </CardHeader>
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      {stats.totalSubscribers} newsletter subscribers
                    </div>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent User Signups</CardTitle>
                      <CardDescription>Latest accounts registered on the platform.</CardDescription>
                    </CardHeader>
                    <div className="space-y-3 pt-1">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-sm">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{u.name ?? "User"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System & Operations Health</CardTitle>
                      <CardDescription>Database connection and runtime status.</CardDescription>
                    </CardHeader>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Database Engine</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span> SQLite (Healthy)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Password Security</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">bcrypt (10 Salt Rounds)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Session Cookie Policy</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">HTTP-Only, SameSite Lax</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : null}

            {/* USERS TAB */}
            {tab === "users" ? (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Articles</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900 dark:text-white">{u.name ?? "Unnamed"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              disabled={actionLoading === u.id}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                            >
                              <option value="visitor">Visitor</option>
                              <option value="registered_user">Registered User</option>
                              <option value="author">Author</option>
                              <option value="editor">Editor</option>
                              <option value="moderator">Moderator</option>
                              <option value="administrator">Administrator</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 font-medium">{u._count?.posts ?? 0}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoading === u.id || u.id === user?.id}
                              onClick={() => handleDeleteUser(u.id)}
                              className="rounded-full h-8 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-800"
                              aria-label="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {/* POSTS TAB */}
            {tab === "posts" ? (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Title & Author</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Views</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {allPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{post.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{post.author?.name ?? "Author"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-700 dark:text-slate-300">
                              {post.category?.name ?? "General"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                              post.status === "published"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border dark:border-amber-800"
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">{post.views}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button asChild variant="outline" size="sm" className="rounded-full h-8 px-2.5">
                                <Link href={`/post/${post.slug}`} target="_blank">
                                  <Eye className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actionLoading === post.id}
                                onClick={() => handleDeletePost(post.id)}
                                className="rounded-full h-8 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-800"
                                aria-label="Delete post"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

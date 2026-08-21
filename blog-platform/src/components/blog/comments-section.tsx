"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { CommentItem } from "@/lib/types";
import { MessageSquare, Send } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
  initialComments?: CommentItem[];
}

export function CommentsSection({
  postId,
  postSlug,
  initialComments = [],
}: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to submit comment.");
        return;
      }

      setComments([data.comment, ...comments]);
      setBody("");
    } catch {
      setError("Network error while submitting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Discussion ({comments.length})</h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Leave a response as <span className="font-semibold text-slate-900 dark:text-white">{user?.name ?? user?.email}</span>
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What are your thoughts on this article?"
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 transition-colors"
            required
          />
          {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <div className="mt-3 flex justify-end">
            <Button type="submit" disabled={isSubmitting || !body.trim()} className="rounded-full gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-500">
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Posting…" : "Post response"}</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <p className="text-sm text-slate-600 dark:text-slate-400">Join the discussion by signing into your account.</p>
          <Button asChild size="sm" className="mt-3 rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">
            <Link href={`/login?callbackUrl=/post/${postSlug}`}>Sign in to comment</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-indigo-600">
                    {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{comment.author?.name ?? "User"}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

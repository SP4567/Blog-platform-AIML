"use client";

import { useState } from "react";
import { Heart, Bookmark, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface PostEngagementProps {
  postId: string;
  postSlug: string;
  initialLikes?: number;
  initialBookmarks?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
}

export function PostEngagement({
  postId,
  postSlug,
  initialLikes = 0,
  initialIsLiked = false,
  initialIsBookmarked = false,
}: PostEngagementProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/post/${postSlug}`);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const prevLiked = isLiked;
    const prevCount = likes;
    setIsLiked(!prevLiked);
    setLikes(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setIsLiked(data.isLiked);
        setLikes(data.likesCount);
      } else {
        // Rollback
        setIsLiked(prevLiked);
        setLikes(prevCount);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikes(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/post/${postSlug}`);
      return;
    }

    if (isBookmarking) return;
    setIsBookmarking(true);

    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setIsBookmarked(data.isBookmarked);
      } else {
        setIsBookmarked(prevBookmarked);
      }
    } catch {
      setIsBookmarked(prevBookmarked);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access failed
      }
    }
  };

  return (
    <div className="flex items-center gap-3 py-4 border-y border-slate-100 dark:border-slate-800 my-8">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        className={`rounded-full gap-2 transition ${
          isLiked
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-400 dark:hover:bg-rose-900/60"
            : "text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        }`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400" : ""}`} />
        <span>{likes}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        className={`rounded-full gap-2 transition ${
          isBookmarked
            ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-400 dark:hover:bg-amber-900/60"
            : "text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400" : ""}`} />
        <span>{isBookmarked ? "Saved" : "Save"}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="rounded-full gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 ml-auto"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="h-4 w-4" />}
        <span>{copied ? "Link Copied" : "Share"}</span>
      </Button>
    </div>
  );
}

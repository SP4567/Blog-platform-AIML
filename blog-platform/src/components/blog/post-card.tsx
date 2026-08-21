import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { Eye, Heart, MessageSquare } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  const fallbackImage = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";
  const imageUrl = post.image || fallbackImage;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-indigo-950/40">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {post.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          {post.category ? (
            <Link href={`/category/${post.category.slug}`}>
              <Badge className="cursor-pointer hover:bg-slate-200 transition">{post.category.name}</Badge>
            </Link>
          ) : null}
          <span className="text-xs text-slate-500 dark:text-slate-400">{post.readTime}</span>
        </div>
        <Link href={`/post/${post.slug}`} className="mt-3 block text-xl font-semibold text-slate-950 dark:text-white transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {post.title}
        </Link>
        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
        <div className="mt-auto pt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span className="font-medium text-slate-700 dark:text-slate-300">{post.author?.name ?? "Author"}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-slate-400" /> {formatNumber(post.views ?? 0)}</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-400" /> {formatNumber(post.likes ?? 0)}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5 text-slate-400" /> {formatNumber(post.comments ?? 0)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import type { Post } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Badge>{post.category.name}</Badge>
          <span className="text-sm text-slate-500">{post.readTime}</span>
        </div>
        <Link href={`/post/${post.slug}`} className="mt-4 block text-xl font-semibold text-slate-950 transition group-hover:text-slate-700">
          {post.title}
        </Link>
        <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>{post.author.name}</span>
          <span>{formatNumber(post.views)} views</span>
        </div>
      </div>
    </article>
  );
}

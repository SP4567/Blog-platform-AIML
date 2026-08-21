import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";
import type { Category, Post } from "@/lib/types";
import { posts as fallbackPosts, categories as fallbackCategories } from "@/lib/data";

interface LatestPostsProps {
  posts?: Post[];
  categories?: Category[];
}

export function LatestPosts({ posts = [], categories = [] }: LatestPostsProps) {
  const displayPosts = posts.length > 0 ? posts : (fallbackPosts as unknown as Post[]);
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Fresh picks</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Latest stories and insights</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Badge className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">{category.name}</Badge>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

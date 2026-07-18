import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { posts, tags } from "@/lib/data";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = createMetadata("Search", "Search across posts, categories, and topics on Northstar Journal.");

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Search</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Discover stories, authors, and categories</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

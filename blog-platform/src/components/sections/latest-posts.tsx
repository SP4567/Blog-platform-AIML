import { posts, categories } from "@/lib/data";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";

export function LatestPosts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Fresh picks</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Latest stories and insights</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id}>{category.name}</Badge>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

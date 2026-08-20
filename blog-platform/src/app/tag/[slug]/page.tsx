import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { PostCard } from "@/components/blog/post-card";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((entry) => entry.slug === slug);
  if (!tag) return createMetadata("Tag");
  return createMetadata(tag.name, `${tag.name} stories curated for discoverability and topical relevance.`);
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((entry) => entry.slug === slug);
  if (!tag) notFound();

  const posts = await getPostsByTag(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Topic</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-950">#{tag.name}</h1>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No published posts with this tag yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

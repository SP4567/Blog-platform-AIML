import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { tags, posts } from "@/lib/data";
import { PostCard } from "@/components/blog/post-card";

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = tags.find((entry) => entry.slug === slug);
  if (!tag) return createMetadata("Tag");
  return createMetadata(tag.name, `${tag.name} stories curated for discoverability and topical relevance.`);
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = tags.find((entry) => entry.slug === slug);
  if (!tag) notFound();
  const matches = posts.filter((post) => post.tags.some((entry) => entry.slug === slug));

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Tag</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">#{tag.name}</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {matches.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

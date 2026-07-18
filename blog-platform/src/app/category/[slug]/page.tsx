import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { categories, posts } from "@/lib/data";
import { PostCard } from "@/components/blog/post-card";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) return createMetadata("Category");
  return createMetadata(category.name, category.description);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) notFound();
  const matches = posts.filter((post) => post.category.slug === slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Category</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{category.description}</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {matches.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

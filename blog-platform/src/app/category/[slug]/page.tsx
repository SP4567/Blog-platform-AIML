import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getAllCategories, getPostsByCategory } from "@/lib/content";
import { PostCard } from "@/components/blog/post-card";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) return createMetadata("Category");
  return createMetadata(category.name, category.description);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Category</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-950">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{category.description}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No published posts in this category yet.</p>
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

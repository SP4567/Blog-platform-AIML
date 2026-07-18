import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { posts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return createMetadata("Post");
  return createMetadata(post.title, post.excerpt);
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="overflow-hidden rounded-[40px] border border-slate-200/80 bg-white shadow-sm">
        <img src={post.image} alt={post.title} className="h-96 w-full object-cover" />
        <div className="p-10">
          <div className="flex flex-wrap gap-2">
            <Badge>{post.category.name}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-semibold text-slate-950">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{post.author.name}</span>
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="mt-8 rounded-3xl bg-slate-50 p-8 text-lg leading-8 text-slate-700">{post.content}</div>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reader engagement</CardTitle>
            <CardDescription>Views, likes, and comments stay visible for editorial teams.</CardDescription>
          </CardHeader>
          <p className="text-sm leading-7 text-slate-600">This module is ready for analytics integration, live notifications, and comments.</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Editorial workflow</CardTitle>
            <CardDescription>Autosave, drafting, and scheduled publishing are built into the architecture.</CardDescription>
          </CardHeader>
          <p className="text-sm leading-7 text-slate-600">The platform supports version history, restore flows, and moderation queues.</p>
        </Card>
      </div>
    </div>
  );
}

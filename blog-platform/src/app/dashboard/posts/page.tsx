"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPost, loadBlogState, persistBlogState } from "@/lib/blog-state";
import { categories, tags } from "@/lib/data";
import { authors } from "@/lib/data";

export default function PostManagerPage() {
  const [state, setState] = useState(() => loadBlogState());

  useEffect(() => {
    setState(loadBlogState());
  }, []);

  const posts = useMemo(() => state.posts, [state.posts]);

  const handleCreatePost = () => {
    const draftTitle = `Untitled draft ${posts.length + 1}`;
    const nextState = createPost(state, {
      title: draftTitle,
      excerpt: "A new draft is ready for editing.",
      content: "Start writing your story here.",
      slug: draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      categorySlug: categories[0].slug,
      status: "draft",
      readTime: "3 min read",
      author: authors[0],
      category: categories[0],
      tags: [tags[0]],
      featured: false,
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      views: 0,
      likes: 0,
      comments: 0,
      featuredOrder: 99,
    });
    persistBlogState(nextState);
    setState(nextState);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Content management</h1>
        </div>
        <Button className="rounded-full" onClick={handleCreatePost}>New post</Button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.readTime}</CardDescription>
            </CardHeader>
            <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

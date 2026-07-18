import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { posts } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = createMetadata("Admin Posts", "Moderate new posts, schedule publication, and track review state.");

export default function AdminPostsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.category.name}</CardDescription>
            </CardHeader>
            <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
